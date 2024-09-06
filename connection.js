const { createClient } = require("@supabase/supabase-js");
require("dotenv").config();
const { obtenerUsuario, validar } = require("./scripts/validator.js");

const supabaseUrl = "https://csuryapgaoifuoccvpdk.supabase.co";
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function getAllUsers() {
  console.log("hola");
  const { data, error } = await supabase
    .from("users")
    .select("username, password")
    .where("username", obtenerUsuario().usuario);
  if (error) {
    console.error("Error al consultar la base de datos:", error.message);
  } else {
    console.log("Registros de la tabla Users:", data);
    validar(data);
  }
}

async function getAllRoles() {
  const { data, error } = await supabase.from("role").select("*");
  if (error) {
    console.error("Error al consultar la base de datos:", error.message);
  } else {
    console.log("Registros de la tabla Role:", data);
  }
}

async function insertRole() {
  const newRole = {
    namerole: "Inventory",
    description: "Usuario que realiza el inventario.",
  };

  try {
    const { data, error } = await supabase.from("role").insert([newRole]);
    if (error) {
      console.error("Error inserting role:", error.message);
    } else {
      console.log("Role inserted successfully:", data);
    }
  } catch (error) {
    console.error("An error occurred:", error.message);
  }
}

module.exports = { getAllUsers,
   insertRole, getAllRoles
};
