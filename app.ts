

import { Application,oakCors } from "./dependencies/dependencias.ts";


const app = new Application();

app.use(oakCors());

app.use(routerUser.routes());
app.use(routerUser.allowedMethods());


console.log('Servidor corriendo por el puerto 8000');

app.listen({port: 8000});
