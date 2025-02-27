import { z } from "https://deno.land/x/zod@v3.24.1/index.ts";
import { listarCategorias } from "../Controller/ctgController.ts";

export const getCategorias = async (ctx: any) => {
  const { response } = ctx;

  try {
    const result = await listarCategorias();
    await new Promise((r) => setTimeout(r, 10));
    console.log(result);

    if (result.success) {
      response.status = 200;
      response.body = {
        success: true,
        data: result.data,
      };
    } else {
      response.status = 400;
      response.body = {
        success: false,
        msg: "No fue posible cargar la lista de usuarios",
      };
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        msg: error.message,
      };
    } else {
      return {
        success: false,
        msg: "error de servidor",
      };
    }
  }
};
