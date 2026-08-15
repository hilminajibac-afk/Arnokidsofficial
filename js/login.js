const form = document.getElementById("loginForm");

form.addEventListener("submit", async (e) => {

    e.preventDefault();

    const loginInput =
        document.getElementById("whatsapp").value.trim();

    const password =
        document.getElementById("password").value;


    if (!loginInput || !password) {

        showToast("Masukkan WhatsApp/email dan password.");

        return;

    }


    let data = null;
    let error = null;


    // =========================================
    // LOGIN DENGAN EMAIL
    // =========================================

    if (loginInput.includes("@")) {

        const result =
            await supabaseClient.auth.signInWithPassword({

                email: loginInput.toLowerCase(),

                password: password

            });

        data = result.data;
        error = result.error;

    }


    // =========================================
    // LOGIN DENGAN WHATSAPP
    // =========================================

    else {

        let phone =
            loginInput.replace(/\D/g, "");


        // 08xxxxxxxx
        if (phone.startsWith("08")) {

            phone =
                "62" + phone.substring(1);

        }


        // 8xxxxxxxx
        if (phone.startsWith("8")) {

            phone =
                "62" + phone;

        }


        const result =
            await supabaseClient.auth.signInWithPassword({

                phone: phone,

                password: password

            });

        data = result.data;
        error = result.error;


        // =====================================
        // LOGIN USER LAMA
        // =====================================

        if (error) {

            const oldEmail =
                phone + "@arnokids.id";


            const oldResult =
                await supabaseClient.auth.signInWithPassword({

                    email: oldEmail,

                    password: password

                });


            data = oldResult.data;
            error = oldResult.error;

        }

    }


    // =========================================
    // LOGIN GAGAL
    // =========================================

    if (error) {

        showToast("WhatsApp/email atau password salah.");

        return;

    }


    // =========================================
// SINKRONISASI EMAIL PROFILE KE AUTH
// =========================================

if (!data.user.email) {

    const {
        data: profile,
        error: profileError
    } = await supabaseClient
        .from("profiles")
        .select("email")
        .eq("id", data.user.id)
        .single();


    if (
        !profileError &&
        profile &&
        profile.email
    ) {

        const {
            error: emailError
        } = await supabaseClient.auth.updateUser({

            email: profile.email.trim().toLowerCase()

        });


        if (emailError) {

            console.error(
                "Gagal menghubungkan email:",
                emailError
            );

        } else {
            console.info("Email recovery tersinkronkan ke akun.");
        }

    }

}


    // =========================================
    // BERHASIL
    // =========================================


/* =========================
   KEMBALI KE HALAMAN TUJUAN
========================= */

const params =
    new URLSearchParams(
        window.location.search
    );


const redirect =
    params.get("redirect");


showToastThen("Login berhasil", () => {
    if (redirect) {
        window.location.replace(decodeURIComponent(redirect));
    } else {
        window.location.replace("index.html");
    }
});

});