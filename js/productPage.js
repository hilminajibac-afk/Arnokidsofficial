/* =====================================================
   ARNOKIDS PRODUCT PAGE
===================================================== */

let currentProduct = null;

let currentImages = [];

let currentImageIndex = 0;

let productQuantity = 1;


/* =====================================================
   AMBIL ID DARI URL
===================================================== */

const params =
    new URLSearchParams(
        window.location.search
    );

const productId =
    params.get("id");


/* =====================================================
   FORMAT HARGA
===================================================== */

function formatRupiah(value){

    return "Rp " +
        Number(value || 0)
        .toLocaleString("id-ID");

}


/* =====================================================
   LOAD PRODUCT
===================================================== */

async function loadProductDetail(){

    if(!productId){

        showProductError(
            "Produk tidak ditemukan."
        );

        return;

    }


    const {
        data,
        error
    } = await supabaseClient

        .from("products")

        .select(`
            *,
            brands(nama),
            categories(nama)
        `)

        .eq("id", productId)

        .single();


    if(error){

        console.error(
            "Gagal mengambil produk:",
            error
        );

        showProductError(
            "Produk tidak ditemukan."
        );

        return;

    }


    currentProduct = {

        id:
            data.id,

        nama:
            data.nama,

        hargaLusin:
            Number(data.harga),

        merek:
            data.brands?.nama || "",

        kategori:
            data.categories?.nama || "",

        gambar:
            data.gambar || "",

        video:
            data.video || "",

        deskripsi:
            data.deskripsi || "",

        kode:
            data.kode ||
            data.kode_produk ||
            data.sku ||
            data.id,

        stok:
            data.stok ??
            data.stock ??
            null

    };


    renderProductDetail();

    loadRelatedProducts();

}



/* =====================================================
   RENDER DETAIL
===================================================== */

function renderProductDetail(){

    const p =
        currentProduct;


    document.title =
        `${p.nama} | ARNOKIDS`;


    /* BREADCRUMB */

    const breadcrumb =
        document.getElementById(
            "breadcrumbProduct"
        );

    if(breadcrumb){

        breadcrumb.textContent =
            p.nama;

    }


    /* BRAND */

    document.getElementById(
        "productBrand"
    ).textContent =
        p.merek || "ARNOKIDS";


    /* NAMA */

    document.getElementById(
        "productName"
    ).textContent =
        p.nama;


    /* KODE */

    document.getElementById(
        "productCode"
    ).textContent =
        p.nama;


    /* HARGA */

    document.getElementById(
        "productPrice"
    ).textContent =
        formatRupiah(
            p.hargaLusin
        );


    /* STOK */

    const stockText =
        document.getElementById(
            "productStock"
        );


    if(p.stok === null){

        stockText.textContent =
            "Tersedia";

    }

    else if(Number(p.stok) > 0){

        stockText.textContent =
            "Tersedia";

    }

    else{

        stockText.textContent =
            "Stok habis";

    }


    /* DESKRIPSI */

    document.getElementById(
        "infoDescription"
    ).textContent =
        p.deskripsi ||
        "Produk berkualitas dari ARNOKIDS.";


    /* INFORMASI */

    document.getElementById(
        "infoBrand"
    ).textContent =
        p.merek || "ARNOKIDS";


    document.getElementById(
        "infoCode"
    ).textContent =
        p.nama;


    document.getElementById(
        "infoCategory"
    ).textContent =
        p.kategori || "-";


    document.getElementById(
        "infoPrice"
    ).textContent =
        formatRupiah(
            p.hargaLusin
        ) +
        " / lusin";


    /* GALERI */

    buildGallery(p);


    /* WISHLIST */

    const wishlistBtn =
        document.getElementById("productWishlistBtn");

    if(wishlistBtn && currentProduct){

        wishlistBtn.dataset.id =
            currentProduct.id;

        wishlistBtn.onclick = function(){

            toggleWishlist(
                currentProduct.id,
                wishlistBtn
            );

        };

        if(typeof syncWishlistButtons === "function"){
            syncWishlistButtons();
        }

    }


    /* QUANTITY */

    productQuantity = 1;

    document.getElementById(
        "productQty"
    ).textContent =
        productQuantity;

}



/* =====================================================
   GALERI
===================================================== */

function buildGallery(p){

    currentImages = [];


    if(p.gambar){

        currentImages.push(
            p.gambar
        );

    }


    /*
       Kalau nanti database punya
       gambar_2, gambar_3, gambar_4,
       otomatis bisa ditambahkan.
    */

    if(p.gambar_2){

        currentImages.push(
            p.gambar_2
        );

    }

    if(p.gambar_3){

        currentImages.push(
            p.gambar_3
        );

    }

    if(p.gambar_4){

        currentImages.push(
            p.gambar_4
        );

    }


    if(currentImages.length === 0){

        currentImages.push(
            "images/no-image.png"
        );

    }


    currentImageIndex = 0;


    renderMainImage();

    renderThumbnails();

}



/* =====================================================
   MAIN IMAGE
===================================================== */

function renderMainImage(){

    const image =
        document.getElementById(
            "productMainImage"
        );


    image.src =
        currentImages[
            currentImageIndex
        ];

    image.alt =
        currentProduct.nama;

}



/* =====================================================
   THUMBNAILS
===================================================== */

function renderThumbnails(){

    const box =
        document.getElementById(
            "productThumbnails"
        );


    box.innerHTML = "";


    currentImages.forEach(
        (src,index)=>{

            box.innerHTML += `

                <button
                    type="button"
                    class="product-thumbnail
                    ${index === 0 ? "active" : ""}"
                    onclick="changeProductImage(${index})">

                    <img
                        src="${src}"
                        alt="${currentProduct.nama}">

                </button>

            `;

        }
    );

}



/* =====================================================
   GANTI FOTO
===================================================== */

function changeProductImage(index){

    currentImageIndex =
        index;


    renderMainImage();


    document
        .querySelectorAll(
            ".product-thumbnail"
        )
        .forEach(
            (button,i)=>{

                button.classList.toggle(
                    "active",
                    i === index
                );

            }
        );

}



/* =====================================================
   NEXT / PREV
===================================================== */

document
    .getElementById("galleryNext")
    .addEventListener(
        "click",
        function(){

            if(currentImages.length <= 1)
                return;


            currentImageIndex++;

            if(
                currentImageIndex >=
                currentImages.length
            ){

                currentImageIndex = 0;

            }


            changeProductImage(
                currentImageIndex
            );

        }
    );


document
    .getElementById("galleryPrev")
    .addEventListener(
        "click",
        function(){

            if(currentImages.length <= 1)
                return;


            currentImageIndex--;

            if(
                currentImageIndex < 0
            ){

                currentImageIndex =
                    currentImages.length - 1;

            }


            changeProductImage(
                currentImageIndex
            );

        }
    );



/* =====================================================
   QUANTITY
===================================================== */

document
    .getElementById("qtyMinus")
    .addEventListener(
        "click",
        function(){

            if(productQuantity <= 1)
                return;


            productQuantity--;


            document.getElementById(
                "productQty"
            ).textContent =
                productQuantity;

        }
    );


document
    .getElementById("qtyPlus")
    .addEventListener(
        "click",
        function(){

            productQuantity++;


            document.getElementById(
                "productQty"
            ).textContent =
                productQuantity;

        }
    );



/* =====================================================
   ADD TO CART
===================================================== */

document
    .getElementById("addCartBtn")
    .addEventListener(
        "click",
        async function(){

            if(!currentProduct)
                return;


            const {
                data: { session }
            } = await supabaseClient.auth.getSession();


            if(!session){

                const redirect =
                    encodeURIComponent(
                        window.location.pathname.split("/").pop() +
                        window.location.search
                    );

                window.location.href =
                    `login.html?redirect=${redirect}`;

                return;

            }


            const {
                data: { user }
            } = await supabaseClient.auth.getUser();


            if(!user) return;


            const {
                data: existing,
                error: findError
            } = await supabaseClient

                .from("cart")

                .select("id, quantity")

                .eq("user_id", user.id)

                .eq(
                    "product_id",
                    currentProduct.id
                )

                .maybeSingle();


            if(findError){

                console.error(
                    "Gagal mengecek cart:",
                    findError
                );

                showToast(
                    "Gagal menambahkan ke keranjang."
                );

                return;

            }


            if(existing){

                const {
                    error
                } = await supabaseClient

                    .from("cart")

                    .update({

                        quantity:
                            Number(existing.quantity || 0) +
                            Number(productQuantity)

                    })

                    .eq(
                        "id",
                        existing.id
                    );


                if(error){

                    console.error(
                        "Gagal update cart:",
                        error
                    );

                    showToast(
                        "Gagal menambahkan ke keranjang."
                    );

                    return;

                }

            }else{

                const {
                    error
                } = await supabaseClient

                    .from("cart")

                    .insert({

                        user_id:
                            user.id,

                        product_id:
                            currentProduct.id,

                        quantity:
                            Number(productQuantity)

                    });


                if(error){

                    console.error(
                        "Gagal insert cart:",
                        error
                    );

                    showToast(
                        "Gagal menambahkan ke keranjang."
                    );

                    return;

                }

            }


            await updateCartBadge();


            if(
                typeof flyToCart ===
                "function"
            ){

                const productImage =
                    document.getElementById(
                        "productMainImage"
                    );

                flyToCart(
                    productImage
                );

            }


            if(
                typeof showToast ===
                "function"
            ){

                showToast(
                    "Produk berhasil ditambahkan"
                );

            }

        }
    );



/* =====================================================
   ORDER WHATSAPP
===================================================== */

document
    .getElementById("orderWaBtn")
    .addEventListener(
        "click",
        function(){

            if(!currentProduct)
                return;


            const subtotal =
                currentProduct.hargaLusin *
                productQuantity;


            const text =

                `Halo Admin ARNOKIDS,%0A%0A` +

                `Saya ingin memesan:%0A%0A` +

                `Produk : ${currentProduct.nama}%0A` +

                `Jumlah : ${productQuantity} Lusin%0A` +

                `Harga : ${formatRupiah(currentProduct.hargaLusin)} / Lusin%0A` +

                `Subtotal : ${formatRupiah(subtotal)}%0A%0A` +

                `Kode : ${currentProduct.kode}`;


            window.open(

                `https://wa.me/${phone}?text=${text}`,

                "_blank"

            );

        }
    );



/* =====================================================
   RELATED PRODUCTS
===================================================== */

async function loadRelatedProducts(){

    const box =
        document.getElementById("relatedProducts");

    if(!box || !currentProduct) return;

    const {
        data,
        error
    } = await supabaseClient
        .from("products")
        .select(`
            *,
            brands(nama),
            categories(nama)
        `)
        .neq("id", currentProduct.id)
        .limit(20);

    if(error){

        console.error(
            "Produk terkait error:",
            error
        );

        return;
    }

    window.relatedProductsData = data || [];

    renderRelatedProducts();

}


function renderRelatedProducts(){

    const box =
        document.getElementById("relatedProducts");

    if(!box) return;

    let data =
        [...(window.relatedProductsData || [])];

    const sort =
        typeof relatedSort !== "undefined"
            ? relatedSort
            : "az";

    if(sort === "az"){

        data.sort((a,b) =>
            (a.nama || "").localeCompare(
                b.nama || "",
                "id"
            )
        );

    }else if(sort === "za"){

        data.sort((a,b) =>
            (b.nama || "").localeCompare(
                a.nama || "",
                "id"
            )
        );

    }else if(sort === "murah"){

        data.sort(
            (a,b) =>
                Number(a.harga || 0) -
                Number(b.harga || 0)
        );

    }else if(sort === "mahal"){

        data.sort(
            (a,b) =>
                Number(b.harga || 0) -
                Number(a.harga || 0)
        );

    }

    box.innerHTML = "";

    data.slice(0, 8).forEach(p=>{

        box.innerHTML += `

            <div
                class="related-card"
                onclick="openRelatedProduct('${p.id}')">

                <div class="related-card-image">

                    <img
                        src="${p.gambar || "images/no-image.png"}"
                        alt="${p.nama}">

                    <button
                        type="button"
                        class="related-card-wishlist wishlist-btn"
                        data-id="${p.id}"
                        aria-label="Tambah ke wishlist"
                        title="Tambah ke wishlist"
                        onclick="event.stopPropagation(); toggleWishlist('${p.id}', this);">

                        <i class="fa-regular fa-heart"></i>

                    </button>

                </div>

                <div class="related-card-info">

                    <div class="related-card-brand">
                        ${p.brands?.nama || ""}
                    </div>

                    <div class="related-card-name">
                        ${p.nama}
                    </div>

                    <div class="related-card-category">
                        ${p.categories?.nama || ""}
                    </div>

                    <div class="related-card-price">
                        ${formatRupiah(p.harga)}
                        / lusin
                    </div>

                </div>

            </div>

        `;

    });

    if(typeof syncWishlistButtons === "function"){
        syncWishlistButtons();
    }

}


/* =====================================================
   BUKA PRODUK TERKAIT
===================================================== */

function openRelatedProduct(id){

    window.location.href =
        `product.html?id=${encodeURIComponent(id)}`;

}



/* =====================================================
   ERROR
===================================================== */

function showProductError(message){

    document.querySelector(
        ".product-page"
    ).innerHTML = `

        <div
            style="
                text-align:center;
                padding:100px 20px;
            ">

            <i
                class="fa-solid fa-box-open"
                style="
                    font-size:60px;
                    color:#ccc;
                ">
            </i>

            <h2>
                ${message}
            </h2>

            <p>
                Produk mungkin sudah
                tidak tersedia.
            </p>

            <a
                href="allProducts.html"
                style="
                    display:inline-block;
                    margin-top:20px;
                    padding:12px 22px;
                    background:#0E1F4D;
                    color:#fff;
                    border-radius:8px;
                    text-decoration:none;
                ">

                Kembali ke Produk

            </a>

        </div>

    `;

}



/* =====================================================
   START
===================================================== */

document.addEventListener(
    "DOMContentLoaded",
    function(){

        loadProductDetail();

    }
);