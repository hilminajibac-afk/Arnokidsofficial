const cartBox = document.getElementById("cartItems");
const grandTotal = document.getElementById("grandTotal");
const checkoutBtn = document.getElementById("checkoutBtn");

renderCart();

function renderCart() {

    const cart = getCart();

    cartBox.innerHTML = "";

    if (cart.length === 0) {

        cartBox.innerHTML = `
            <div style="text-align:center;padding:60px 20px;">
                <i class="fa-solid fa-cart-shopping"
                    style="font-size:60px;color:#ccc;"></i>

                <h2 style="margin-top:20px;">
                    Keranjang Kosong
                </h2>

                <p>Silakan pilih produk terlebih dahulu.</p>
            </div>
        `;

        grandTotal.textContent = "Rp 0";

        return;
    }

    let total = 0;

    cart.forEach((item, index) => {

        const subtotal = item.hargaLusin * item.jumlah;

        total += subtotal;

        cartBox.innerHTML += `

        <div class="cart-card">

            <img src="${item.gambar}" alt="${item.nama}">

            <div class="cart-info">

                <h3>${item.nama}</h3>

                <p>
                    Rp ${item.hargaLusin.toLocaleString("id-ID")} / Lusin
                </p>

                <div class="qty">

                    <button onclick="changeQty(${index},-1)">
                        -
                    </button>

                    <span>${item.jumlah}</span>

                    <button onclick="changeQty(${index},1)">
                        +
                    </button>

                </div>

                <strong>
                    Rp ${subtotal.toLocaleString("id-ID")}
                </strong>

            </div>

            <button
                class="delete"
                onclick="removeCart(${index})">

                <i class="fa-solid fa-trash"></i>

            </button>

        </div>

        `;

    });

    grandTotal.textContent =
        "Rp " + total.toLocaleString("id-ID");

}

checkoutBtn.onclick = function () {

    openConfirmOrder();

};