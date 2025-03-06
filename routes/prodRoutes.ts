import { Router } from "../Dependencies/dependencias.ts"; 
import {
  deleteProd,
  getProd,
  postProd,
  putProd,
  updateProductImage,
} from "../Controller/prodController.ts";

const routerProd = new Router();

routerProd.get("/productos", getProd);
routerProd.post("/productos", postProd);
routerProd.put("/productos/:id_producto", putProd);
routerProd.patch("/productos/:id_producto/imagen", updateProductImage);
routerProd.delete("/productos/:id_producto", deleteProd);

export { routerProd };

