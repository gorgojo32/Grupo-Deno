// deno-lint-ignore-file
import { listarCategorias, insertarCategoria, actualizarCategoria, eliminarCategoria } from "../Models/ctgModel.ts";
import { z } from "../Dependencies/dependencias.ts";

export const getCategorias = async (ctx: any) => {
  const { response } = ctx;

  try {
    const result = await listarCategorias();
    await new Promise((r) => setTimeout(r, 10));
    console.log(result);

    if (result.success) {
      response.status = 200;
      response.body = {
        success: true,
        data: result.data,
      };
    } else {
      response.status = 400;
      response.body = {
        success: false,
        msg: "No fue posible cargar la lista de usuarios",
      };
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        msg: error.message,
      };
    } else {
      return {
        success: false,
        msg: "error de servidor",
      };
    }
  }
};

export const postCategorias = async (ctx: any) => {
  const { request, response } = ctx;

  try {
    // Verificar si la solicitud tiene contenido
    const contentLength = request.headers.get("Content-Length");
    if (!contentLength || contentLength === "0") {
      response.status = 400;
      response.body = {
        success: false,
        msg: "Cuerpo de la solicitud vacío",
      };
      return;
    }
             
    // Obtener el cuerpo de la solicitud
    const body = await request.body.json();
    console.log("Datos Recibidos:", body);

    // Validar que los datos existan y sean correctos
    const { tipoProd, tipoDescripcion, estado, fecha } = body;

    if (
      typeof tipoProd !== "string" ||
      tipoProd.trim() === "" ||
      typeof tipoDescripcion !== "string" ||
      tipoDescripcion.trim() === "" ||
      (estado !== 0 && estado !== 1) ||
      !fecha || isNaN(Date.parse(fecha))
    ) {
      response.status = 400;
      response.body = {
        success: false,
        msg: "Datos inválidos. Verifique los campos enviados.",
      };
      return;
    }

    // Convertir `fecha` a Date
    const categoriaData = {
      tipoProd: tipoProd.trim(),
      tipoDescripcion: tipoDescripcion.trim(),
      estado,
      fecha: new Date(fecha),
    };

    // Insertar la categoría en la base de datos
    const result = await insertarCategoria(categoriaData);

    if (result.success) {
      response.status = 201;
      response.body = {
        success: true,
        msg: "Categoría registrada correctamente",
      };
    } else {
      response.status = 400;
      response.body = {
        success: false,
        msg: result.msg || "No se pudo registrar la categoría",
      };
    }
  } catch (error) {
    console.error("Error en postCategorias:", error);
    response.status = 500;
    response.body = {
      success: false,
      msg: "Error interno del servidor",
    };
  }
};

export const updateCategorias = async (ctx: any) => {
  const { request, response, params } = ctx;

  try {
    const { idCtga } = params; // Obtener el ID desde la URL

    // Verificar si el ID es válido
    if (!idCtga) {
      response.status = 400;
      response.body = {
        success: false,
        msg: "ID de categoría no proporcionado",
      };
      return;
    }

    // Verificar si la solicitud tiene contenido
    const contentLength = request.headers.get("Content-Length");
    if (!contentLength || contentLength === "0") {
      response.status = 400;
      response.body = {
        success: false,
        msg: "Cuerpo de la solicitud vacío",
      };
      return;
    }

    const body = await request.body.json();
    console.log("Datos Recibidos:", body);

    // Desestructurar los datos
    const { tipoProd, tipoDescripcion, estado, fecha_creacion } = body;

    if (tipoProd === undefined || tipoDescripcion === undefined || estado === undefined || fecha_creacion === undefined) {
      response.status = 400;
      response.body = {
        success: false,
        msg: "Todos los campos son obligatorios",
      };
      return;
    }

    // Convertir `fecha` a objeto Date si es un string
    const fechaConvertida = new Date(fecha_creacion);

    // Llamar a actualizarCategoria con los parámetros correctos
    const result = await actualizarCategoria(parseInt(idCtga), {
      tipoProd,
      tipoDescripcion,
      estado,
      fecha: fechaConvertida,
    });

    if (result.success) {
      response.status = 200;
      response.body = {
        success: true,
        msg: "Categoría actualizada correctamente",
      };
    } else {
      response.status = 400;
      response.body = {
        success: false,
        msg: result.msg|| "No se pudo actualizar la categoría",
      };
    }
  } catch (error) {
    console.error("Error en updateCategorias:", error);
    response.status = 500;
    response.body = {
      success: false,
      msg: "Error interno del servidor",
    };
  }
};

export const deleteCategorias = async (ctx:any) => {
  const { response, params } = ctx;

  try {
    const { idCtga } = params; // Obtener el ID desde la URL

    // Verificar si el ID es válido
    if (!idCtga) {
      response.status = 400;
      response.body = {
        success: false,
        msg: "ID de usuario no proporcionado",
      };
      return;
    }

    // Llamar al modelo para eliminar el usuario
    const result = await eliminarCategoria(idCtga);

    if (result.success) {
      response.status = 200;
      response.body = {
        success: true,
        msg: "Categoria eliminada correctamente",
      };
    } else {
      response.status = 400;
      response.body = {
        success: false,
        msg: result.msg || "No se pudo eliminar el usuario",
      };
    }
  } catch (error) {
    response.status = 500;
    response.body = {
      success: false,
      msg: "Error interno del servidor",
    };
  }
};


