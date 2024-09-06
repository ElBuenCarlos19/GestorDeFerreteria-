const { createClient } = require('@supabase/supabase-js')
const supabaseUrl = 'https://goeznjgozmgogloafpnd.supabase.co'
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdvZXpuamdvem1nb2dsb2FmcG5kIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjU2NDM4NTYsImV4cCI6MjA0MTIxOTg1Nn0.22Je0GfdwkbcYHma_h7C8PUyF7yNmtgRLXLlAYsD1ac'
const supabase = createClient(supabaseUrl, SUPABASE_KEY)
getAllRoles()
async function getAllRoles() {
    const { data, error } = await supabase.from('role').select('*');
if (error) {
  console.error('Error al consultar la base de datos:', error.message);
} else {
  console.log('Registros de la tabla Role:', data);
}
}

async function insertRole() {
    const newRole = {
      namerole: 'Inventory',
      description: 'Usuario que realiza el inventario.',
    };
  
    try {
      const { data, error } = await supabase.from('role').insert([newRole]);
      if (error) {
        console.error('Error inserting role:', error.message);
      } else {
        console.log('Role inserted successfully:', data);
      }
    } catch (error) {
      console.error('An error occurred:', error.message);
    }
  }