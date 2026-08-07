let products = [];

async function loadProducts() {

    const { data, error } = await supabaseClient
    .from("products")
    .select(`
        *,
        brands(nama),
        categories(nama)
    `)
    .order("nama", { ascending: true });
    console.log("DATA DARI SUPABASE :", data);
    console.log("ERROR :", error);

    if (error) return;

    products = data.map(item => ({

    id: item.id,

    nama: item.nama,

    hargaLusin: Number(item.harga),

    merek: item.brands?.nama || "",

    kategori: item.categories?.nama || "",

    gambar: item.gambar,

    video: item.video || "",

    deskripsi: item.deskripsi || ""

}));

    console.log("PRODUCTS WEBSITE :", products);

    render(products);
}

loadProducts();