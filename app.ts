import { Application,oakCors } from "./dependencies/dependencias.ts";
import {routerProduct} from  "./routes/prodRoutes.ts"
//hola

const app = new Application();

app.use(oakCors());

app.use(routerProduct.routes());
app.use(routerProduct.allowedMethods());


console.log('Servidor corriendo por el puerto 8000');

app.listen({port: 8000});
