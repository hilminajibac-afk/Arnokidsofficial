// ===========================
// ARNOKIDS CART V3
// ===========================

// ---------------------------
// BADGE
// ---------------------------

function updateCartBadge(){

    const cart = getCart();

    const total = cart.length;

    document
        .querySelectorAll("#cart-count,#bottom-cart-count")
        .forEach(badge=>{

            badge.textContent = total;

            badge.style.display =
                total > 0 ? "flex" : "none";

        });

        document
.querySelectorAll("#cart-count,#bottom-cart-count")
.forEach(badge=>{

    badge.classList.remove("cart-bounce");

    void badge.offsetWidth;

    badge.classList.add("cart-bounce");

});

}

// ---------------------------
// TAMBAH KE KERANJANG
// ---------------------------

async function addCart(index, qty = 1){

    // ==========================================
    // CEK LOGIN
    // ==========================================

    const {
        data: { session }
    } = await supabaseClient.auth.getSession();


    // Belum login
    if(!session){

        window.location.href = "login.html";

        return;

    }


    // ==========================================
    // TAMBAH KE KERANJANG
    // ==========================================

    let cart = getCart();

    const p = products[index];


    if(!p){

        console.error(
            "Produk tidak ditemukan."
        );

        return;

    }


    const item =
        cart.find(
            i => i.nama === p.nama
        );


    if(item){

        item.jumlah += qty;

    }else{

        cart.push({

            nama: p.nama,

            hargaLusin:
                p.hargaLusin,

            gambar:
                p.gambar,

            video:
                p.video || "",

            deskripsi:
                p.deskripsi || "",

            jumlah:
                qty

        });

    }


    saveCart(cart);

    updateCartBadge();


    const img =
        document.querySelectorAll(
            ".card img"
        )[index];


    flyToCart(img);

    showToast(
        "Produk berhasil ditambahkan"
    );

}
// ---------------------------
// UBAH JUMLAH
// ---------------------------

function changeQty(index, step) {

    let cart = getCart();

    if (!cart[index]) return;

    cart[index].jumlah += step;

    if (cart[index].jumlah <= 0) {

        cart.splice(index, 1);

    }

    saveCart(cart);

    updateCartBadge();

    if (typeof renderCart === "function") {
    renderCart();
}
}

// ---------------------------
// HAPUS ITEM
// ---------------------------

function removeCart(index) {

    let cart = getCart();

    cart.splice(index, 1);

    saveCart(cart);

    updateCartBadge();

    if (typeof renderCart === "function") {
        renderCart();
    }

}

// ---------------------------
// KOSONGKAN CART
// ---------------------------

function clearCart() {

    if (!confirm("Kosongkan keranjang?")) return;

    saveCart([]);

    updateCartBadge();

    if (typeof renderCart === "function") {
        renderCart();
    }

}

// ---------------------------
// HALAMAN CART
// ---------------------------

async function toggleCart(){

    const {
        data: { session }
    } = await supabaseClient.auth.getSession();


    if(!session){

        window.location.href =
            "login.html";

        return;

    }


    window.location.href =
        "cart.html";

}

// ---------------------------
// CHECKOUT WA
// ---------------------------

function sendWA() {

    const cart = getCart();

    if (cart.length === 0) {
        alert("Keranjang masih kosong.");
        return;
    }

    let text = "Halo Admin ARNOKIDS,%0A%0A";
    text += "Saya ingin memesan:%0A%0A";

    let total = 0;

    cart.forEach((item, i) => {

        const subtotal = item.hargaLusin * item.jumlah;

        total += subtotal;

        text += `${i + 1}. ${item.nama}%0A`;
        text += `Jumlah : ${item.jumlah} Lusin%0A`;
        text += `Subtotal : Rp ${subtotal.toLocaleString("id-ID")}%0A%0A`;

    });

    text += "----------------------------%0A";
    text += `TOTAL : Rp ${total.toLocaleString("id-ID")}`;

    // Buka WhatsApp
    window.open(
        `https://wa.me/${phone}?text=${text}`,
        "_blank"
    );

    // Tutup popup jika sedang terbuka
    const popup = document.getElementById("popup");
    if (popup) {
        popup.classList.remove("show");
    }

    // Bersihkan keranjang
    saveCart([]);

    // Update badge
    updateCartBadge();

    // Refresh halaman cart jika ada
    if (typeof renderCart === "function") {
        renderCart();
    }

    // Toast sukses
    showToast("Pesanan berhasil dikirim ke WhatsApp");

}

function openConfirmOrder(){

    const cart=getCart();

    if(cart.length===0){

        alert("Keranjang masih kosong.");

        return;

    }

    let totalItem=0;
    let totalHarga=0;

    cart.forEach(item=>{

        totalItem+=item.jumlah;

        totalHarga+=item.jumlah*item.hargaLusin;

    });

    document.getElementById("confirmItem").textContent=
        totalItem+" Lusin";

    document.getElementById("confirmTotal").textContent=
        "Rp "+totalHarga.toLocaleString("id-ID");

    document.getElementById("confirmOrder")
    .classList.add("show");

}


// ---------------------------
// TOAST
// ---------------------------

function showToast(text){

    const toast = document.getElementById("toast");
    const toastText = document.getElementById("toastText");

    if(!toast) return;

    toastText.textContent = text;

    toast.classList.add("show");

    setTimeout(()=>{
        toast.classList.remove("show");
    },2000);

}

function flyToCart(img){

    let cartIcon;

    if(window.innerWidth <= 768){

        cartIcon = document.querySelector(".bottom-cart");

    }else{

        cartIcon = document.querySelector(".desktop-cart");

    }

    if(!cartIcon || !img) return;

    const start = img.getBoundingClientRect();
    const end = cartIcon.getBoundingClientRect();

    const clone = img.cloneNode(true);

    clone.className = "fly-image";

    clone.style.left = start.left + "px";
    clone.style.top = start.top + "px";
    clone.style.width = start.width + "px";
    clone.style.height = start.height + "px";

    document.body.appendChild(clone);

    requestAnimationFrame(()=>{

        clone.style.left = end.left + "px";
        clone.style.top = end.top + "px";

        clone.style.width = "25px";
        clone.style.height = "25px";

        clone.style.opacity = ".2";

    });

    clone.addEventListener("transitionend",()=>{

        clone.remove();

        cartIcon.classList.remove("cart-pop");
        void cartIcon.offsetWidth;
        cartIcon.classList.add("cart-pop");

    });

}
// ---------------------------

document.addEventListener("DOMContentLoaded", function () {

    updateCartBadge();

    const cancelBtn = document.getElementById("cancelOrder");
    const confirmBtn = document.getElementById("confirmWA");

    if (cancelBtn) {
        cancelBtn.onclick = function () {
            document.getElementById("confirmOrder").classList.remove("show");
        };
    }

    if (confirmBtn) {
        confirmBtn.onclick = function () {
            document.getElementById("confirmOrder").classList.remove("show");
            sendWA();
        };
    }

});