// =====================================================
// ARNOKIDS CART STORAGE - SUPABASE DATABASE
// =====================================================
// CART TIDAK LAGI DISIMPAN DI localStorage.
// Setiap cart terhubung ke user yang sedang login
// melalui auth.uid() -> cart.user_id.
//
// Tabel Supabase yang digunakan:
// cart
// - id
// - user_id
// - product_id
// - quantity
// =====================================================

async function getCartUser(){

    const {
        data: { user },
        error
    } = await supabaseClient.auth.getUser();

    if(error){
        console.error("Gagal mendapatkan user:", error);
        return null;
    }

    return user || null;
}


// =====================================================
// AMBIL CART DARI SUPABASE
// =====================================================

async function getCart(){

    const user = await getCartUser();

    if(!user){
        return [];
    }

    const { data, error } = await supabaseClient
        .from("cart")
        .select(`
            id,
            user_id,
            product_id,
            quantity,
            products (
                id,
                nama,
                harga,
                gambar,
                video,
                deskripsi
            )
        `)
        .eq("user_id", user.id)
        .order("id", { ascending: true });

    if(error){
        console.error("Gagal membaca cart dari Supabase:", error);
        return [];
    }

    return (data || []).map(row => {

        const p = row.products || {};

        return {
            id: row.id,
            user_id: row.user_id,
            product_id: row.product_id,

            nama: p.nama || "Produk",
            hargaLusin: Number(p.harga || 0),
            gambar: p.gambar || "",
            video: p.video || "",
            deskripsi: p.deskripsi || "",

            jumlah: Number(row.quantity || 1)
        };

    });

}


// =====================================================
// SIMPAN / GANTI JUMLAH ITEM
// =====================================================
// Dipakai jika suatu saat kode lama memanggil saveCart().
// Data tetap disimpan ke Supabase, BUKAN localStorage.

async function saveCart(items){

    const user = await getCartUser();

    if(!user){
        return false;
    }

    // Ambil cart saat ini
    const { data: current, error: currentError } =
        await supabaseClient
            .from("cart")
            .select("id, product_id")
            .eq("user_id", user.id);

    if(currentError){
        console.error("Gagal membaca cart:", currentError);
        return false;
    }

    const wanted = new Map(
        (items || []).map(item => [
            item.product_id || item.id,
            Number(item.jumlah || 1)
        ])
    );

    // Update / insert item
    for(const [productId, quantity] of wanted){

        if(!productId) continue;

        const existing = (current || []).find(
            row => row.product_id === productId
        );

        if(existing){

            const { error } = await supabaseClient
                .from("cart")
                .update({ quantity })
                .eq("id", existing.id)
                .eq("user_id", user.id);

            if(error){
                console.error("Gagal update cart:", error);
                return false;
            }

        }else{

            const { error } = await supabaseClient
                .from("cart")
                .insert({
                    user_id: user.id,
                    product_id: productId,
                    quantity
                });

            if(error){
                console.error("Gagal insert cart:", error);
                return false;
            }

        }

    }

    // Hapus item database yang sudah tidak ada di items
    const wantedIds = new Set(
        [...wanted.keys()].map(String)
    );

    for(const row of (current || [])){

        if(!wantedIds.has(String(row.product_id))){

            const { error } = await supabaseClient
                .from("cart")
                .delete()
                .eq("id", row.id)
                .eq("user_id", user.id);

            if(error){
                console.error("Gagal menghapus cart:", error);
                return false;
            }

        }

    }

    return true;
}


// =====================================================
// JUMLAH CART
// =====================================================

async function getCartCount(){

    const user = await getCartUser();

    if(!user) return 0;

    const { count, error } = await supabaseClient
        .from("cart")
        .select("id", {
            count: "exact",
            head: true
        })
        .eq("user_id", user.id);

    if(error){
        console.error("Gagal menghitung cart:", error);
        return 0;
    }

    return count || 0;
}
