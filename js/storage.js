// ==========================================
// CART PER USER
// ==========================================


// ==========================================
// AMBIL ID USER AKTIF
// ==========================================

function getActiveUserId(){

    return localStorage.getItem(
        "activeCartUser"
    );

}


// ==========================================
// AMBIL KERANJANG
// ==========================================

function getCart(){

    const userId =
        getActiveUserId();


    // Belum ada user aktif
    if(!userId){

        return [];

    }


    const key =
        "cart_" + userId;


    try{

        return JSON.parse(
            localStorage.getItem(key)
        ) || [];

    }catch(error){

        console.error(
            "Gagal membaca cart:",
            error
        );

        return [];

    }

}


// ==========================================
// SIMPAN KERANJANG
// ==========================================

function saveCart(data){

    const userId =
        getActiveUserId();


    // Jangan simpan cart kalau belum login
    if(!userId){

        return;

    }


    const key =
        "cart_" + userId;


    localStorage.setItem(
        key,
        JSON.stringify(data)
    );

}