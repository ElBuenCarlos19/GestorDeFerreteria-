const { supabase } = require("../connection");

async function verificarCredenciales(username, password) {
    try {
        const { data, error } = await supabase
            .from("users")
            .select("username, password")
            .eq("username", username)
            .single();

        if (error) {
            console.error("Error al consultar la base de datos:", error.message);
            return;
        }

        if (data && data.password === password) {
            console.log("¡Ingreso exitoso! Bienvenido, " + data.username);
            return 1;
        } else {
            console.log("Credenciales inválidas. Verifica tu usuario y contraseña.");
            return 2;
        }
    } catch (err) {
        console.error("Error al verificar las credenciales:", err.message);
    }
}

module.exports = { verificarCredenciales };