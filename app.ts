import { Application, oakCors } from "./Dependencies/dependencias.ts";
import { routerProd } from "./Routes/prodRoutes.ts";
import { routerCategoria } from "./Routes/ctgRoutes.ts";

// Middlewares
import { errorHandler } from "./Middlewares/errorHandler.ts";
import { logger } from "./Middlewares/logger.ts";
import { fileUpload } from "./Middlewares/uploadFile.ts";

const app = new Application();

app.use(errorHandler);
app.use(logger);
app.use(fileUpload);

app.use(oakCors());

app.use(routerProd.routes());
app.use(routerProd.allowedMethods());

app.use(routerCategoria.routes());
app.use(routerCategoria.allowedMethods());

console.log('Servidor corriendo por el puerto 8000');

app.listen({port: 8000});
