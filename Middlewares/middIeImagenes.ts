// middleImagenes.ts
import { Context, NextFunction } from "https://deno.land/x/oak@v10.6.0/mod.ts";
import { ensureDir } from "https://deno.land/std@0.170.0/fs/ensure_dir.ts";
import { extname, join } from "https://deno.land/std@0.170.0/path/mod.ts";


const UPLOAD_DIR = "./public";
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

export async function uploadMiddleware(ctx: Context, next: NextFunction) {
  if (ctx.request.url.pathname !== "/upload" || ctx.request.method !== "POST") {
    return await next();
  }

  try {
    if (!ctx.request.hasBody) {
      ctx.response.status = 400;
      ctx.response.body = {
        success: false,
        msg: "No se enviaron datos en la solicitud"
      };
      return;
    }

    
    const body = ctx.request.body({ type: "form-data" });
    const formData = await body.value.read({ maxSize: MAX_FILE_SIZE });

    
    if (!formData.files || formData.files.length === 0) {
      ctx.response.status = 400;
      ctx.response.body = {
        success: false,
        msg: "No se encontró ningún archivo"
      };
      return;
    }

    const file = formData.files[0];

    
    const allowedTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];
    if (!file.contentType || !allowedTypes.includes(file.contentType)) {
      ctx.response.status = 400;
      ctx.response.body = {
        success: false,
        msg: `Tipo de archivo no permitido. Solo se permiten: ${allowedTypes.join(", ")}`
      };
      return;
    }

    
    const directorio = formData.fields.directorio || "Starbucks";
    const uploadPath = join(UPLOAD_DIR, directorio);

    
    await ensureDir(uploadPath);

    
    const extension = extname(file.originalName || "image.jpg");
    const timestamp = Date.now();
    const randomStr = Math.random().toString(36).substring(2, 10);
    const nuevoNombre = `${timestamp}_${randomStr}${extension}`;
    
    const filePath = join(uploadPath, nuevoNombre);

    
    await Deno.writeFile(filePath, file.content);

    
    ctx.response.status = 200;
    ctx.response.body = {
      success: true,
      fileName: nuevoNombre,
      path: `${directorio}/${nuevoNombre}`,
      msg: "Archivo subido correctamente"
    };

  } catch (error) {
    console.error("Error al procesar la subida:", error);
    
    if (error.name === "RequestEntityTooLarge") {
      ctx.response.status = 413;
      ctx.response.body = {
        success: false,
        msg: "El archivo excede el tamaño máximo permitido (5MB)"
      };
      return;
    }
    
    ctx.response.status = 500;
    ctx.response.body = {
      success: false,
      msg: "Error interno al procesar la subida de archivos"
    };
  }
}