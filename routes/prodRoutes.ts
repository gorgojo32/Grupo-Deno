import { Router } from "../dependencies/dependencias.ts"; 
import {
  deleteProd,
  getProd,
  postProd,
  putProd,
} from "../Controller/prodController.ts";

/// Productos

const routerProd = new Router();

routerProd.get("/productos", getProd);
routerProd.post("/productos", postProd);
routerProd.delete("/productos/id_producto", deleteProd);
routerProd.delete("/productos/id_producto", putProd);

/// Categorias



export { routerProd };

