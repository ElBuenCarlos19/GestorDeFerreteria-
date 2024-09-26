const { supabase } = require("../connection.js");

async function searchProduct(search, dataSearch) {
    const { data, error } = await supabase
            .from(dataSearch[0])
            .select(dataSearch[1])
            .ilike(dataSearch[1], `%${search}%`); 
    if (error) {
        console.error("Error al buscar producto:", error.message);
    }
    console.log(data);
    return data;
}

async function searchallrows(dataSearch) {
    const tableName = dataSearch[0]; 
    const columnsToSelect = dataSearch.slice(1).join(', '); 

    const { data, error } = await supabase
            .from(tableName)
            .select(columnsToSelect);
    if (error) {
        console.error("Error al buscar producto:", error.message);
    }
    console.log(data);
    return data;
}

async function insertOneRow(dataInsert) {
    const { error } = await supabase
  .from(dataInsert.table)
  .insert(dataInsert.row)

  return error;
}

module.exports = {
    searchProduct,
    searchallrows,
    insertOneRow
}