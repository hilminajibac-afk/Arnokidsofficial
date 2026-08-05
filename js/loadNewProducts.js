async function loadNewProducts(){

    const { data, error } = await supabaseClient
        .from("products")
        .select(`
            *,
            brands(nama),
            categories(nama)
        `)
        .order("created_at",{ascending:false})
        .limit(8);

    if(error){

        console.error(error);

        return;

    }

    const newest = data.map(item=>({

        nama:item.nama,

        hargaLusin:Number(item.harga),

        merek:item.brands?.nama || "",

        kategori:item.categories?.nama || "",

        gambar:item.gambar,

        video:item.video || "",

        deskripsi:item.deskripsi || ""

    }));

    renderNewProducts(newest);

}

loadNewProducts();