/* ==========================================
   GLOBAL TOAST NOTIFICATION
   Dipakai untuk menggantikan alert/confirm.
========================================== */
(function () {
    function ensureToast() {
        let toast = document.getElementById("toast");
        if (!toast) {
            toast = document.createElement("div");
            toast.id = "toast";
            toast.className = "toast";
            toast.innerHTML = '<i class="fa-solid fa-circle-check"></i><span id="toastText"></span>';
            document.body.appendChild(toast);
        }
        return toast;
    }

    window.showToast = function (message, duration = 1800) {
        const toast = ensureToast();
        let text = document.getElementById("toastText");
        if (!text) {
            text = document.createElement("span");
            text.id = "toastText";
            toast.appendChild(text);
        }

        text.textContent = message;
        toast.classList.remove("show");
        void toast.offsetWidth;
        toast.classList.add("show");

        clearTimeout(window.__arnokidsToastTimer);
        window.__arnokidsToastTimer = setTimeout(() => {
            toast.classList.remove("show");
        }, duration);
    };

    window.showToastThen = function (message, callback, duration = 1200) {
        window.showToast(message, duration);
        setTimeout(() => {
            if (typeof callback === "function") callback();
        }, duration);
    };
})();
