let currentBrand = "Semua";
let currentCategory = "Semua";
let currentSort = "az";


// ======================================================
// FILTER BRAND
// ======================================================

function filterBrand(merek){

    currentBrand = merek;

    // JANGAN reset currentCategory

    applyFilter();

}


// ======================================================
// FILTER KATEGORI
// ======================================================

function filterCategory(kategori){

    currentCategory = kategori;

    applyFilter();

}


// ======================================================
// APPLY FILTER
// ======================================================

function applyFilter(){

    let data = [...products];


    // ==================================================
    // FILTER BRAND
    // ==================================================

    if(currentBrand !== "Semua"){

        data = data.filter(item => {

            return item.merek === currentBrand;

        });

    }


    // ==================================================
    // FILTER KATEGORI
    // ==================================================

    if(currentCategory !== "Semua"){

        data = data.filter(item => {

            return item.kategori === currentCategory;

        });

    }


    // ==================================================
    // SORT
    // ==================================================

    switch(currentSort){

        case "az":

            data.sort((a,b) =>
                a.nama.localeCompare(
                    b.nama,
                    "id"
                )
            );

            break;


        case "za":

            data.sort((a,b) =>
                b.nama.localeCompare(
                    a.nama,
                    "id"
                )
            );

            break;


        case "murah":

            data.sort(
                (a,b) =>
                    a.hargaLusin -
                    b.hargaLusin
            );

            break;


        case "mahal":

            data.sort(
                (a,b) =>
                    b.hargaLusin -
                    a.hargaLusin
            );

            break;

    }


    // ==================================================
    // RENDER
    // ==================================================

    render(data);

}


// ======================================================
// FILTER CATEGORY BUTTON / SELECT
// ======================================================

function renderCategoryButtons(){

    const box =
        document.getElementById(
            "categoryButtons"
        );


    if(!box) return;


    // ==================================================
    // KATEGORI GLOBAL
    // ==================================================

    // Jangan mengambil kategori berdasarkan brand.
    // Kita ambil kategori dari seluruh products.

    const kategoriUnik = [
        ...new Set(
            products
                .map(item => item.kategori)
                .filter(kategori =>
                    kategori &&
                    kategori !== ""
                )
        )
    ];


    box.innerHTML = `

        <select id="categorySelect">

            <option value="Semua">
                Semua Kategori
            </option>

            ${kategoriUnik.map(kategori => `

                <option value="${kategori}">
                    ${kategori}
                </option>

            `).join("")}

        </select>

    `;


    const select =
        document.getElementById(
            "categorySelect"
        );


    if(!select) return;


    // Pertahankan kategori yang sedang dipilih

    select.value =
        currentCategory;


    select.onchange = function(){

        filterCategory(
            this.value
        );

    };

}


// ======================================================
// SORT
// ======================================================

function renderSort(){

    const box =
        document.getElementById(
            "sortButtons"
        );


    if(!box) return;


    box.innerHTML = `

        <select id="sortSelect">

            <option value="az">
                Nama A-Z
            </option>

            <option value="za">
                Nama Z-A
            </option>

            <option value="murah">
                Harga Termurah
            </option>

            <option value="mahal">
                Harga Termahal
            </option>

        </select>

    `;


    const select =
        document.getElementById(
            "sortSelect"
        );


    if(!select) return;


    select.value =
        currentSort;


    select.onchange = function(){

        currentSort =
            this.value;

        applyFilter();

    };

}


// ======================================================
// SAAT HALAMAN SELESAI DIMUAT
// ======================================================

window.addEventListener(
    "load",
    function(){

        renderCategoryButtons();

        renderSort();

    }
);