async function loadBanner() {

    const { data, error } = await supabaseClient
        .from("banners")
        .select("*")
        .eq("status", "Aktif")
        .order("urutan", { ascending: true });

    if (error) {
        console.error(error);
        return;
    }

    const slides = document.getElementById("slides");

    slides.innerHTML = "";

    if (!data || data.length === 0) {

        slides.innerHTML = `
            <div class="swiper-slide">
                <img src="images/no-banner.jpg">
            </div>
        `;

        return;

    }

    data.forEach(item => {

        slides.innerHTML += `
            <div class="swiper-slide">

                <img
                    src="${item.gambar}"
                    alt="${item.judul}"
                >

            </div>
        `;

    });

 new Swiper(".bannerSwiper",{

    slidesPerView:1,

    loop:true,

    speed:1000,

    autoplay:{
        delay:6000,
        disableOnInteraction:false
    },

    pagination:{
        el:".swiper-pagination",
        clickable:true
    }

});

}

loadBanner();