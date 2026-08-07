async function loadBrands() {

    const { data, error } = await supabaseClient
        .from("brands")
        .select("*")
        .order("nama");


    if (error) {

        console.error(error);

        return;

    }


    const box =
        document.getElementById("brandMenu");

    const desktopBox =
        document.getElementById("desktopBrandMenu");


    if (desktopBox) {

        desktopBox.innerHTML = "";

    }


    if (!box) return;


    box.innerHTML = "";


    // ==========================================
    // SEMUA BRAND
    // ==========================================

    const semua =
        document.createElement("a");


    semua.href = "#";

    semua.textContent =
        "Semua Brand";


    semua.onclick = function(e) {

        e.preventDefault();

        e.stopPropagation();


        // Filter brand
        filterBrand("Semua");


        // ==============================
        // DESKTOP
        // ==============================

        const desktopBtn =
            document.querySelector(
                "#desktopBrandBtn span"
            );


        if (desktopBtn) {

            desktopBtn.textContent =
                "Brand";

        }


        // ==============================
        // MOBILE
        // ==============================

        const accordions =
            document.querySelectorAll(
                ".accordion"
            );


        const brandBtn =
            accordions[0];


        if (brandBtn) {

            const span =
                brandBtn.querySelector(
                    "span"
                );


            if (span) {

                span.innerHTML =
                    `<i class="fa-solid fa-shirt"></i> Brand`;

            }

        }


        // ==============================
        // TUTUP DROPDOWN
        // ==============================

        closeDesktopDropdowns();


        document
            .querySelectorAll(".panel")
            .forEach(panel => {

                panel.classList.remove(
                    "show"
                );

            });


        document
            .querySelectorAll(".accordion")
            .forEach(acc => {

                acc.classList.remove(
                    "active"
                );

            });


        closeSidebar();

    };


    box.appendChild(semua);


    // ==========================================
    // SEMUA BRAND - DESKTOP
    // ==========================================

    if (desktopBox) {

        const desktopSemua =
            document.createElement("a");


        desktopSemua.href = "#";

        desktopSemua.textContent =
            "Semua Brand";


        desktopSemua.onclick =
            semua.onclick;


        desktopBox.appendChild(
            desktopSemua
        );

    }


    // ==========================================
    // BRAND DARI DATABASE
    // ==========================================

    data.forEach(brand => {

        const item =
            document.createElement("a");


        item.href = "#";

        item.textContent =
            brand.nama;


        item.onclick = function(e) {

            e.preventDefault();

            e.stopPropagation();


            // ==============================
            // FILTER BRAND
            // ==============================

            filterBrand(
                brand.nama
            );


            // ==============================
            // DESKTOP
            // ==============================

            const desktopBtn =
                document.querySelector(
                    "#desktopBrandBtn span"
                );


            if (desktopBtn) {

                desktopBtn.textContent =
                    brand.nama;

            }


            // ==============================
            // MOBILE
            // ==============================

            const accordions =
                document.querySelectorAll(
                    ".accordion"
                );


            const brandBtn =
                accordions[0];


            if (brandBtn) {

                const span =
                    brandBtn.querySelector(
                        "span"
                    );


                if (span) {

                    span.innerHTML =
                        `<i class="fa-solid fa-shirt"></i> ${brand.nama}`;

                }

            }


            // ==============================
            // JANGAN RESET KATEGORI
            // ==============================

            // Tidak ada:
            // loadCategories()
            //
            // Tidak ada:
            // filterCategory("Semua")
            //
            // Tidak ada reset tombol kategori.


            // ==============================
            // TUTUP DROPDOWN DESKTOP
            // ==============================

            closeDesktopDropdowns();


            // ==============================
            // TUTUP PANEL MOBILE
            // ==============================

            document
                .querySelectorAll(".panel")
                .forEach(panel => {

                    panel.classList.remove(
                        "show"
                    );

                });


            // ==============================
            // HILANGKAN ACTIVE ACCORDION
            // ==============================

            document
                .querySelectorAll(".accordion")
                .forEach(acc => {

                    acc.classList.remove(
                        "active"
                    );

                });


            // ==============================
            // TUTUP SIDEBAR
            // ==============================

            closeSidebar();

        };


        box.appendChild(item);


        // ==========================================
        // BRAND DESKTOP
        // ==========================================

        if (desktopBox) {

            const desktopItem =
                document.createElement("a");


            desktopItem.href = "#";

            desktopItem.textContent =
                brand.nama;


            desktopItem.onclick =
                item.onclick;


            desktopBox.appendChild(
                desktopItem
            );

        }

    });

}


// ==========================================
// LOAD BRAND
// ==========================================

loadBrands();