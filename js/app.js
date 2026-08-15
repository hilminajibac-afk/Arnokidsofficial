if (typeof products !== "undefined" && typeof render === "function") {
    render(products);
}

if (typeof updateCartBadge === "function") {
    updateCartBadge();
}

window.addEventListener("scroll",()=>{

    const header=document.querySelector(".main-header");

    if(!header) return;

    if(window.scrollY>50){

        header.classList.add("scrolled");

    }else{

        header.classList.remove("scrolled");

    }

});

const sidebar = document.getElementById("sidebar");
const overlay = document.getElementById("overlay");
const menuBtn = document.getElementById("menuBtn");
const closeBtn = document.getElementById("closeSidebar");

function openSidebar() {

    scrollPosition = window.scrollY;

    sidebar.classList.add("active");
    overlay.classList.add("show");

    document.body.style.position = "fixed";
    document.body.style.top = `-${scrollPosition}px`;
    document.body.style.left = "0";
    document.body.style.right = "0";
    document.body.style.width = "100%";
    document.body.style.overflow = "hidden";

}
let scrollPosition = 0;
function closeSidebar() {

    sidebar.classList.remove("active");
    overlay.classList.remove("show");

    document.body.style.position = "";
    document.body.style.top = "";
    document.body.style.left = "";
    document.body.style.right = "";
    document.body.style.width = "";
    document.body.style.overflow = "";

    window.scrollTo(0, scrollPosition);

}
if(menuBtn){
    menuBtn.onclick = openSidebar;
}

if(closeBtn){
    closeBtn.onclick = closeSidebar;
}

if(overlay){
    overlay.onclick = closeSidebar;
}

/* ===========================
   SIDEBAR ACCORDION
=========================== */

const accordions = document.querySelectorAll(".accordion");

accordions.forEach(button=>{

    button.addEventListener("click",function(){

        this.classList.toggle("active");

        const panel = this.nextElementSibling;

        if(panel.classList.contains("show")){

            panel.classList.remove("show");

        }else{

            document.querySelectorAll(".panel").forEach(item=>{

                item.classList.remove("show");

            });

            document.querySelectorAll(".accordion").forEach(item=>{

                item.classList.remove("active");

            });

            this.classList.add("active");

            panel.classList.add("show");

        }

    });

});

function toggleSocial(){

    document
        .querySelector(".floating-social")
        .classList.toggle("active");

}

function closeDesktopDropdowns() {

    document.querySelectorAll(".desktop-dropdown").forEach(drop => {
        drop.classList.remove("open");
    });

}

/* ==========================
   DESKTOP DROPDOWN
========================== */

document.querySelectorAll(".desktop-dropbtn").forEach(btn=>{

    btn.addEventListener("click",function(e){

        e.preventDefault();
        e.stopPropagation();

        const dropdown=this.closest(".desktop-dropdown");

        document.querySelectorAll(".desktop-dropdown").forEach(item=>{

            if(item!==dropdown){
                item.classList.remove("open");
            }

        });

        dropdown.classList.toggle("open");

    });

});

document.addEventListener("click",()=>{

    closeDesktopDropdowns();

});

/* ==========================
   SEMUA PRODUK
========================== */

const allProductsBtn =
    document.getElementById("allProductsBtn");

if (allProductsBtn) {

    allProductsBtn.addEventListener(
        "click",
        function(e) {

            e.preventDefault();

            openAllProducts("all");

        }
    );

}

const newProductsNavBtn =
    document.getElementById(
        "newProductsNavBtn"
    );

if (newProductsNavBtn) {

    newProductsNavBtn.addEventListener(
        "click",
        function(e) {

            e.preventDefault();

            openAllProducts("new");

        }
    );

}
//function scrollToProducts() {

    //const section = document.getElementById("allProducts");

    //if (!section) return;

    //const headerHeight =
       // document.querySelector(".main-header").offsetHeight +
        document.querySelector(".desktop-nav").offsetHeight;

   // const y =
   //     section.getBoundingClientRect().top +
   //     window.pageYOffset -
  //      headerHeight -
   //     20;

   // window.scrollTo({
   //     top: y,
   //     behavior: "smooth"
  //  });

//}

const bestSellerSeeAll =
    document.getElementById(
        "bestSellerSeeAll"
    );

if (bestSellerSeeAll) {

    bestSellerSeeAll.addEventListener(
        "click",
        function(e) {

            e.preventDefault();

            openAllProducts("bestseller");

        }
    );

}

const collectionSeeAll =
    document.getElementById("collectionSeeAll");

if (collectionSeeAll) {

    collectionSeeAll.addEventListener(
        "click",
        function(e) {

            e.preventDefault();

            openAllProducts("all");

        }
    );

}


const filterBtn =
    document.getElementById("desktopFilterBtn");

const filterWrap =
    document.querySelector(".desktop-filter");

/* ==========================
   DESKTOP FILTER
   Hanya dijalankan kalau
   elemennya memang ada.
========================== */

if (filterBtn && filterWrap) {

    filterBtn.addEventListener("click", function(e){

        e.stopPropagation();

        filterWrap.classList.toggle("open");

    });

    document.addEventListener("click", function(){

        filterWrap.classList.remove("open");

    });

}

/* ==========================================
   AKSES ALL PRODUCTS
========================================== */

async function openAllProducts(filter = "all") {

    const {
        data: { session }
    } = await supabaseClient.auth.getSession();


    /* =========================
       BELUM LOGIN
    ========================= */

    if (!session) {

        const target =
            filter === "bestseller"
                ? "allProducts.html?filter=bestseller"
                : filter === "new"
                    ? "allProducts.html?filter=new"
                    : "allProducts.html";


        window.location.href =
            "login.html?redirect=" +
            encodeURIComponent(target);

        return;
    }


    /* =========================
       SUDAH LOGIN
    ========================= */

    if (filter === "bestseller") {

        window.location.href =
            "allProducts.html?filter=bestseller";

        return;

    }


    if (filter === "new") {

        window.location.href =
            "allProducts.html?filter=new";

        return;

    }


    window.location.href =
        "allProducts.html";

}

const mobileNewProductsBtn =
    document.getElementById(
        "mobileNewProductsBtn"
    );

if (mobileNewProductsBtn) {

    mobileNewProductsBtn.addEventListener(
        "click",
        function(e) {

            e.preventDefault();

            openAllProducts("new");

        }
    );

}
const mobileAllProductsBtn =
    document.getElementById(
        "mobileAllProductsBtn"
    );

if (mobileAllProductsBtn) {

    mobileAllProductsBtn.addEventListener(
        "click",
        function(e) {

            e.preventDefault();

            openAllProducts("all");

        }
    );

}

const newProductsSeeAll =
    document.getElementById(
        "newProductsSeeAll"
    );

if (newProductsSeeAll) {

    newProductsSeeAll.addEventListener(
        "click",
        function(e) {

            e.preventDefault();

            openAllProducts("new");

        }
    );

}