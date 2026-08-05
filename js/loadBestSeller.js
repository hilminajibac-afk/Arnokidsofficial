async function loadBestSeller(){

    const { data, error } = await supabaseClient
        .from("products")
        .select(`
            *,
            brands(nama),
            categories(nama)
        `)
        .eq("best_seller", true)
        .order("best_order",{ascending:true})
        .limit(8);

    if(error){

        console.error(error);

        return;

    }

const bestSeller = data.map(item => ({
    nama: item.nama,
    hargaLusin: Number(item.harga),
    merek: item.brands?.nama || "",
    kategori: item.categories?.nama || "",
    gambar: item.gambar,
    video: item.video || "",
    deskripsi: item.deskripsi || ""
}));


renderBestSeller(bestSeller);

}

loadBestSeller();