// app.ts - Archivo principal completo
import { Application, Router, oakCors } from "./Dependencies/dependencias.ts";
import { routerProd } from "./Routes/prodRoutes.ts";
import { routerCategoria } from "./Routes/ctgRoutes.ts";

import { errorHandler } from "./Middlewares/errorHandler.ts";
import { logger } from "./Middlewares/logger.ts";
import { logData } from "./Middlewares/logData.ts";
import { uploadImageMiddleware } from "./Middlewares/uploadFile.ts";
import { serveStatic } from "./Utilities/imageUrls.ts";

const app = new Application();

// Middlewares globales
app.use(errorHandler);
app.use(logger);
app.use(logData);
app.use(oakCors());

// Middleware para servir archivos estáticos desde la carpeta uploads
app.use(serveStatic("."));

// Router para productos
app.use(routerProd.routes());
app.use(routerProd.allowedMethods());

// Router para categorías
app.use(routerCategoria.routes());
app.use(routerCategoria.allowedMethods());

// Router para subida de archivos
const uploadRouter = new Router();
uploadRouter.post("/upload", uploadImageMiddleware);
app.use(uploadRouter.routes());
app.use(uploadRouter.allowedMethods());

console.log('Servidor corriendo por el puerto 8000');
app.listen({port: 8000});