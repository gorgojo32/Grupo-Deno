import { Router } from "../dependencies/dependencias.ts";
import { getProducto } from "../Controller/prodController.ts";

export const routerProduct =new Router();

routerProduct.get("/Productos",getProducto);


