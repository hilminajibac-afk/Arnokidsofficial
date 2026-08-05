// ======================================
// SEARCH
// ======================================

const desktopSearch = document.getElementById("searchInput");
const mobileSearch = document.getElementById("mobileSearch");

function doSearch(keyword){

    keyword = keyword.toLowerCase().trim();

    if(keyword === ""){

        render(products);
        return;

    }

    const hasil = products.filter(item =>

        item.nama.toLowerCase().includes(keyword) ||

        item.kategori.toLowerCase().includes(keyword) ||

        item.merek.toLowerCase().includes(keyword)

    );

    render(hasil);

}

if(desktopSearch){

    desktopSearch.addEventListener("input",function(){

        doSearch(this.value);

    });

}

if(mobileSearch){

    mobileSearch.addEventListener("input",function(){

        doSearch(this.value);

    });

}




// ======================================
// STICKY HEADER
// ======================================

window.addEventListener("scroll",()=>{

    const header = document.querySelector(".main-header");

    if(!header) return;

    if(window.scrollY > 40){

        header.classList.add("scrolled");

    }else{

        header.classList.remove("scrolled");

    }

});


// ======================================
// MOBILE SEARCH UI
// ======================================

const mobileHeader = document.querySelector(".mobile-header");
const searchBtn = document.getElementById("bottomSearch");
const searchBox = document.querySelector(".mobile-search-box");
const clearSearch = document.getElementById("clearSearch");

searchBtn?.addEventListener("click", () => {

    mobileHeader.classList.toggle("search-open");
    searchBox.classList.toggle("active");

    if (searchBox.classList.contains("active")) {
        setTimeout(() => mobileSearch.focus(), 200);
    }

});

mobileSearch?.addEventListener("input", function () {

    if (this.value.trim() === "") {

        clearSearch.classList.remove("show");

    } else {

        clearSearch.classList.add("show");

    }

});

clearSearch?.addEventListener("click", () => {

    mobileSearch.value = "";

    doSearch("");

    clearSearch.classList.remove("show");

    mobileSearch.focus();

});