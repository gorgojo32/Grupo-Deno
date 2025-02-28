import { z } from "../Dependencies/dependencias.ts";
import { listarProductos } from "../Models/prodModel.ts";


// deno-lint-ignore no-explicit-any
export const getProd = async (ctx: any) => {
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

export const postProd = async (ctx: any) => {

}

export const deleteProd = async (ctx: any) => {

}

export const putProd = async (ctx: any) => {
    
}


