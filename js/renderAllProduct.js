/* =====================================================
   BUKA PRODUCT PAGE
   Dipakai oleh seluruh card di allProducts.html
===================================================== */

function openProductById(productId){

    if(!productId){

        console.error(
            "ID produk tidak ditemukan:",
            productId
        );

        return;

    }

    window.location.href =
        "product.html?id=" +
        encodeURIComponent(productId);

}


function createProductCard(p, index){

    return `
        <div
            class="product-card"
            onclick="openProductById('${p.id}')">

            <div class="product-card-image">

                <img
                    src="${p.gambar || "images/no-image.png"}"
                    alt="${p.nama}">

                <button
                    type="button"
                    class="product-card-wishlist wishlist-btn"
                    data-id="${p.id}"
                    aria-label="Tambah ke wishlist"
                    title="Tambah ke wishlist"
                    onclick="event.stopPropagation(); toggleWishlist('${p.id}', this);">

                    <i class="fa-regular fa-heart"></i>

                </button>

            </div>

            <div class="product-card-info">

                <div class="product-card-brand">
                    ${p.merek || ""}
                </div>

                <div class="product-card-name">
                    ${p.nama}
                </div>

                <div class="product-card-category">
                    ${p.kategori || ""}
                </div>

                <div class="product-card-price">
                    Rp ${Number(p.hargaLusin || 0).toLocaleString("id-ID")}
                    <span>/ lusin</span>
                </div>

            </div>

        </div>
    `;
}

function render(data){

    const box =
        document.getElementById("products");

    if(!box) return;

    box.innerHTML = "";

    data.forEach((p,index)=>{

        box.insertAdjacentHTML(
            "beforeend",
            createProductCard(p,index)
        );

    });

    if(typeof syncWishlistButtons === "function"){
        syncWishlistButtons();
    }

}

function renderBestSeller(data){

    const box = document.getElementById("bestSellerProducts");

    if(!box) return;

    box.innerHTML = "";

    data.forEach(p=>{

        const card = createProductCard(p);

        /* INDEX: tetap memakai Swiper */
        if(box.closest(".bestSellerSwiper")){

            box.insertAdjacentHTML(
                "beforeend",
                `<div class="swiper-slide">${card}</div>`
            );

        }else{

            /* ALL PRODUCTS: grid biasa */
            box.insertAdjacentHTML(
                "beforeend",
                card
            );

        }

    });

    if(typeof syncWishlistButtons === "function"){
        syncWishlistButtons();
    }

    if(
        box.closest(".bestSellerSwiper") &&
        typeof Swiper !== "undefined"
    ){

        new Swiper(".bestSellerSwiper",{

            slidesPerView:4,

            spaceBetween:20,

            speed:500,

            grabCursor:true,

            watchOverflow:true,

            navigation:{
                nextEl:".swiper-button-next",
                prevEl:".swiper-button-prev"
            },

            breakpoints:{

                0:{
                    slidesPerView:2.2,
                    spaceBetween:12
                },

                768:{
                    slidesPerView:3,
                    spaceBetween:16
                },

                1024:{
                    slidesPerView:4,
                    spaceBetween:20
                },

                1400:{
                    slidesPerView:5,
                    spaceBetween:20
                }

            }

        });

    }

}

function renderNewProducts(data){

    const box = document.getElementById("newProductList");

    if(!box) return;

    box.innerHTML = "";

    data.forEach(p=>{

        const card = createProductCard(p);

        if(box.closest(".newProductSwiper")){

            box.insertAdjacentHTML(
                "beforeend",
                `<div class="swiper-slide">${card}</div>`
            );

        }else{

            box.insertAdjacentHTML(
                "beforeend",
                card
            );

        }

    });

    if(typeof syncWishlistButtons === "function"){
        syncWishlistButtons();
    }

    if(
        box.closest(".newProductSwiper") &&
        typeof Swiper !== "undefined"
    ){

        new Swiper(".newProductSwiper",{

            slidesPerView:4,

            spaceBetween:20,

            speed:500,

            grabCursor:true,

            breakpoints:{

                0:{
                    slidesPerView:2.2,
                    spaceBetween:12
                },

                768:{
                    slidesPerView:3,
                    spaceBetween:16
                },

                1024:{
                    slidesPerView:4,
                    spaceBetween:20
                },

                1400:{
                    slidesPerView:5,
                    spaceBetween:20
                }

            }

        });

    }

}

function renderPopularBrands(data){

    const box=document.getElementById("popularBrands");

    box.innerHTML="";

    data.forEach(b=>{

        box.innerHTML+=`

        <div
            class="brand-card"
            onclick="filterBrand('${b.nama}')">

            <img src="${b.logo}">

            <h4>${b.nama}</h4>

        </div>

        `;

    });

}

function renderPopularBrands(data){

    const box = document.getElementById("popularBrands");

    if(!box) return;

    box.innerHTML = "";

    data.forEach(b=>{

        box.innerHTML += `

        <div class="swiper-slide">

            <div class="brand-item"
                 onclick="filterBrand('${b.nama}')">

                <div class="brand-logo">

                    <img
                        src="images/brands/${b.logo}"
                        alt="${b.nama}">

                </div>

                <div class="brand-name">

                    ${b.nama}

                </div>

            </div>

        </div>

        `;

    });

    new Swiper(".brandSwiper",{

        slidesPerView:5,

        spaceBetween:25,

        speed:500,

        grabCursor:true,

        loop:true,

        autoplay:{
            delay:2500,
            disableOnInteraction:false
        },

        breakpoints:{

            0:{
                slidesPerView:3.2,
                spaceBetween:15
            },

            768:{
                slidesPerView:4,
                spaceBetween:20
            },

            1024:{
                slidesPerView:5,
                spaceBetween:25
            },

            1400:{
                slidesPerView:7,
                spaceBetween:30
            }

        }

    });

}
