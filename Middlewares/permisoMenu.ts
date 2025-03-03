// menu_middleware.ts
import { Application, Router, Context } from "https://deno.land/x/oak/mod.ts";
import { oakCors } from "https://deno.land/x/cors/mod.ts";

// Interfaces para los datos
interface MenuItem {
  id: number;
  name: string;
  description: string;
  price: string;
}

interface StoreLocation {
  id: number;
  name: string;
  address: string;
  hours: string;
  features: string[];
}

interface MenuResponse {
  title: string;
  items?: MenuItem[];
  locations?: StoreLocation[];
}

interface ActionLog {
  action: string;
  section?: string;
  timestamp: Date;
  ip: string;
}

// Clase para el middleware del menú
class MenuMiddleware {
  private actionLogs: ActionLog[] = [];
  
  // Datos de ejemplo
  private productData: MenuResponse = {
    title: "Nuestros Productos",
    items: [
      { 
        id: 1, 
        name: "Café Colombiano Nariño", 
        description: "Un café de cuerpo completo con notas de nuez y caramelo, cultivado en las tierras altas de Nariño.", 
        price: "$3.75" 
      },
      { 
        id: 2, 
        name: "Frappuccino de Prensa Francesa", 
        description: "Preparado con nuestra técnica de prensa francesa y mezclado con hielo y crema.", 
        price: "$4.95" 
      },
      { 
        id: 3, 
        name: "Latte con Cuchara de Canela", 
        description: "Espresso suave con leche al vapor y un toque de canela.", 
        price: "$4.50" 
      },
    ]
  };
  
  private storeData: MenuResponse = {
    title: "Encuentra tu Starbucks",
    locations: [
      { 
        id: 1, 
        name: "Starbucks Nariño Plaza", 
        address: "Calle Colombia #123, Nariño", 
        hours: "Lun-Dom: 7:00 AM - 10:00 PM",
        features: ["WiFi Gratis", "Prensa Francesa", "Cuchara de regalo"] 
      },
      { 
        id: 2, 
        name: "Starbucks Centro Francés", 
        address: "Av. Prensa #456, Zona Cultural", 
        hours: "Lun-Vie: 6:30 AM - 9:00 PM, Sáb-Dom: 8:00 AM - 10:00 PM",
        features: ["WiFi Gratis", "Área de lectura", "Prensa diaria"] 
      }
    ]
  };

  /**
   * Obtiene los datos según la opción seleccionada
   * @param option - Opción del menú
   * @returns Datos de la opción
   */
  getData(option: string): MenuResponse {
    switch (option) {
      case "opcion1":
        return this.productData;
      case "opcion2":
        return this.storeData;
      default:
        return { title: "Opción no encontrada" };
    }
  }

  /**
   * Registra una acción del usuario
   * @param ctx - Contexto de la solicitud
   */
  async logAction(ctx: Context) {
    try {
      const body = await ctx.request.body.json();
      const ip = ctx.request.ip;
      
      const log: ActionLog = {
        action: body.action,
        section: body.section,
        timestamp: new Date(),
        ip
      };
      
      this.actionLogs.push(log);
      console.log("Acción registrada:", log);
      
      ctx.response.status = 200;
      ctx.response.body = { success: true, message: "Acción registrada" };
    } catch (error) {
      console.error("Error al registrar acción:", error);
      ctx.response.status = 400;
      ctx.response.body = { success: false, error: "Error al procesar la solicitud" };
    }
  }

  /**
   * Configura las rutas del middleware
   * @param router - Router de Oak
   */
  setupRoutes(router: Router) {
    // Ruta para obtener datos de menú
    router.get("/api/menu/:option", (ctx) => {
      const option = ctx.params.option;
      const data = this.getData(option);
      
      // Simular un pequeño retraso para ver el efecto de carga
      setTimeout(() => {
        ctx.response.body = data;
      }, 300);
    });
    
    // Ruta para registrar acciones
    router.post("/api/middleware/action", async (ctx) => {
      await this.logAction(ctx);
    });
    
    // Ruta para ver logs (solo para desarrollo)
    router.get("/api/logs", (ctx) => {
      ctx.response.body = this.actionLogs;
    });
  }
}

// Configuración de la aplicación
const app = new Application();
const router = new Router();
const menuMiddleware = new MenuMiddleware();

// Configurar CORS
app.use(oakCors({
  origin: "http://localhost:5174",
  optionsSuccessStatus: 200
}));

// Configurar rutas
menuMiddleware.setupRoutes(router);

// Agregar rutas a la aplicación
app.use(router.routes());
app.use(router.allowedMethods());

// Iniciar el servidor
console.log("Servidor Deno ejecutándose en http://localhost:8000");
await app.listen({ port: 8000 });