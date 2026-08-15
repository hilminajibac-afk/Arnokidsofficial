async function loadNewProducts(){

    const { data, error } = await supabaseClient
        .from("products")
        .select(`
            *,
            brands(nama),
            categories(nama)
        `)
        .order("created_at", { ascending:false })
        .limit(8);

    if(error){

        console.error("ERROR PRODUK TERBARU:", error);

        return;

    }

    const newest = data.map(item => ({

        // PENTING: ID SUPABASE HARUS IKUT
        id: item.id,

        nama: item.nama,

        hargaLusin: Number(item.harga),

        merek: item.brands?.nama || "",

        kategori: item.categories?.nama || "",

        gambar: item.gambar,

        video: item.video || "",

        deskripsi: item.deskripsi || ""

    }));

    console.log("PRODUK TERBARU:", newest);

    renderNewProducts(newest);

}

loadNewProducts();