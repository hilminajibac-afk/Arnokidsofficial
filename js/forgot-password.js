
const form =
    document.getElementById("forgotPasswordForm");


form.addEventListener("submit", async (e) => {

    e.preventDefault();


    const email =
        document
        .getElementById("email")
        .value
        .trim()
        .toLowerCase();


    if (!email) {

        showToast("Masukkan email terlebih dahulu.");
        return;

    }


    const { error } =
        await supabaseClient.auth
        .resetPasswordForEmail(
            email,
            {
                redirectTo:
                    "https://hilminajibac-afk.github.io/Arnokidsofficial/reset-password.html"
            }
        );


    if (error) {

        showToast(error.message);

        return;

    }


    showToast("Link reset password sudah dikirim ke email kamu.");

});