const form = document.getElementById("loginForm");

form.addEventListener("submit", async (e) => {

    e.preventDefault();

    let phone = document.getElementById("whatsapp").value.trim();

phone = phone.replace(/\D/g, "");

if (phone.startsWith("08")) {
    phone = "62" + phone.substring(1);
}
    
    const password = document.getElementById("password").value;

    // Ubah nomor menjadi email virtual
    const email = phone + "@arnokids.id";

    const { data, error } = await supabaseClient.auth.signInWithPassword({

        email,
        password

    });

    if (error) {

        alert(error.message);
        return;

    }

    alert("Login berhasil");

    window.location.href = "index.html";

});