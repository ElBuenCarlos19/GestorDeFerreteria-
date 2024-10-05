const { supabase } = require("../connection.js");

async function searchProduct(search, dataSearch) {
    const columnsToSelect = dataSearch.slice(1).join(', '); 
    const { data, error } = await supabase
            .from(dataSearch[0])
            .select(columnsToSelect)
            .ilike(dataSearch[1], `%${search}%`);
    if (error) {
        console.error("Error al buscar producto:", error.message);
    }
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
    return data;
}

async function insertOneRow(dataInsert) {
    const { error } = await supabase
  .from(dataInsert.table)
  .insert(dataInsert.row)

  return error;
}

async function FillTables(table) {

    const { data, error } = await supabase
            .from(table.table)
            .select(generateRowString(table))
    if (error) {
        console.log("Error al buscar producto:", error.message);
    }
    return data;
}


function generateRowString(tableObject) {
    const { row } = tableObject;
    const rowValues = Object.values(row);
    return rowValues.join(', ');
  }
module.exports = {
    searchProduct,
    searchallrows,
    insertOneRow,
    FillTables
}