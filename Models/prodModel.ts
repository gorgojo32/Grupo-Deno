import { z } from "../dependencies/dependencias.ts";
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
    try {
        const {rows:productos}= await Conexion.execute('');
        return{
            success:true,
            data: productos as productosData[],
        };
    } catch (error) {
        if (error instanceof z.ZodError) {
            return{success: false,msg:error.message}
            
        } else {
            return{success: false,msg:"Error en el servidor"}
        }
    }

}