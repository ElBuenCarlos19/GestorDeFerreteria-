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

async function FillTables(table) {
    console.log(table.row.provider, "si lleg");
    const { data, error } = await supabase
            .from(table.table)
            .select(`${table.row.productcode}, ${table.row.productname}, ${table.row.description}, ${table.row.provider} ,${table.row.quantity}, ${table.row.price}`)
    if (error) {
        console.log("Error al buscar producto:", error.message);
    }
    console.log(data, "eche");
    return data;
}

module.exports = {
    searchProduct,
    searchallrows,
    insertOneRow,
    FillTables
}