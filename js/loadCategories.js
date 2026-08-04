async function loadCategories(brandId = null) {

    let query = supabaseClient
    .from("categories")
    .select("*");

if (brandId) {
    query = query.eq("brand_id", brandId);
}

const { data, error } = await query.order("nama");

console.log("KATEGORI :", data);
console.log("ERROR KATEGORI :", error);
console.log("BRAND ID :", brandId);

    if (error) {
        console.error(error);
        return;
    }

    const box = document.getElementById("categoryMenu");

    const desktopBox = document.getElementById("desktopCategoryMenu");
const desktopSelect = document.getElementById("desktopCategory");

if (desktopBox) desktopBox.innerHTML = "";

if (desktopSelect) {
    desktopSelect.innerHTML =
        '<option value="">Semua Kategori</option>';
}

    if (!box) return;

    box.innerHTML = "";

    // Semua Kategori
    const semua = document.createElement("a");

    semua.href = "#";
    semua.textContent = "Semua Kategori";

    semua.onclick = function(e){

    e.preventDefault();

    filterCategory("Semua");

    scrollToProducts();

    const desktopBtn = document.querySelector("#desktopCategoryBtn span");

if (desktopBtn) {
    desktopBtn.textContent = "Kategori";
}

    const btn = document.querySelectorAll(".accordion")[1];
    btn.querySelector("span").innerHTML =
        `<i class="fa-solid fa-layer-group"></i> Kategori`;

    document.querySelectorAll(".panel").forEach(panel=>{
        panel.classList.remove("show");
    });

    document.querySelectorAll(".accordion").forEach(acc=>{
        acc.classList.remove("active");
    });

    closeSidebar();

};

    box.appendChild(semua);

    if (desktopBox) {
    const desktopSemua = semua.cloneNode(true);
    desktopSemua.onclick = semua.onclick;
    desktopBox.appendChild(desktopSemua);
}

    // Kategori dari database
    data.forEach(category=>{

        const item = document.createElement("a");

        item.href = "#";

        item.textContent = category.nama;

        item.onclick = function(e){

    e.preventDefault();

    filterCategory(category.nama);

    scrollToProducts();

    const desktopBtn = document.querySelector("#desktopCategoryBtn span");

if (desktopBtn) {
    desktopBtn.textContent = category.nama;
}

closeDesktopDropdowns();

    const btn = document.querySelectorAll(".accordion")[1];
    btn.querySelector("span").innerHTML =
        `<i class="fa-solid fa-layer-group"></i> ${category.nama}`;

    document.querySelectorAll(".panel").forEach(panel=>{
        panel.classList.remove("show");
    });

    document.querySelectorAll(".accordion").forEach(acc=>{
        acc.classList.remove("active");
    });

    closeSidebar();

};

        box.appendChild(item);

        if (desktopBox) {
    const desktopItem = item.cloneNode(true);
    desktopItem.onclick = item.onclick;
    desktopBox.appendChild(desktopItem);
}

if (desktopSelect) {
    const option = document.createElement("option");
    option.value = category.nama;
    option.textContent = category.nama;
    desktopSelect.appendChild(option);
}

    });

}

loadCategories();