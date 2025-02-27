import {Client} from "../dependencies/dependencias.ts";

// Prueba 2
// Prueba 3
// Prueba 5

export const Conexion = await new Client().connect({
    hostname: "localhost",
    username: "root",
    db: "",
    password: "",
})