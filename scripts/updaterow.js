const { supabase } = require("../connection.js");

async function updateOneRow(dataUpdate) {
    const { error } = await supabase
            .from(dataUpdate.table)
            .update(dataUpdate.row)
            .eq(dataUpdate.column, dataUpdate.value)
    return error;
    
}