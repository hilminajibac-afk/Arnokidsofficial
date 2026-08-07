async function loadBrands() {

    const { data, error } = await supabaseClient
        .from("brands")
        .select("*")
        .order("nama");

    if (error) {
        console.error(error);
        return;
    }

    const box = document.getElementById("brandMenu");
    const desktopBox = document.getElementById("desktopBrandMenu");

    if (desktopBox) desktopBox.innerHTML = "";

    if (!box) return;

    box.innerHTML = "";

    // Semua Brand
    const semua = document.createElement("a");
    semua.href = "#";
    semua.textContent = "Semua Brand";

    semua.onclick = function(e){

        e.preventDefault();

        filterBrand("Semua");
       
        const desktopBtn = document.querySelector("#desktopBrandBtn span");

if (desktopBtn) {
    desktopBtn.textContent = "Brand";
}
loadCategories();

const brandBtn = document.querySelectorAll(".accordion")[0];
brandBtn.querySelector("span").innerHTML =
    `<i class="fa-solid fa-shirt"></i> Brand`;

const categoryBtn = document.querySelectorAll(".accordion")[1];
categoryBtn.querySelector("span").innerHTML =
    `<i class="fa-solid fa-layer-group"></i> Kategori`;

filterCategory("Semua");

        closeSidebar();
        
        document.querySelectorAll(".panel").forEach(panel=>{
    panel.classList.remove("show");
});

document.querySelectorAll(".accordion").forEach(acc=>{
    acc.classList.remove("active");
});

    };

    box.appendChild(semua);

    if (desktopBox) {
    const desktopSemua = semua.cloneNode(true);
    desktopSemua.onclick = semua.onclick;
    desktopBox.appendChild(desktopSemua);
}

    // Brand dari database
    data.forEach(brand=>{

        const item = document.createElement("a");

        item.href="#";

        item.textContent=brand.nama;
      

        item.onclick=function(e){

            e.preventDefault();

            filterBrand(brand.nama);
           

            const desktopBtn = document.querySelector("#desktopBrandBtn span");

if (desktopBtn) {
    desktopBtn.textContent = brand.nama;
}

closeDesktopDropdowns();


loadCategories();

// Reset tombol kategori desktop
const desktopCategoryBtn = document.querySelector("#desktopCategoryBtn span");
if (desktopCategoryBtn) {
    desktopCategoryBtn.textContent = "Kategori";
}

// Reset dropdown kategori desktop
const desktopSelect = document.getElementById("desktopCategory");
if (desktopSelect) {
    desktopSelect.selectedIndex = 0;
}

// Reset kategori aktif
filterCategory("Semua");

const brandBtn = document.querySelectorAll(".accordion")[0];
brandBtn.querySelector("span").innerHTML =
    `<i class="fa-solid fa-shirt"></i> ${brand.nama}`;

const categoryBtn = document.querySelectorAll(".accordion")[1];
categoryBtn.querySelector("span").innerHTML =
    `<i class="fa-solid fa-layer-group"></i> Kategori`;

filterCategory("Semua");

            closeSidebar();
            
            document.querySelectorAll(".panel").forEach(panel=>{
    panel.classList.remove("show");
});

document.querySelectorAll(".accordion").forEach(acc=>{
    acc.classList.remove("active");
});

        };

        box.appendChild(item);

        if (desktopBox) {
    const desktopItem = item.cloneNode(true);
    desktopItem.onclick = item.onclick;
    desktopBox.appendChild(desktopItem);
}

    });

}

loadBrands();