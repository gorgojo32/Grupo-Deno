import { z } from "https://deno.land/x/zod@v3.24.1/index.ts";
import { Conexion } from "./conexion.ts";

interface ctgData {
    idCtg: number | null;
    tipoProd: string;
    tipoDescripcion: string;
    estado: string;
    fecha: string;
  }
  
  export const listarCategorias = async () => {
    try {
      const { rows: categorias } = await Conexion.execute(
        "SELECT * FROM categorias",
      );
      return {
        success: true,
        data: categorias as ctgData[],
      };
    } catch (error) {
      if (error instanceof z.ZodError) {
        return {
          success: false,
          message: error.message,
        };
      } else {
        return {
          success: false,
          msg: "Error en el servidor",
        };
      }
    }
  };

  export const insertCategoria = async (categoria: ctgData) => {
    try {
      const result = await Conexion.execute(
        `INSERT INTO categorias (idusuario, nombre, descripcion, estado, fecha) 
         VALUES (?, ?, ?, ?, ?)`,
        [
          categoria.idCtg,
          categoria.tipoProd,
          categoria.tipoDescripcion,
          categoria.estado,
          categoria.fecha,
        ]
      );
  
      return {
        success: true,
        message: "Categoría insertada con éxito",
        insertId: result.lastInsertId, // Depende de tu DB driver
      };
    } catch (error) {
      console.error("Error al insertar categoría:", error);
      return {
        success: false,
        msg: "Error en el servidor al insertar la categoría",
      };
    }
  };

  export const actualizarCategoria = async(idCtga: number, ctgaData: Partial<ctgData>) => {
    await Conexion.execute(
      'UPDATE categorias SET tipoProducto = ?, tipoDescripcion = ?, estado = ?, fecha = ? WHERE id_categoria = ?',
      [ctgaData.tipoProd, ctgaData.tipoDescripcion, ]
    )
  }
  
