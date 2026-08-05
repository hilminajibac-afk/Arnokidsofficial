let selectedIndex = -1;
let qty = 1;

function openProduct(index){

    const p = products[index];

    selectedIndex = index;
    qty = 1;

    document.getElementById("qty").value = qty;

    document.getElementById("modalImage").src = p.gambar;

    document.getElementById("modalTitle").textContent = p.nama;

    document.getElementById("modalPrice").innerHTML =
        `Rp ${p.hargaLusin.toLocaleString('id-ID')} / Lusin`;

    document.getElementById("modalDesc").textContent =
        p.deskripsi;

    const video = document.getElementById("modalVideo");

    if(p.video){

        video.src = p.video;
        video.style.display = "block";

    }else{

        video.pause();
        video.removeAttribute("src");
        video.load();

        video.style.display = "none";

    }

    document.getElementById("productModal").style.display = "flex";

}

document.getElementById("plusQty").onclick = function(){

    qty++;

    document.getElementById("qty").value = qty;

}

document.getElementById("minusQty").onclick = function(){

    if(qty>1){

        qty--;

        document.getElementById("qty").value = qty;

    }

}

document.getElementById("modalSelect").onclick = function(){

    const img =
document.getElementById("modalImage");

flyToCart(img);

addCart(selectedIndex, qty);

    // Reset jumlah menjadi 1
    qty = 1;
    document.getElementById("qty").value = qty;

    // Tutup modal
    document.getElementById("productModal").style.display = "none";

}

document.getElementById("closeModal").onclick=function(){

    document.getElementById("productModal").style.display="none";

}

window.onclick=function(e){

    if(e.target==document.getElementById("productModal")){

        document.getElementById("productModal").style.display="none";

    }

}