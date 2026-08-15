const form =
    document.getElementById("resetPasswordForm");


form.addEventListener("submit", async (e) => {

    e.preventDefault();


    const password =
        document
        .getElementById("password")
        .value;


    const confirmPassword =
        document
        .getElementById("confirmPassword")
        .value;


    if (password.length < 8) {

        showToast("Password minimal 8 karakter.");

        return;

    }


    if (password !== confirmPassword) {

        showToast("Konfirmasi password tidak sama.");

        return;

    }


    const { error } =
        await supabaseClient.auth
        .updateUser({

            password: password

        });


    if (error) {

        showToast(error.message);

        return;

    }


    await supabaseClient.auth.signOut();

    showToastThen("Password berhasil diubah. Silakan login kembali.", () => {
        window.location.replace("login.html");
    });

});