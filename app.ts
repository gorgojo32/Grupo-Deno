import { Application, oakCors } from "./dependencies/dependencias.ts";
import { routerProd } from "./routes/prodRoutes.ts";

const app = new Application();

app.use(oakCors());

app.use(routerProd.routes());
app.use(routerProd.allowedMethods());


console.log('Servidor corriendo por el puerto 8000');

app.listen({port: 8000});
