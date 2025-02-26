import {Client} from "../dependencies/dependencias.ts";

// Julio Se la come
// Prueba 2

export const Conexion = await new Client().connect({
    hostname: "localhost",
    username: "root",
    db: "",
    password: "",
})