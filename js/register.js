const form = document.getElementById("registerForm");

form.addEventListener("submit", async (e) => {

    e.preventDefault();

    const nama = document.getElementById("nama").value.trim();
    
    let whatsapp = document.getElementById("whatsapp").value.trim();

whatsapp = whatsapp.replace(/\D/g, "");

if (whatsapp.startsWith("08")) {
    whatsapp = "62" + whatsapp.substring(1);
}
    
    const kota = document.getElementById("kota").value.trim();
    const tipe = document.getElementById("tipe").value;
    const password = document.getElementById("password").value;
    const confirm = document.getElementById("confirmPassword").value;

    if(password !== confirm){
        alert("Konfirmasi password tidak sama.");
        return;
    }

    // Email virtual dari nomor WhatsApp
    const email = `${whatsapp}@arnokids.id`;

if (password.length < 8) {
    alert("Password minimal 8 karakter.");
    return;
}

    // Daftar ke Supabase Auth
    const { data, error } = await supabaseClient.auth.signUp({
        email,
        password
    });

    if(error){
        alert(error.message);
        return;
    }

    // Simpan profil
    const { error: profileError } = await supabaseClient
    .from("profiles")
    .insert({
        id: data.user.id,
        nama,
        whatsapp,
        kota,
        tipe_jualan: tipe
    });

    if(profileError){
        alert(profileError.message);
        return;
    }

    alert("Pendaftaran berhasil!");

    window.location.href = "index.html";

});