const { supabase } = require("../connection.js");

async function deleteOneRow(dataDelete) {
    const { error } = await supabase
            .from(dataDelete.table)
            .delete()  
            .eq(dataDelete.column, dataDelete.value)
    return error;
    
}

module.exports = {
    deleteOneRow
}