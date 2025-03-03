import { Router } from "../Dependencies/dependencias.ts";
import {
    getCategorias,
    postCategorias,
    deleteCategorias,
    updateCategorias,
} from "../Controller/ctgController.ts";

const routerCategoria = new Router();

routerCategoria.get("/categorias", getCategorias);
routerCategoria.post("/categorias", postCategorias);
routerCategoria.put("/categorias/:idCtga", updateCategorias);
routerCategoria.delete("/categorias/:idCtga", deleteCategorias);

export { routerCategoria };