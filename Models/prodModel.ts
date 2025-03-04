import { z } from "../Dependencies/dependencias.ts";
import { Conexion } from "./conexion.ts";


interface productosData {
  id_producto?: number;
  id_categoria: number;
  nombre: string;
  descripcion: string;
  precio: number;
  costo: number;
  stock: number;
  estado: 0 | 1;
  fecha: Date;

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
};

export const insertarProducto = async (producto: productosData) => {
  try {
    const result = await Conexion.execute(
      `INSERT INTO productos (id_categoria, nombre, descripcion, precio, costo, stock, estado, fecha_creacion) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        producto.id_categoria,
        producto.nombre,
        producto.descripcion,
        producto.precio,
        producto.costo,
        producto.stock,
        producto.estado,
        producto.fecha,
      ],
    );
    return {
      success: true,
      message: "Producto insertado con éxito",
      insertId: result.lastInsertId,
    };
  // deno-lint-ignore no-unused-vars
  } catch (error) {
    return { success: false, msg: "Error al insertar el producto" };
  }
};

export const actualizarProducto = async (
  id_Producto: number,
  prodData: Partial<productosData>,
) => {
  try {
    await Conexion.execute(
      "UPDATE productos SET id_categoria = ?, nombre = ?, descripcion = ?, precio = ?, costo = ?, stock = ?, estado = ?, fecha_creacion = ? WHERE id_producto = ?",
      [
        prodData.id_categoria,
        prodData.nombre,
        prodData.descripcion,
        prodData.precio,
        prodData.costo,
        prodData.stock,
        prodData.estado,
        prodData.fecha,
        id_Producto,
      ],
    );
    return { success: true, msg: "Producto actualizado correctamente" };
  // deno-lint-ignore no-unused-vars
  } catch (error) {
    return { success: false, msg: "Error al actualizar el producto" };
  }
};

export const EliminarProducto = async (productoId: number) => {
  try {
    const result = await Conexion.execute(
      "DELETE FROM productos WHERE id_producto = ?",
      [productoId],
    );
    
    // Debug the result object to see its structure
    console.log("Delete result:", result);
    
    // Check if any rows were affected by the DELETE operation
    // Use the appropriate property based on your database driver
    if (result && result.affectedRows && result.affectedRows > 0) {
      return {
        success: true,
        msg: "Producto eliminado correctamente",
      };
    } else {
      return {
        success: false,
        msg: `No se encontró el producto con ID ${productoId}`,
      };
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, msg: error.message };
    } else {
      return { success: false, msg: "Error al eliminar el Producto" };
    }
  }
};