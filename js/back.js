const params = new URLSearchParams(window.location.search);

const from = params.get("from");

document.getElementById("backBtn").addEventListener("click", () => {

    if (from === "profile") {

        window.location.href = "profile.html";

    } else {

        window.location.href = "index.html";

    }

});