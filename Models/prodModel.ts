import { z } from "../Dependencies/dependencias.ts";
import { Conexion } from "./conexion.ts";

//hola
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
        const {rows:productos}= await Conexion.execute('SELECT id_producto,nombre,descripcion,precio,costo,stock,imagen,productos.id_categoria,tipoProducto FROM productos INNER JOIN categorias ON productos.id_categoria = categorias.id_categoria');
        return{
            success:true,
            data: productos as productosData[],
        };
    } catch (error) {
        console.error("Error en listarProductos:", error);
        if (error instanceof z.ZodError) {
            return{success: false,msg:error.message}
            
        } else {
            return{success: false,msg:"Error en el servidor"}
        }
    }

}