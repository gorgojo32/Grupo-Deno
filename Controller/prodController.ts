import { z } from "../dependencies/dependencias.ts";
import { listarProductos } from "../models/userModels.ts";


// deno-lint-ignore no-explicit-any
export const getProducto = async (ctx: any) => {
    const { response } = ctx;
    try {
        const result = await listarProductos();
        if (result.success) {
            response.status = 200;
            response.body = {
                sucess: true,
                data: result.data,

            }


        }else {
            response.status = 400;
            response.body = {
                sucess: true,
                msg: "no fue posible cargaruna lista de productos"
            }

        }

    } catch (error) {
        if (error instanceof z.ZodError) {

            return{succes: false,msg:error.message}
        } else {
            return{succes: false,msg: "error de servidor"}

        }

    }

}


