// deno-lint-ignore-file
import { z } from "../Dependencies/dependencias.ts";
import { Conexion } from "../Models/conexion.ts";
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
      imagen,
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

    // Ahora validamos que imagen sea una cadena válida, pero permitimos que sea
    // undefined o vacía cuando el producto no tiene imagen
    const imagenPath = imagen && typeof imagen === "string" ? imagen.trim() : "";

    const productoData = {
      id_categoria,
      nombre: nombre.trim(),
      descripcion: descripcion.trim(),
      precio,
      costo,
      imagen: imagenPath,
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

export const putProd = async (ctx: any) => {
  const { request, response, params } = ctx;
  try {
    const { id_producto } = params;
    // Verificar si el ID es válido
    if (!id_producto) {
      response.status = 400;
      response.body = {
        success: false,
        msg: "ID de producto no proporcionado",
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
      imagen,
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

    // Validación de imagen, permitiendo que sea undefined o vacía
    const imagenPath = imagen && typeof imagen === "string" ? imagen.trim() : "";

    const fechaConvertida = new Date(fecha_creacion);
    const result = await actualizarProducto(parseInt(id_producto), {
      id_categoria,
      nombre,
      descripcion,
      precio,
      costo,
      stock,
      imagen: imagenPath,
      estado,
      fecha: fechaConvertida,
    });

    if (result.success) {
      response.status = 200;
      response.body = {
        success: true,
        msg: "Producto actualizado correctamente",
      };
    } else {
      response.status = 400;
      response.body = {
        success: false,
        msg: result.msg || "No se pudo actualizar el producto",
      };
    }
  } catch (error) {
    console.error("Error en putProd:", error);
    response.status = 500;
    response.body = {
      success: false,
      msg: "Error interno del servidor",
    };
  }
};

export const updateProductImage = async (ctx: any) => {
  const { request, response, params } = ctx;
  
  try {
    const { id_producto } = params;
    
    if (!id_producto) {
      response.status = 400;
      response.body = {
        success: false,
        msg: "ID de producto no proporcionado",
      };
      return;
    }
    
    // Verificar contenido de la solicitud
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
    const { imagen } = body;
    
    if (!imagen || typeof imagen !== "string" || imagen.trim() === "") {
      response.status = 400;
      response.body = {
        success: false,
        msg: "Ruta de imagen no válida",
      };
      return;
    }
    
    // Actualizar solo el campo de imagen
    const result = await Conexion.execute(
      "UPDATE productos SET imagen = ? WHERE id_producto = ?",
      [imagen.trim(), parseInt(id_producto)]
    );
    
    if (result && result.affectedRows && result.affectedRows > 0) {
      response.status = 200;
      response.body = {
        success: true,
        msg: "Imagen del producto actualizada correctamente",
      };
    } else {
      response.status = 404;
      response.body = {
        success: false,
        msg: `No se encontró el producto con ID ${id_producto}`,
      };
    }
  } catch (error) {
    console.error("Error al actualizar imagen:", error);
    response.status = 500;
    response.body = {
      success: false,
      msg: "Error interno del servidor",
    };
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
        msg: "ID de producto no proporcionado",
      };
      return;
    }

    const result = await EliminarProducto(parseInt(id_producto));

    if (result.success) {
      response.status = 200;
      response.body = result;
    } else {
      response.status = 404;
      response.body = result;
    }
  } catch (error) {
    response.status = 500;
    response.body = {
      success: false,
      msg: "Error interno del servidor",
    };
  }
};

