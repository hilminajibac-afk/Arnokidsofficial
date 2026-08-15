/* =====================================================
   ARNOKIDS AUTH GATE
   Halaman katalog/detail hanya boleh dibuka user login.
===================================================== */
(async function requireArnokidsLogin(){

    if (typeof supabaseClient === "undefined") {
        console.error("supabaseClient belum tersedia.");
        return;
    }

    const { data, error } = await supabaseClient.auth.getSession();

    if (error) {
        console.error("Gagal mengecek login:", error);
        return;
    }

    if (data && data.session) return;

    const currentPage =
        window.location.pathname.split("/").pop() +
        window.location.search;

    window.location.replace(
        "login.html?redirect=" +
        encodeURIComponent(currentPage)
    );

})();
