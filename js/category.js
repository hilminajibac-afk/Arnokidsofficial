let currentBrand = "Semua";
let currentCategory = "Semua";
let currentSort = "az";

function filterBrand(merek){

    currentBrand = merek;
    currentCategory = "Semua";

    applyFilter();

}

function filterCategory(kategori){

    currentCategory = kategori;

    applyFilter();

}

function applyFilter(){

    let data = [...products];

    if(currentBrand !== "Semua"){
        data = data.filter(item => item.merek === currentBrand);
    }

    if(currentCategory !== "Semua"){
        data = data.filter(item => item.kategori === currentCategory);
    }

    switch(currentSort){

        case "az":
            data.sort((a,b)=>a.nama.localeCompare(b.nama,"id"));
            break;

        case "za":
            data.sort((a,b)=>b.nama.localeCompare(a.nama,"id"));
            break;

        case "murah":
            data.sort((a,b)=>a.hargaLusin-b.hargaLusin);
            break;

        case "mahal":
            data.sort((a,b)=>b.hargaLusin-a.hargaLusin);
            break;

    }

    render(data);

    // Scroll ke semua produk
    const section = document.getElementById("allProducts");

    if(section){

        const header = document.querySelector(".main-header");

        const offset = header ? header.offsetHeight + 20 : 20;

        window.scrollTo({
            top: section.offsetTop - offset,
            behavior: "smooth"
        });

    }

}