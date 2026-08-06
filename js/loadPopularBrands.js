async function loadPopularBrands(){

    const { data, error } = await supabaseClient
        .from("brands")
        .select("*")
        .eq("popular", true)
        .order("popular_order",{ascending:true});

    if(error){

        console.error(error);

        return;

    }

    renderPopularBrands(data);

}

loadPopularBrands();