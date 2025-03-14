// deno-lint-ignore-file
import { z } from "../Dependencies/dependencias.ts";
import { Conexion } from "./conexion.ts";

interface ctgData {
  id_categoria?: number;
  tipoProducto: string;
  tipoDescripcion: string;
  estado: 0 | 1;
  fecha_creacion: Date;
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

export const insertarCategoria = async (categoria: ctgData) => {
  try {
    const result = await Conexion.execute(
      `INSERT INTO categorias (tipoProducto, tipoDescripcion, estado, fecha_creacion) 
         VALUES (?, ?, ?, ?)`, // Eliminamos id_categorias
      [
        categoria.tipoProducto,
        categoria.tipoDescripcion,
        categoria.estado,
        categoria.fecha_creacion,
      ],
    );

    return {
      success: true,
      message: "Categoría insertada con éxito",
      insertId: result.lastInsertId, // Para obtener el ID generado automáticamente
    };
  } catch (error) {
    console.error("Error al insertar categoría:", error);
    return {
      success: false,
      msg: "Error en el servidor al insertar la categoría",
    };
  }
};

export const actualizarCategoria = async (
  id_Categoria: number,
  ctgaData: Partial<ctgData>,
) => {
  try {
    await Conexion.execute(
      "UPDATE categorias SET tipoProducto = ?, tipoDescripcion = ?, estado = ?, fecha_creacion = ? WHERE id_categoria = ?",
      [
        ctgaData.tipoProducto,
        ctgaData.tipoDescripcion,
        ctgaData.estado,
        ctgaData.fecha_creacion,
        id_Categoria,
      ],
    );
    return {
      success: true,
      msg: "Categoria actualizada correctamente",
    };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, msg: error.message };
    } else {
      return { success: false, msg: "Error al actualizar la categoria" };
    }
  }
};

export const eliminarCategoria = async (idCtga: number) => {
  try {
    const result = await Conexion.execute(
      "DELETE FROM categorias WHERE id_categoria = ?",
      [idCtga],
    );

    if (result.affectedRows && result.affectedRows > 0) {
      return {
        success: true,
        message: "Categoria eliminado correctamente",
      };
    } else {
      return {
        success: false,
        message: "Categoria no encontrada",
      };
    }
  } catch (error) {
    return {
      success: false,
      msg: "Error en el servidor",
    };
  }
};
export const listarComboCategorias = async () => {
  try {
      const {rows: categorias} = await Conexion.execute('SELECT id_categoria, nombre FROM categorias');
      return {
          success: true,
          data: categorias,
      };
  } catch (error) {
      console.error("Error en listarCategorias:", error);
      return {success: false, msg: "Error en el servidor"};
  }
};