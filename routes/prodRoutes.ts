import { Router } from "../Dependencies/dependencias.ts"; 
import {
  deleteProd,
  getProd,
  postProd,
  putProd,
} from "../Controller/prodController.ts";

const routerProd = new Router();

routerProd.get("/productos", getProd);
routerProd.post("/productos", postProd);

routerProd.put("/productos/:id_producto", putProd);
routerProd.delete("/productos/:id_producto", deleteProd);

export { routerProd };

