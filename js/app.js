render(products);
updateCartBadge();

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

const allProductsBtn = document.getElementById("allProductsBtn");

if (allProductsBtn) {
    allProductsBtn.addEventListener("click", () => {

        // reset filter
        currentBrand = "";
        currentCategory = "";

        // reset tulisan tombol desktop
        const brandText = document.querySelector("#desktopBrandBtn span");
        if (brandText) brandText.textContent = "Brand";

        const categoryText = document.querySelector("#desktopCategoryBtn span");
        if (categoryText) categoryText.textContent = "Kategori";

        // reset tulisan sidebar mobile
        document.querySelectorAll(".accordion").forEach(btn => {
            const span = btn.querySelector("span");
            if (!span) return;

            if (span.textContent.includes("Brand")) {
                span.innerHTML =
                    '<i class="fa-solid fa-shirt"></i> Brand';
            }

            if (span.textContent.includes("Kategori")) {
                span.innerHTML =
                    '<i class="fa-solid fa-layer-group"></i> Kategori';
            }
        });

        // tutup dropdown desktop
        closeDesktopDropdowns();

        // render ulang semua produk
        loadProducts();
    });
}

function scrollToProducts() {

    const section = document.getElementById("allProducts");

    if (!section) return;

    const headerHeight =
        document.querySelector(".main-header").offsetHeight +
        document.querySelector(".desktop-nav").offsetHeight;

    const y =
        section.getBoundingClientRect().top +
        window.pageYOffset -
        headerHeight -
        20;

    window.scrollTo({
        top: y,
        behavior: "smooth"
    });

}
