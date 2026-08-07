async function loadCategories() {

    const { data, error } = await supabaseClient
        .from("categories")
        .select("id, nama")
        .is("brand_id", null)
        .order("nama");

    console.log("KATEGORI GLOBAL:", data);

    if (error) {

        console.error("Gagal mengambil kategori:", error);

        return;

    }

    const box =
        document.getElementById("categoryMenu");

    const desktopBox =
        document.getElementById("desktopCategoryMenu");

    const desktopSelect =
        document.getElementById("desktopCategory");


    if (!box) return;


    // ==========================================
    // RESET
    // ==========================================

    box.innerHTML = "";


    if (desktopBox) {
        desktopBox.innerHTML = "";
    }


    if (desktopSelect) {

        desktopSelect.innerHTML =
            `<option value="">Semua Kategori</option>`;

    }


    // ==========================================
    // SEMUA KATEGORI
    // ==========================================

    const semua =
        document.createElement("a");

    semua.href = "#";

    semua.textContent =
        "Semua Kategori";


    semua.onclick = function(e) {

        e.preventDefault();

        filterCategory("Semua");

        closeDesktopDropdowns();

        closeSidebar();

    };


    box.appendChild(semua);


    // ==========================================
    // DESKTOP
    // ==========================================

    if (desktopBox) {

        const item =
            document.createElement("a");

        item.href = "#";

        item.textContent =
            "Semua Kategori";


        item.onclick = function(e) {

            e.preventDefault();

            filterCategory("Semua");

            closeDesktopDropdowns();

        };


        desktopBox.appendChild(item);

    }


    // ==========================================
    // KATEGORI GLOBAL
    // ==========================================

    data.forEach(category => {

        const item =
            document.createElement("a");

        item.href = "#";

        item.textContent =
            category.nama;


        item.onclick = function(e){

    e.preventDefault();
    e.stopPropagation();

    // ==============================
    // FILTER KATEGORI
    // ==============================

    filterCategory(category.nama);

    // ==============================
    // DESKTOP
    // ==============================

    const desktopBtn =
        document.querySelector(
            "#desktopCategoryBtn span"
        );

    if(desktopBtn){

        desktopBtn.textContent =
            category.nama;

    }


    // ==============================
    // TUTUP DROPDOWN DESKTOP
    // ==============================

    closeDesktopDropdowns();


    // ==============================
    // MOBILE
    // ==============================

    const accordions =
        document.querySelectorAll(
            ".accordion"
        );

    const categoryBtn =
        accordions[1];

    if(categoryBtn){

        const span =
            categoryBtn.querySelector("span");

        if(span){

            span.innerHTML =
                `<i class="fa-solid fa-layer-group"></i> ${category.nama}`;

        }

        categoryBtn.classList.remove(
            "active"
        );

    }


    // ==============================
    // TUTUP PANEL MOBILE
    // ==============================

    const panels =
        document.querySelectorAll(".panel");

    panels.forEach(panel => {

        panel.classList.remove("show");

    });


    // ==============================
    // TUTUP SIDEBAR MOBILE
    // ==============================

    closeSidebar();

};


        box.appendChild(item);


        // ======================================
        // DESKTOP DROPDOWN
        // ======================================

        if (desktopBox) {

            const desktopItem =
                document.createElement("a");

            desktopItem.href = "#";

            desktopItem.textContent =
                category.nama;


            desktopItem.onclick =
                item.onclick;


            desktopBox.appendChild(
                desktopItem
            );

        }


        // ======================================
        // DESKTOP SELECT
        // ======================================

        if (desktopSelect) {

            const option =
                document.createElement("option");

            option.value =
                category.nama;

            option.textContent =
                category.nama;


            desktopSelect.appendChild(
                option
            );

        }

    });

}


// ==========================================
// LOAD
// ==========================================

loadCategories();