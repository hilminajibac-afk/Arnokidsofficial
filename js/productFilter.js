/* =====================================================
   PRODUCT PAGE MOBILE FILTER
   Sorts Produk Terkait
===================================================== */

let relatedSort = "az";

function sortRelatedProducts(){

    if (typeof renderRelatedProducts === "function") {
        renderRelatedProducts();
    }

}

function initProductFilter(){

    const filterBtn = document.getElementById("filterBtn");
    const modal = document.getElementById("filterModal");
    const closeBtn = document.getElementById("closeFilter");
    const applyBtn = document.getElementById("applyFilter");

    if (!filterBtn || !modal) return;

    filterBtn.addEventListener("click", function(e){
        e.preventDefault();
        modal.classList.add("show");
    });

    closeBtn?.addEventListener("click", function(){
        modal.classList.remove("show");
    });

    modal.addEventListener("click", function(e){
        if (e.target === modal) {
            modal.classList.remove("show");
        }
    });

    applyBtn?.addEventListener("click", function(){

        const selected =
            document.querySelector('input[name="sort"]:checked');

        if (selected) {
            relatedSort = selected.value;
        }

        sortRelatedProducts();
        modal.classList.remove("show");
    });
}

document.addEventListener("DOMContentLoaded", initProductFilter);
