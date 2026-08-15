// =====================================================
// ARNOKIDS CART - SUPABASE DATABASE
// =====================================================


// =====================================================
// BADGE
// =====================================================

async function updateCartBadge(){

    const total = await getCartCount();

    document
        .querySelectorAll("#cart-count,#bottom-cart-count")
        .forEach(badge => {

            badge.textContent = total;

            badge.style.display =
                total > 0 ? "flex" : "none";

            badge.classList.remove("cart-bounce");

            if(total > 0){
                void badge.offsetWidth;
                badge.classList.add("cart-bounce");
            }

        });

}


// =====================================================
// CEK LOGIN
// =====================================================

async function requireCartLogin(){

    const {
        data: { session }
    } = await supabaseClient.auth.getSession();

    if(!session){

        const redirect =
            encodeURIComponent(
                window.location.pathname.split("/").pop() +
                window.location.search
            );

        window.location.href =
            `login.html?redirect=${redirect}`;

        return false;
    }

    return true;
}


// =====================================================
// TAMBAH KE CART
// =====================================================

async function addCart(index, qty = 1){

    const loggedIn = await requireCartLogin();

    if(!loggedIn) return false;

    const p = products[index];

    if(!p){

        console.error("Produk tidak ditemukan.");
        return false;

    }

    const {
        data: { user }
    } = await supabaseClient.auth.getUser();

    if(!user) return false;

    const { data: existing, error: findError } =
        await supabaseClient
            .from("cart")
            .select("id, quantity")
            .eq("user_id", user.id)
            .eq("product_id", p.id)
            .maybeSingle();

    if(findError){

        console.error(
            "Gagal mengecek cart:",
            findError
        );

        showToast("Gagal menambahkan ke keranjang.");
        return false;

    }

    if(existing){

        const { error } = await supabaseClient
            .from("cart")
            .update({
                quantity:
                    Number(existing.quantity || 0) +
                    Number(qty)
            })
            .eq("id", existing.id)
            .eq("user_id", user.id);

        if(error){

            console.error("Gagal update cart:", error);
            showToast("Gagal menambahkan ke keranjang.");
            return false;

        }

    }else{

        const { error } = await supabaseClient
            .from("cart")
            .insert({
                user_id: user.id,
                product_id: p.id,
                quantity: Number(qty)
            });

        if(error){

            console.error("Gagal insert cart:", error);
            showToast("Gagal menambahkan ke keranjang.");
            return false;

        }

    }

    await updateCartBadge();

    const cards =
        document.querySelectorAll(".card img");

    const img = cards[index];

    if(img){
        flyToCart(img);
    }

    showToast("Produk berhasil ditambahkan");

    return true;
}


// =====================================================
// UBAH JUMLAH
// =====================================================

async function changeQty(index, step){

    const cart = await getCart();

    const item = cart[index];

    if(!item) return;

    const newQuantity =
        Number(item.jumlah) + Number(step);

    if(newQuantity <= 0){

        await removeCart(index);
        return;

    }

    const { error } = await supabaseClient
        .from("cart")
        .update({
            quantity: newQuantity
        })
        .eq("id", item.id);

    if(error){

        console.error("Gagal mengubah jumlah:", error);
        showToast("Gagal mengubah jumlah.");
        return;

    }

    await updateCartBadge();

    if(typeof renderCart === "function"){
        await renderCart();
    }

}


// =====================================================
// HAPUS ITEM
// =====================================================

async function removeCart(index){

    const cart = await getCart();

    const item = cart[index];

    if(!item) return;

    const { error } = await supabaseClient
        .from("cart")
        .delete()
        .eq("id", item.id);

    if(error){

        console.error("Gagal menghapus cart:", error);
        showToast("Gagal menghapus produk.");
        return;

    }

    await updateCartBadge();

    if(typeof renderCart === "function"){
        await renderCart();
    }

}


// =====================================================
// KOSONGKAN CART
// =====================================================

async function clearCart(){

    const user = await getCartUser();

    if(!user) return;

    const { error } = await supabaseClient
        .from("cart")
        .delete()
        .eq("user_id", user.id);

    if(error){

        console.error("Gagal mengosongkan cart:", error);
        showToast("Gagal mengosongkan keranjang.");
        return;

    }

    showToast("Keranjang dikosongkan");

    await updateCartBadge();

    if(typeof renderCart === "function"){
        await renderCart();
    }

}


// =====================================================
// BUKA CART
// =====================================================

async function toggleCart(){

    const loggedIn = await requireCartLogin();

    if(!loggedIn) return;

    window.location.href = "cart.html";

}


// =====================================================
// CHECKOUT WHATSAPP
// =====================================================

async function sendWA(){

    const cart = await getCart();

    if(cart.length === 0){

        showToast("Keranjang masih kosong.");
        return;

    }

    let text =
        "Halo Admin ARNOKIDS,%0A%0A";

    text +=
        "Saya ingin memesan:%0A%0A";

    let total = 0;

    cart.forEach((item, i) => {

        const subtotal =
            item.hargaLusin *
            item.jumlah;

        total += subtotal;

        text +=
            `${i + 1}. ${item.nama}%0A`;

        text +=
            `Jumlah : ${item.jumlah} Lusin%0A`;

        text +=
            `Subtotal : Rp ${subtotal.toLocaleString("id-ID")}%0A%0A`;

    });

    text +=
        "----------------------------%0A";

    text +=
        `TOTAL : Rp ${total.toLocaleString("id-ID")}`;


    window.open(
        `https://wa.me/${phone}?text=${text}`,
        "_blank"
    );


    // Setelah pesanan dikirim, kosongkan cart DATABASE
    const user = await getCartUser();

    if(user){

        const { error } = await supabaseClient
            .from("cart")
            .delete()
            .eq("user_id", user.id);

        if(error){
            console.error(
                "Pesanan terkirim, tetapi gagal mengosongkan cart:",
                error
            );
        }

    }


    const popup =
        document.getElementById("popup");

    if(popup){
        popup.classList.remove("show");
    }

    await updateCartBadge();

    if(typeof renderCart === "function"){
        await renderCart();
    }

    showToast(
        "Pesanan berhasil dikirim ke WhatsApp"
    );

}


// =====================================================
// POPUP KONFIRMASI ORDER
// =====================================================

async function openConfirmOrder(){

    const cart = await getCart();

    if(cart.length === 0){

        showToast("Keranjang masih kosong.");
        return;

    }

    let totalItem = 0;
    let totalHarga = 0;

    cart.forEach(item => {

        totalItem +=
            Number(item.jumlah);

        totalHarga +=
            Number(item.jumlah) *
            Number(item.hargaLusin);

    });

    const itemElement =
        document.getElementById("confirmItem");

    const totalElement =
        document.getElementById("confirmTotal");

    if(itemElement){
        itemElement.textContent =
            totalItem + " Lusin";
    }

    if(totalElement){
        totalElement.textContent =
            "Rp " +
            totalHarga.toLocaleString("id-ID");
    }

    const confirm =
        document.getElementById("confirmOrder");

    if(confirm){
        confirm.classList.add("show");
    }

}


// =====================================================
// TOAST
// =====================================================

function showToast(text){

    const toast =
        document.getElementById("toast");

    const toastText =
        document.getElementById("toastText");

    if(!toast) return;

    if(toastText){
        toastText.textContent = text;
    }

    toast.classList.add("show");

    setTimeout(() => {
        toast.classList.remove("show");
    }, 2000);

}


// =====================================================
// FLY TO CART
// =====================================================

function flyToCart(img){

    let cartIcon;

    if(window.innerWidth <= 768){
        cartIcon =
            document.querySelector(".bottom-cart");
    }else{
        cartIcon =
            document.querySelector(".desktop-cart");
    }

    if(!cartIcon || !img) return;

    const start =
        img.getBoundingClientRect();

    const end =
        cartIcon.getBoundingClientRect();

    const clone =
        img.cloneNode(true);

    clone.className =
        "fly-image";

    clone.style.left =
        start.left + "px";

    clone.style.top =
        start.top + "px";

    clone.style.width =
        start.width + "px";

    clone.style.height =
        start.height + "px";

    document.body.appendChild(clone);

    requestAnimationFrame(() => {

        clone.style.left =
            end.left + "px";

        clone.style.top =
            end.top + "px";

        clone.style.width =
            "25px";

        clone.style.height =
            "25px";

        clone.style.opacity =
            ".2";

    });

    clone.addEventListener(
        "transitionend",
        () => {

            clone.remove();

            cartIcon.classList.remove(
                "cart-pop"
            );

            void cartIcon.offsetWidth;

            cartIcon.classList.add(
                "cart-pop"
            );

        }
    );

}


// =====================================================
// INIT
// =====================================================

document.addEventListener(
    "DOMContentLoaded",
    function(){

        updateCartBadge();

        const cancelBtn =
            document.getElementById(
                "cancelOrder"
            );

        const confirmBtn =
            document.getElementById(
                "confirmWA"
            );

        if(cancelBtn){

            cancelBtn.onclick =
                function(){

                    document
                        .getElementById(
                            "confirmOrder"
                        )
                        .classList.remove("show");

                };

        }

        if(confirmBtn){

            confirmBtn.onclick =
                function(){

                    document
                        .getElementById(
                            "confirmOrder"
                        )
                        .classList.remove("show");

                    sendWA();

                };

        }

    }
);
