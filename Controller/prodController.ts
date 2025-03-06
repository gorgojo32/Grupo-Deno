// deno-lint-ignore-file
import { z } from "../Dependencies/dependencias.ts";
import {
  actualizarProducto,
  EliminarProducto,
  insertarProducto,
  listarProductos,
} from "../Models/prodModel.ts";

export const getProd = async (ctx: any) => {
  const { response } = ctx;
  try {
    const result = await listarProductos();
    if (result.success) {
      response.status = 200;
      response.body = {
        success: true,
        data: result.data,
      };
    } else {
      response.status = 400;
      response.body = {
        success: true,
        msg: "no fue posible cargar una lista de productos",
      };
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { succes: false, msg: error.message };
    } else {
      return { succes: false, msg: "error de servidor" };
    }
  }
};

export const postProd = async (ctx: any) => {
  const { request, response } = ctx;

  try {

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


    const {
      id_categoria,
      nombre,
      descripcion,
      precio,
      costo,
      stock,
      estado,
      fecha_creacion,
    } = body;

    if (
      typeof id_categoria !== "number" ||
      id_categoria <= 0 ||
      typeof nombre !== "string" ||
      nombre.trim() === "" ||
      typeof descripcion !== "string" ||
      descripcion.trim() === "" ||
      typeof precio !== "number" ||
      precio < 0 ||
      typeof costo !== "number" ||
      costo < 0 ||
      typeof stock !== "number" ||
      stock < 0 ||
      (estado !== 0 && estado !== 1) ||
      !fecha_creacion || isNaN(Date.parse(fecha_creacion))
    ) {
      response.status = 400;
      response.body = {
        success: false,
        msg: "Datos inválidos. Verifique los campos enviados.",
      };
      return;
    }


    const productoData = {
      id_categoria,
      nombre: nombre.trim(),
      descripcion: descripcion.trim(),
      precio,
      costo,
      stock,
      estado,
      fecha: new Date(fecha_creacion),
    };

    const result = await insertarProducto(productoData);

    response.status = result.success ? 201 : 400;
    response.body = result;
  } catch (error) {
    console.error("Error en postProd:", error);
    response.status = 500;
    response.body = { success: false, msg: "Error interno del servidor" };
  }
};

export const deleteProd = async (ctx: any) => {
  const { params, response } = ctx;
  try {
    const { id_producto } = params;

    if (!id_producto) {
      response.status = 400;
      response.body = {
        success: false,
        msg: "ID de usuario no proporcionado",
      };
      return;
    }

    const result = await EliminarProducto(params.id_producto);

    if (result.success) {
      response.status = 200;
      response.body = result;
    } else {
      response.status = 404;
      response.body = result;
    }
    // deno-lint-ignore no-unused-vars
  } catch (error) {
    response.status = 500;
    response.body = {
      success: false,
      msg: "Error interno del servidor",
    };
  }
};

export const putProd = async (ctx: any) => {
  const { request, response, params } = ctx;
  try {
    const { id_producto } = params;
    // Verificar si el ID es válido
    if (!id_producto) {
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

    // Validación de datos
    const {
      id_categoria,
      nombre,
      descripcion,
      precio,
      costo,
      stock,
      estado,
      fecha_creacion,
    } = body;

    if (
      typeof id_categoria !== "number" ||
      id_categoria <= 0 ||
      typeof nombre !== "string" ||
      nombre.trim() === "" ||
      typeof descripcion !== "string" ||
      descripcion.trim() === "" ||
      typeof precio !== "number" ||
      precio < 0 ||
      typeof costo !== "number" ||
      costo < 0 ||
      typeof stock !== "number" ||
      stock < 0 ||
      (estado !== 0 && estado !== 1) ||
      !fecha_creacion || isNaN(Date.parse(fecha_creacion))
    ) {
      response.status = 400;
      response.body = {
        success: false,
        msg: "Datos inválidos. Verifique los campos enviados.",
      };
      return;
    }


    // if (id_categoria === undefined || nombre === undefined ||  descripcion === undefined  || 
    //   precio === undefined  || costo === undefined  ||  stock === undefined  || 
    //   estado === undefined || fecha_creacion === undefined) {
    //   response.status = 400;
    //   response.body = {
    //     success: false,
    //     msg: "Todos los campos son obligatorios",
    //   };
    //   return;
    // }

    const fechaConvertida = new Date(fecha_creacion);

    
    const result = await actualizarProducto(parseInt(id_producto), {
      id_categoria,
      nombre,
      descripcion,
      precio,
      costo,
      stock,
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
        msg: result.msg || "No se pudo actualizar la categoría",
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
