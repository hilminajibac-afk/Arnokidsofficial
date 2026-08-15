/* =====================================================
   ALL PRODUCTS PAGE
   MODE + BRAND + CATEGORY FILTER
===================================================== */

let allProductsMode = "all";

let allProductsBrand = "Semua";

let allProductsCategory = "Semua";


/* =====================================================
   SHOW MODE
===================================================== */

function showAllProductsMode(mode){

    allProductsMode = mode;


    const allSection =
        document.getElementById("allProducts");

    const bestSection =
        document.getElementById("bestSellerSection");

    const newSection =
        document.getElementById("newProductsSection");


    /* SEMBUNYIKAN SEMUA */

    if(allSection)
        allSection.style.display = "none";

    if(bestSection)
        bestSection.style.display = "none";

    if(newSection)
        newSection.style.display = "none";


    /* TAMPILKAN YANG DIPILIH */

    if(mode === "all" && allSection){

        allSection.style.display = "block";

    }


    if(mode === "best" && bestSection){

        bestSection.style.display = "block";

    }


    if(mode === "new" && newSection){

        newSection.style.display = "block";

    }


    /* ACTIVE BUTTON */

    document
        .querySelectorAll(".product-mode-btn")
        .forEach(button => {

            button.classList.remove("active");

        });


    const activeButton =
        document.querySelector(
            `.product-mode-btn[data-mode="${mode}"]`
        );


    if(activeButton){

        activeButton.classList.add("active");

    }


    renderAllProductsMode();

}


/* =====================================================
   AMBIL DATA SESUAI MODE
===================================================== */

async function getModeProducts(){

    let query =
        supabaseClient
            .from("products")
            .select(`
                *,
                brands(nama),
                categories(nama)
            `);


    /* =========================
       BEST SELLER
    ========================= */

    if(allProductsMode === "best"){

        query =
            query
                .eq("best_seller", true)
                .order(
                    "best_order",
                    {
                        ascending: true
                    }
                );

    }


    /* =========================
       PRODUK TERBARU
    ========================= */

    else if(allProductsMode === "new"){

        query =
            query
                .order(
                    "created_at",
                    {
                        ascending: false
                    }
                )
                .limit(10);

    }


    /* =========================
       SEMUA PRODUK
    ========================= */

    else{

        query =
            query
                .order(
                    "nama",
                    {
                        ascending: true
                    }
                );

    }


    const {
        data,
        error
    } = await query;


    if(error){

        console.error(
            "Gagal mengambil produk:",
            error
        );

        return [];

    }


    return data.map(item => ({

        id:
            item.id,

        nama:
            item.nama,

        hargaLusin:
            Number(item.harga),

        merek:
            item.brands?.nama || "",

        kategori:
            item.categories?.nama || "",

        gambar:
            item.gambar,

        video:
            item.video || "",

        deskripsi:
            item.deskripsi || "",

        best_seller:
            item.best_seller === true,

        best_order:
            item.best_order ?? 999999,

        created_at:
            item.created_at

    }));

}


/* =====================================================
   FILTER BRAND + KATEGORI
===================================================== */

function filterModeProducts(data){

    let result = [...data];


    /* =========================
       BRAND
    ========================= */

    if(
        allProductsBrand &&
        allProductsBrand !== "Semua"
    ){

        result =
            result.filter(product =>
                product.merek ===
                allProductsBrand
            );

    }


    /* =========================
       KATEGORI
    ========================= */

    if(
        allProductsCategory &&
        allProductsCategory !== "Semua"
    ){

        result =
            result.filter(product =>
                product.kategori ===
                allProductsCategory
            );

    }


    return result;

}


/* =====================================================
   RENDER MODE
===================================================== */

async function renderAllProductsMode(){

    const data =
        await getModeProducts();

    const filtered =
        filterModeProducts(data);


    /* =========================
       SEMUA PRODUK
    ========================= */

    /* =========================
       UPDATE JUMLAH PRODUK
       sesuai mode + filter aktif
    ========================= */

    updateAllProductCounts(filtered);


    /* =========================
       SEMUA PRODUK
    ========================= */

    if(allProductsMode === "all"){

        render(filtered);

        return;
    }


    /* =========================
       BEST SELLER
    ========================= */

    if(allProductsMode === "best"){

        renderGridProducts(
            "bestSellerProducts",
            filtered
        );

        return;
    }


    /* =========================
       PRODUK TERBARU
    ========================= */

    if(allProductsMode === "new"){

        renderGridProducts(
            "newProductList",
            filtered
        );

    }

}


/* =====================================================
   JUMLAH PRODUK
===================================================== */

function updateAllProductCounts(data){

    const count = Array.isArray(data)
        ? data.length
        : 0;

    const allCount =
        document.getElementById("productCount");

    const bestCount =
        document.getElementById("bestSellerCount");

    const newCount =
        document.getElementById("newProductCount");


    /*
       Tampilkan jumlah pada mode yang sedang aktif.
       Nilainya tetap berasal dari data hasil filter.
    */

    if(allCount){
        allCount.textContent =
            `${allProductsMode === "all" ? count : 0} produk`;
    }

    if(bestCount){
        bestCount.textContent =
            `${allProductsMode === "best" ? count : 0} produk`;
    }

    if(newCount){
        newCount.textContent =
            `${allProductsMode === "new" ? count : 0} produk`;
    }

}


/* =====================================================
   RENDER SWIPER BEST SELLER / NEW
===================================================== */
function renderGridProducts(
    boxId,
    data
){

    const box =
        document.getElementById(boxId);

    if(!box) return;


    box.innerHTML = "";


    /* =========================
       TIDAK ADA PRODUK
    ========================= */

    if(data.length === 0){

        box.innerHTML = `

            <div class="empty-products">

                <i class="fa-solid fa-box-open"></i>

                <p>
                    Tidak ada produk
                    yang sesuai.
                </p>

            </div>

        `;

        return;
    }


    /* =========================
       GRID
    ========================= */

    data.forEach(product => {

        const realIndex =
            products.findIndex(
                p => p.id === product.id
            );


        box.insertAdjacentHTML(
            "beforeend",

            createProductCard(
                product,
                realIndex
            )

        );

    });


    /* =========================
       WISHLIST
    ========================= */

    if(
        typeof syncWishlistButtons ===
        "function"
    ){

        syncWishlistButtons();

    }

}

/* =====================================================
   FILTER BRAND
===================================================== */

function filterBrand(merek){

    allProductsBrand =
        merek || "Semua";


    renderAllProductsMode();

}


/* =====================================================
   FILTER KATEGORI
===================================================== */

function filterCategory(kategori){

    allProductsCategory =
        kategori || "Semua";


    renderAllProductsMode();

}


/* =====================================================
   RESET FILTER
===================================================== */

function resetAllProductsFilter(){

    allProductsBrand = "Semua";

    allProductsCategory = "Semua";


    renderAllProductsMode();

}


/* =====================================================
   MODE BUTTON
===================================================== */

document.addEventListener(
    "DOMContentLoaded",
    function(){

        document
            .querySelectorAll(
                ".product-mode-btn"
            )
            .forEach(button => {

                button.addEventListener(
                    "click",
                    function(){

                        const mode =
                            this.dataset.mode;


                        /*
                           Kalau pindah mode,
                           filter tetap dipertahankan.

                           Jadi misalnya:

                           Best Seller
                           + ARNOKIDS
                           ↓
                           klik Produk Terbaru
                           ↓
                           Produk Terbaru
                           + ARNOKIDS
                        */

                        showAllProductsMode(
                            mode
                        );

                    }
                );

            });


        /*
           MODE DARI URL
           ?filter=bestseller
           ?filter=new
           tanpa filter = semua produk
        */
        const requestedFilter =
            new URLSearchParams(window.location.search).get("filter");

        const initialMode =
            requestedFilter === "bestseller"
                ? "best"
                : requestedFilter === "new"
                    ? "new"
                    : "all";

        showAllProductsMode(initialMode);

    }
);