import { Application, oakCors } from "./Dependencies/dependencias.ts";
import { routerProd } from "./Routes/prodRoutes.ts";
import { routerCategoria } from "./Routes/ctgRoutes.ts";
import { uploadMiddleware } from "./Middlewares/middIeImagenes.ts";

const app = new Application();

app.use(oakCors());

app.use(uploadMiddleware);

app.use(routerProd.routes());
app.use(routerProd.allowedMethods());

app.use(routerCategoria.routes());
app.use(routerCategoria.allowedMethods());

console.log('Servidor corriendo por el puerto 8000');

app.listen({port: 8000});
