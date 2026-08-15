// ==========================================
// TOGGLE WISHLIST
// ==========================================

async function toggleWishlist(productId, btn){

    const {
        data: { session }
    } = await supabaseClient.auth.getSession();


    // Belum login
    if(!session){

        window.location.href = "login.html";

        return;

    }


    const userId = session.user.id;


    // Cek apakah produk sudah ada
    const {
        data: existing,
        error: checkError
    } = await supabaseClient

        .from("wishlist")

        .select("id")

        .eq("user_id", userId)

        .eq("product_id", productId)

        


    if(checkError){

        console.error(
            "Gagal mengecek wishlist:",
            checkError
        );

        return;

    }


    // ==========================================
    // JIKA SUDAH ADA → HAPUS
    // ==========================================

    if(existing && existing.length > 0){

    const { error } =
        await supabaseClient
        .from("wishlist")
        .delete()
        .eq("user_id", userId)
        .eq("product_id", productId);

    if(error){

        console.error(
            "Gagal menghapus wishlist:",
            error
        );

        return;
    }

    setWishlistButton(btn, false);

    await updateWishlistCount();
    await syncWishlistButtons();

    return;
}


    // ==========================================
    // JIKA BELUM ADA → TAMBAHKAN
    // ==========================================

    const { error } =
        await supabaseClient

        .from("wishlist")

        .insert({

            user_id: userId,

            product_id: productId

        });


    if(error){

        console.error(
            "Gagal menambahkan wishlist:",
            error
        );

        return;

    }


    setWishlistButton(btn, true);

    await updateWishlistCount();
    await syncWishlistButtons();

}


// ==========================================
// UBAH TAMPILAN ICON
// ==========================================

function setWishlistButton(btn, active){

    if(!btn) return;


    const icon =
        btn.querySelector("i");


    if(active){

        btn.classList.add("active");

        icon.classList.remove(
            "fa-regular"
        );

        icon.classList.add(
            "fa-solid"
        );

    }else{

        btn.classList.remove("active");

        icon.classList.remove(
            "fa-solid"
        );

        icon.classList.add(
            "fa-regular"
        );

    }

}


// ==========================================
// SINKRONKAN ICON DENGAN DATABASE
// ==========================================

async function syncWishlistButtons(){

    const {
        data: { session }
    } = await supabaseClient.auth.getSession();


    // Belum login
    if(!session){

        return;

    }


    const {
        data,
        error
    } = await supabaseClient

        .from("wishlist")

        .select("product_id")

        .eq(
            "user_id",
            session.user.id
        );


    if(error){

        console.error(
            "Gagal mengambil wishlist:",
            error
        );

        return;

    }


    // Reset semua icon dulu
    document
        .querySelectorAll(".wishlist-btn")
        .forEach(btn => {

            setWishlistButton(
                btn,
                false
            );

        });


    // Aktifkan yang ada di database
    data.forEach(item => {

        const btn =
            document.querySelector(
                `.wishlist-btn[data-id="${item.product_id}"]`
            );


        if(btn){

            setWishlistButton(
                btn,
                true
            );

        }

    });

}


// ==========================================
// LOAD HALAMAN WISHLIST
// ==========================================

async function loadWishlist(){

    const container =
        document.getElementById(
            "wishlistContainer"
        );


    const emptyWishlist =
        document.getElementById(
            "emptyWishlist"
        );


    // Kalau bukan halaman wishlist
    if(!container){

        return;

    }


    const {
        data: { session }
    } = await supabaseClient.auth.getSession();


    // Belum login
    if(!session){

        window.location.href =
            "login.html";

        return;

    }


    // Ambil wishlist
    const {
        data: wishlistData,
        error: wishlistError
    } = await supabaseClient

        .from("wishlist")

        .select("product_id")

        .eq(
            "user_id",
            session.user.id
        );


    if(wishlistError){

        console.error(
            "Wishlist error:",
            wishlistError
        );

        return;

    }


    // Wishlist kosong
    if(
        !wishlistData ||
        wishlistData.length === 0
    ){

        container.innerHTML = "";

        emptyWishlist.classList.add(
            "show"
        );

        return;

    }


    emptyWishlist.classList.remove(
        "show"
    );


    const productIds =
        wishlistData.map(
            item => item.product_id
        );


    // Ambil produk
    const {
        data: productsData,
        error: productsError
    } = await supabaseClient

        .from("products")

        .select("*")

        .in(
            "id",
            productIds
        );


    if(productsError){

        console.error(
            "Products error:",
            productsError
        );

        return;

    }


    container.innerHTML = "";


    productIds.forEach(id => {

        const product =
            productsData.find(
                item => item.id === id
            );


        if(!product) return;


        container.innerHTML += `

            <div class="wishlist-card">

                <img
                    src="${product.gambar}"
                    alt="${product.nama}"
                >

                <div class="wishlist-info">

                    <h3>
                        ${product.nama}
                    </h3>

                    <div class="wishlist-price">

                        Rp ${Number(
                            product.harga
                        ).toLocaleString("id-ID")}

                        <span>/ lusin</span>

                    </div>


                    <div class="wishlist-action">

                        <button
                            class="btn-detail"
                            onclick="openWishlistProduct('${product.id}')">

                            Lihat Produk

                        </button>


                        <button
                            class="btn-delete"
                            onclick="deleteWishlist('${product.id}')">

                            <i class="fa-solid fa-trash"></i>

                        </button>

                    </div>

                </div>

            </div>

        `;

    });

}

async function updateWishlistCount(){

    const { data:{session} } =
        await supabaseClient.auth.getSession();

    if(!session){

        setWishlistCount(0);

        return;

    }

    const { count, error } =
        await supabaseClient

        .from("wishlist")

        .select("*", {
            count:"exact",
            head:true
        })

        .eq("user_id", session.user.id);


    if(error){

        console.error(
            "Gagal mengambil jumlah wishlist:",
            error
        );

        return;

    }


    setWishlistCount(count || 0);

}

function setWishlistCount(count){

    const desktop =
        document.getElementById("wishlist-count");

    const mobile =
        document.getElementById("bottom-wishlist-count");


    if(desktop){

        if(count > 0){

            desktop.textContent = count;
            desktop.style.display = "flex";

        }else{

            desktop.textContent = "";
            desktop.style.display = "none";

        }

    }


    if(mobile){

        if(count > 0){

            mobile.textContent = count;
            mobile.style.display = "flex";

        }else{

            mobile.textContent = "";
            mobile.style.display = "none";

        }

    }

}

// ==========================================
// HAPUS WISHLIST DARI HALAMAN WISHLIST
// ==========================================

async function deleteWishlist(productId){

    const {
        data: { session }
    } = await supabaseClient.auth.getSession();


    if(!session){

        window.location.href =
            "login.html";

        return;

    }


    const { error } =
        await supabaseClient

        .from("wishlist")

        .delete()

        .eq(
            "user_id",
            session.user.id
        )

        .eq(
            "product_id",
            productId
        );


    if(error){

        console.error(
            "Gagal menghapus wishlist:",
            error
        );

        showToast("Gagal menghapus wishlist.");

        return;

    }

    await updateWishlistCount();
    loadWishlist();

}

async function openWishlist(){

    const {
        data: { session }
    } = await supabaseClient.auth.getSession();


    if(!session){

        window.location.href =
            "login.html";

        return;

    }


    window.location.href =
        "wishlist.html";

}


// ==========================================
// LIHAT PRODUK
// ==========================================

function openWishlistProduct(productId){

    window.location.href =
        `product.html?id=${encodeURIComponent(productId)}`;

}




// ==========================================
// JIKA HALAMAN WISHLIST
// ==========================================

loadWishlist();
updateWishlistCount();
syncWishlistButtons();

/* =====================================================
   SINKRONISASI LINTAS HALAMAN
   Halaman yang kembali dari bfcache harus membaca
   status wishlist terbaru dari database.
===================================================== */
window.addEventListener("pageshow", function(){
    syncWishlistButtons();
    updateWishlistCount();
});

document.addEventListener("visibilitychange", function(){
    if(document.visibilityState === "visible"){
        syncWishlistButtons();
        updateWishlistCount();
    }
});