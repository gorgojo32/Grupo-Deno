import {Client} from "../Dependencies/dependencias.ts";

///hola

export const Conexion = await new Client().connect({
    hostname: "localhost",
    username: "root",
    db: "cafeteria",
    password: "",
})