import { Application, oakCors } from "./dependencies/dependencias";
import { routerProd } from "./routes/prodRoutes";

const app = new Application();

app.use(oakCors());

app.use(routerProd.routes());
app.use(routerProd.allowedMethods());


console.log('Servidor corriendo por el puerto 8000');

app.listen({port: 8000});
