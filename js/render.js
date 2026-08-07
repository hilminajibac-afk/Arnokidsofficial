function createProductCard(p, index){

    return `
        <div class="card">

            <div class="card-image">

                <img src="${p.gambar}" alt="${p.nama}">

                <button
                    class="wishlist-btn"
                    data-id="${p.id}"
                    onclick="toggleWishlist('${p.id}', this)">

                    <i class="fa-regular fa-heart"></i>

                </button>

            </div>

            <div class="info">

                <div class="name">${p.nama}</div>

                <div class="price">

                    <div class="price-lusin">
                        Rp ${p.hargaLusin.toLocaleString("id-ID")}
                        <span>/ lusin</span>
                    </div>

                </div>

                <button
    class="check"
    onclick="openProductById('${p.id}')">

    Pilih

</button>

            </div>

        </div>
    `;
}
function render(data){

    const box =
        document.getElementById("products");

    box.innerHTML = "";

    data.forEach((p,index)=>{

        box.innerHTML +=
            createProductCard(p,index);

    });

    syncWishlistButtons();

}

function renderBestSeller(data){

    const box = document.getElementById("bestSellerProducts");

    if(!box) return;

    box.innerHTML = "";

   data.forEach(p=>{

    const realIndex =
        products.findIndex(
            prod => prod.id === p.id
        );

    box.innerHTML += `
        <div class="swiper-slide">

            ${createProductCard(p, realIndex)}

        </div>
    `;

});

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

function renderNewProducts(data){

    const box = document.getElementById("newProductList");

    if(!box) return;

    box.innerHTML="";

    data.forEach(p=>{

        box.innerHTML += `
            <div class="swiper-slide">

                ${createProductCard(p)}

            </div>
        `;

    });

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
