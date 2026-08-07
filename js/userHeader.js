(async () => {

    const btn = document.getElementById("desktopUserBtn");

    if (!btn) return;


    const {
        data: { session }
    } = await supabaseClient.auth.getSession();


    // BELUM LOGIN
    if (!session) {

        btn.href = "login.html";

        btn.innerHTML = `
            
            <span>Masuk</span>
        `;

        return;
    }


    // SUDAH LOGIN
    const user = session.user;


    const {
        data: profile,
        error
    } = await supabaseClient

        .from("profiles")

        .select("nama")

        .eq("id", user.id)

        .single();


    if (error || !profile) {

        console.error("Gagal mengambil nama:", error);

        return;
    }


    btn.href = "profile.html";

    btn.innerHTML = `
        
        <span>${profile.nama}</span>
    `;

})();