const form = document.getElementById("registerForm");

form.addEventListener("submit", async (e) => {

    e.preventDefault();

    const nama =
        document.getElementById("nama").value.trim();

    let whatsapp =
        document.getElementById("whatsapp").value.trim();

    whatsapp = whatsapp.replace(/\D/g, "");

    // Format database = 08
    if (whatsapp.startsWith("62")) {
        whatsapp = "0" + whatsapp.substring(2);
    }

    if (whatsapp.startsWith("8")) {
        whatsapp = "0" + whatsapp;
    }

    // Format Supabase Auth = 62
    const authPhone =
        "62" + whatsapp.substring(1);

    const email =
        document.getElementById("email").value.trim();

    const kota =
        document.getElementById("kota").value.trim();

    const tipe =
        document.getElementById("tipe").value;

    const password =
        document.getElementById("password").value;

    const confirm =
        document.getElementById("confirmPassword").value;


    // Cek password
    if (password !== confirm) {

        showToast("Konfirmasi password tidak sama.");

        return;

    }


    if (password.length < 8) {

        showToast("Password minimal 8 karakter.");

        return;

    }


    // ==============================
    // DAFTAR SUPABASE AUTH
    // PHONE SAJA
    // ==============================

    const {
        data,
        error
    } = await supabaseClient.auth.signUp({

        phone: authPhone,

        password: password

    });


    if (error) {

        showToast(error.message);

        return;

    }


    // ==============================
    // SIMPAN PROFILE
    // ==============================

    const {
        error: profileError
    } = await supabaseClient
        .from("profiles")
        .insert({

            id: data.user.id,

            nama: nama,

            whatsapp: whatsapp,

            email: email,

            kota: kota,

            tipe_jualan: tipe

        });


    if (profileError) {

        showToast(profileError.message);

        return;

    }


    showToastThen("Pendaftaran berhasil", () => {
        window.location.replace("login.html");
    });

});