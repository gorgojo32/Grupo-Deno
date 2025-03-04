// Middlewares/fileUpload.ts
import { Context } from "../Dependencies/dependencias.ts";
import { ensureDirSync } from "https://deno.land/std@0.208.0/fs/ensure_dir.ts";
import { extname } from "https://deno.land/std@0.208.0/path/mod.ts";
// Importación correcta de uuid
import { v4 as uuidv4 } from "https://deno.land/std@0.208.0/uuid/mod.ts";

// Configuración específica para imágenes
const UPLOAD_DIR = "./uploads/images";
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_EXTENSIONS = [".jpg", ".jpeg", ".png", ".gif", ".webp"];

// Crear el directorio si no existe
try {
  ensureDirSync(UPLOAD_DIR);
} catch (error) {
  const err = error as Error;
  console.error(`Error al crear el directorio de imágenes: ${err.message}`);
}

/**
 * Middleware para subir imágenes
 * Solo acepta archivos de imagen (.jpg, .jpeg, .png, .gif, .webp)
 * Finaliza la petición con una respuesta directa
 */
export const fileUpload = async (ctx: Context, next: () => Promise<unknown>) => {
  // Verificar si es una petición POST a la ruta /api/upload/image
  const isImageUploadRoute = ctx.request.url.pathname === "/api/upload/image";
  const isPostMethod = ctx.request.method === "POST";
  
  if (!(isImageUploadRoute && isPostMethod)) {
    return await next();
  }
  
  // Verificar si la petición tiene cuerpo
  if (!ctx.request.hasBody) {
    ctx.response.status = 400;
    ctx.response.body = { 
      success: false, 
      message: "No se envió ningún archivo" 
    };
    return;
  }

  try {
    // Forma correcta de acceder al body en Oak v17
    const formData = await ctx.request.body({ type: "form-data" }).value;
    const data = await formData.read({ maxSize: MAX_FILE_SIZE });
    
    // Verificar si hay archivos
    if (!data.files || data.files.length === 0) {
      ctx.response.status = 400;
      ctx.response.body = { 
        success: false, 
        message: "No se encontraron archivos de imagen" 
      };
      return;
    }

    const uploadedFiles = [];

    // Procesar cada archivo
    for (const file of data.files) {
      if (!file.filename || !file.content) {
        continue;
      }

      // Validar extensión
      const extension = extname(file.filename).toLowerCase();
      if (!ALLOWED_EXTENSIONS.includes(extension)) {
        ctx.response.status = 400;
        ctx.response.body = { 
          success: false, 
          message: `Tipo de archivo no permitido: ${extension}. Solo se permiten: ${ALLOWED_EXTENSIONS.join(", ")}` 
        };
        return;
      }

      // Generar nombre único - usando uuidv4() directamente
      const uniqueFileName = `${uuidv4()}${extension}`;
      const filePath = `${UPLOAD_DIR}/${uniqueFileName}`;
      
      // Guardar archivo
      await Deno.writeFile(filePath, file.content);
      
      // Añadir a la lista de archivos subidos
      uploadedFiles.push({
        originalName: file.filename,
        fileName: uniqueFileName,
        path: filePath,
        size: file.content.length,
      });
    }

    // Responder con éxito
    ctx.response.status = 200;
    ctx.response.body = { 
      success: true, 
      message: "Imágenes subidas correctamente", 
      files: uploadedFiles 
    };
    
  } catch (error) {
    // Manejar errores con tipado correcto
    const err = error as Error;
    
    // Manejar errores específicos
    if (err.name === "PayloadTooLargeError") {
      ctx.response.status = 413;
      ctx.response.body = { 
        success: false, 
        message: `El archivo es demasiado grande. El tamaño máximo permitido es ${MAX_FILE_SIZE / (1024 * 1024)}MB` 
      };
    } else {
      console.error(`Error al procesar la subida de imágenes: ${err.message}`);
      ctx.response.status = 500;
      ctx.response.body = { 
        success: false, 
        message: "Error interno al procesar la subida de imágenes" 
      };
    }
  }
};