import { Context } from "../Dependencias/dependenciasUsuario.ts";
import { ensureDir } from "https://deno.land/std/fs/mod.ts";
import { Conexion } from "../Modelo/Conexion.ts";

const UPLOAD_DIR = "./uploads/";
const IMAGENES_DIR = UPLOAD_DIR + "imagenes/";

/**
 * Middleware para la subida de imágenes
 * Gestiona la subida de archivos de imagen y los guarda en la carpeta especificada
 */
export const subirImagen = async (ctx: Context) => {
  try {
    // Asegurar que existe la carpeta de uploads
    await ensureDir(UPLOAD_DIR);
    // Asegurar que existe la carpeta específica para imágenes
    await ensureDir(IMAGENES_DIR);

    // Verificar si la petición tiene archivos
    const body = await ctx.request.body({ type: "form-data" });
    const formData = await body.value.read();
    
    // Verificar si hay archivos en la petición
    if (!formData.files || formData.files.length === 0) {
      ctx.response.status = 400;
      ctx.response.body = {
        success: false,
        msg: "No se ha subido ningún archivo"
      };
      return;
    }

    // Obtener el primer archivo (imagen)
    const file = formData.files[0];
    
    // Verificar si es una imagen
    if (!file.contentType || !file.contentType.startsWith('image/')) {
      ctx.response.status = 400;
      ctx.response.body = {
        success: false,
        msg: "El archivo no es una imagen válida"
      };
      return;
    }

    // Obtener la extensión del archivo
    const fileExt = file.filename.substring(file.filename.lastIndexOf('.'));
    
    // Generar un nombre único para la imagen
    const timestamp = new Date().getTime();
    const fileName = `imagen_${timestamp}${fileExt}`;
    const filePath = `${IMAGENES_DIR}${fileName}`;
    
    // Guardar el archivo
    const data = await Deno.readFile(file.filename);
    await Deno.writeFile(filePath, data);

    // Opcional: Guardar referencia en la base de datos si es necesario
    // const conexion = new Conexion();
    // await conexion.ejecutarConsulta("INSERT INTO imagenes (nombre, ruta) VALUES (?, ?)", [fileName, filePath]);
    
    // Devolver respuesta exitosa
    ctx.response.status = 200;
    ctx.response.body = {
      success: true,
      fileName: fileName,
      filePath: filePath,
      msg: "Imagen subida correctamente"
    };
    
  } catch (error) {
    console.error("Error al subir la imagen:", error);
    ctx.response.status = 500;
    ctx.response.body = {
      success: false,
      msg: "Error al procesar la imagen",
      error: error.message
    };
  }
};

/**
 * Middleware para subir imágenes a directorios específicos
 * Permite especificar un subdirectorio dentro de uploads
 */
export const subirImagenDirectorio = async (ctx: Context) => {
  try {
    // Asegurar que existe la carpeta principal de uploads
    await ensureDir(UPLOAD_DIR);
    
    // Obtener el cuerpo de la petición
    const body = await ctx.request.body({ type: "form-data" });
    const formData = await body.value.read();
    
    // Verificar si hay archivos y directorio en la petición
    if (!formData.files || formData.files.length === 0) {
      ctx.response.status = 400;
      ctx.response.body = {
        success: false,
        msg: "No se ha subido ningún archivo"
      };
      return;
    }
    
    // Obtener el directorio específico (por defecto 'imagenes')
    const directorio = formData.fields.directorio || 'imagenes';
    const directorioPath = `${UPLOAD_DIR}${directorio}/`;
    
    // Asegurar que existe el directorio específico
    await ensureDir(directorioPath);
    
    // Obtener el archivo
    const file = formData.files[0];
    
    // Verificar si es una imagen
    if (!file.contentType || !file.contentType.startsWith('image/')) {
      ctx.response.status = 400;
      ctx.response.body = {
        success: false,
        msg: "El archivo no es una imagen válida"
      };
      return;
    }
    
    // Obtener la extensión del archivo
    const fileExt = file.filename.substring(file.filename.lastIndexOf('.'));
    
    // Generar un nombre único para la imagen
    const timestamp = new Date().getTime();
    const fileName = `${directorio}_${timestamp}${fileExt}`;
    const filePath = `${directorioPath}${fileName}`;
    
    // Guardar el archivo
    const data = await Deno.readFile(file.filename);
    await Deno.writeFile(filePath, data);
    
    // Devolver respuesta exitosa
    ctx.response.status = 200;
    ctx.response.body = {
      success: true,
      fileName: fileName,
      filePath: filePath,
      msg: "Imagen subida correctamente al directorio: " + directorio
    };
    
  } catch (error) {
    console.error("Error al subir la imagen:", error);
    ctx.response.status = 500;
    ctx.response.body = {
      success: false,
      msg: "Error al procesar la imagen",
      error: error.message
    };
  }
};

/**
 * Middleware para eliminar imágenes
 */
export const eliminarImagen = async (ctx: Context) => {
  try {
    // Obtener el nombre del archivo de los parámetros
    const params = ctx.params;
    if (!params || !params.nombre) {
      ctx.response.status = 400;
      ctx.response.body = {
        success: false,
        msg: "No se especificó el nombre del archivo"
      };
      return;
    }
    
    const fileName = params.nombre;
    
    // Verificar si se especificó un directorio
    const body = await ctx.request.body({ type: "json" }).value;
    const directorio = body.directorio || 'imagenes';
    const filePath = `${UPLOAD_DIR}${directorio}/${fileName}`;
    
    // Verificar si el archivo existe
    try {
      await Deno.stat(filePath);
    // deno-lint-ignore no-unused-vars
    } catch (error) {
      ctx.response.status = 404;
      ctx.response.body = {
        success: false,
        msg: "El archivo no existe"
      };
      return;
    }
    
    // Eliminar el archivo
    await Deno.remove(filePath);
    
    // Devolver respuesta exitosa
    ctx.response.status = 200;
    ctx.response.body = {
      success: true,
      msg: "Imagen eliminada correctamente"
    };
    
  } catch (error) {
    console.error("Error al eliminar la imagen:", error);
    ctx.response.status = 500;
    ctx.response.body = {
      success: false,
      msg: "Error al eliminar la imagen",
      error: error.message
    };
  }
};

/**
 * Middleware