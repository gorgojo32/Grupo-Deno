import {Client} from "../dependencies/dependencias.ts";

// Julio Se la come
// Prueba 2
// Prueba 3

export const Conexion = await new Client().connect({
    hostname: "localhost",
    username: "root",
    db: "",
    password: "",
})