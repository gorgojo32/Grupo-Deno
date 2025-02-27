import { Conexion } from "./conexion.ts";


interface productosData{
    id_producto: number | null;
    id_categoria: number;
    nombre: string;
    descripcion: string;
    precio: number;
    costo: number;
    stock: number;
    imagen: string;
}

export const listarProductos = async()=>{
    
}