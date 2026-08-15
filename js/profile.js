(async () => {

    // ==========================
    // CEK SESSION
    // ==========================

    const { data, error: sessionError } =
        await supabaseClient.auth.getSession();

    if (sessionError) {

        console.error("Session error:", sessionError);

        window.location.href = "login.html";

        return;

    }

    if (!data.session) {

        window.location.href = "login.html";

        return;

    }


    // ==========================
    // LOGOUT
    // ==========================

    const logoutBtn =
        document.getElementById("logoutBtn");

    if (logoutBtn) {

        logoutBtn.addEventListener("click", async () => {

            logoutBtn.disabled = true;

            logoutBtn.textContent = "Keluar...";

            const { error } =
    await supabaseClient.auth.signOut();

if (error) {

    console.error("Logout gagal:", error);

    showToast(error.message);

    logoutBtn.disabled = false;

    logoutBtn.textContent = "Keluar";

    return;
}


// Logout berhasil
localStorage.removeItem(
    "activeCartUser"
);


window.location.href =
    "index.html";

        });

    }


    // ==========================
    // AMBIL DATA USER
    // ==========================

    const user = data.session.user;


    const {
        data: profile,
        error: profileError
    } = await supabaseClient

        .from("profiles")

        .select("*")

        .eq("id", user.id)

        .single();


    // ==========================
    // CEK PROFILE
    // ==========================

    if (profileError) {

        console.error(
            "Profile error:",
            profileError
        );

        return;

    }


    // ==========================
    // TAMPILKAN PROFILE
    // ==========================

    const nama =
        document.getElementById("profileNama");

    const whatsapp =
        document.getElementById("profileWhatsapp");

    const kota =
        document.getElementById("profileKota");

    const tipe =
        document.getElementById("profileTipe");


    if (nama) {

        nama.textContent =
            profile.nama || "-";

    }


    if (whatsapp) {

        whatsapp.textContent =
            profile.whatsapp || "-";

    }


    if (kota) {

        kota.textContent =
            profile.kota || "-";

    }


    if (tipe) {

        tipe.textContent =
            profile.tipe_jualan || "-";

    }

})();