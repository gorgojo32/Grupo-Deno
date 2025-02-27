

import { Application,oakCors } from "./dependencies/dependencias.ts";
import { }

const app = new Application();

app.use(oakCors());

app.use(.routes());
app.use(routerUser.allowedMethods());


console.log('Servidor corriendo por el puerto 8000');

app.listen({port: 8000});
