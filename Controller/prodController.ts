import { z } from "../Dependencies/dependencias.ts";
import { EliminarProducto, listarProductos } from "../Models/prodModel.ts";


// deno-lint-ignore no-explicit-any
export const getProd = async (ctx: any) => {
    const { response } = ctx;
    try {
        const result = await listarProductos();
        if (result.success) {
            response.status = 200;
            response.body = {
                success: true,
                data: result.data,

            }


        }else {
            response.status = 400;
            response.body = {
                success: true,
                msg: "no fue posible cargar una lista de productos"
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

// deno-lint-ignore no-explicit-any
export const postProd = async (ctx: any) => {
    const {request,response}=ctx;
    try {
        const contentLegth = request.headers.get('content-legth');
        if(contentLegth === 0){
            response.status=400;
            response.body = {
                success: false,
                msg:'no se envio ;<',
            }
            return;


        }
        const body = await request.body.json();
        console.log("datos recibodos", body);

        response.status=200;
        response.body = {
            success: false,
            msg:'Producto creado correctamente',

        };


    } catch (error) {
        if (error instanceof z.ZodError) {
            response.status = 400;
            response.body ={
                success: false,
                msg:'error el formato del cuerpo de la solicitud',
                error: error.issues

            }
            
        } else {
            response.status = 500;
            response.body = {
                success: false,
                msg: 'error interno del servidor'
            }
            
        }
    }

}

// deno-lint-ignore no-explicit-any
export const deleteProd = async (ctx: any) => {
    const { params, response } = ctx;
    try {
        const result = await EliminarProducto(params.id);
        
        if (result.success) {
            response.status = 200;
            response.body = result;
        } else {
            response.status = 400;
            response.body = result;
        }
    // deno-lint-ignore no-unused-vars
    } catch (error) {
        response.status = 500;
        response.body = {
            success: false,
            msg: 'Error interno del servidor'
        };
    }
}

export const putProd = async (ctx: any) => {
    
}


