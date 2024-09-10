const { supabase } = require("../connection.js");

async function searchProduct(search, dataSearch) {
    const { data, error } = await supabase
            .from(dataSearch[0])
            .select(dataSearch[1])
            .ilike(dataSearch[1], `%${search}%`); 
    if (error) {
        console.error("Error al buscar producto:", error.message);
    }
    return data;
}

module.exports = {
    searchProduct
}