import { z } from "https://deno.land/x/zod@v3.24.1/index.ts";
import { Conexion } from "../Models/conexion.ts";

interface ctgData {
    idusuario: number | null;
    nombre: string;
    descripcion: string;
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
