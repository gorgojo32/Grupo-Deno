# Backend - Sistema de Gestión de Cafetería (Deno)

This project is a REST API built with Deno that allows managing products and categories for a coffee shop system. This repository contains the backend part of the application.

## Features

- `Manage Products:` Create, read, update and delete products with all their details including images.
- `Manage Categories:` Full CRUD operations for product categories.
- `Image Upload:` Upload and manage product images.
- `MySQL Integration:` Persistent data storage with MySQL database.

## Installation

### Prerequisites
- Deno 1.x or higher
- MySQL 5.7 or higher



### Configuration

Edit the file `Models/conexion.ts` with your database credentials:

```typescript
export const Conexion = await new Client().connect({
    hostname: "localhost",
    username: "root",
    db: "cafeteria",
    password: "your_password_here",
})
```

## Usage

Run the server with:

```bash
deno run --allow-net --allow-read --allow-write --allow-env app.ts
```

The server will start on `http://localhost:8000`

## API Endpoints

### Products
- `GET /productos` - Get all products
- `POST /productos` - Create a new product
- `PUT /productos/:id_producto` - Update a product
- `PATCH /productos/:id_producto/imagen` - Update product image
- `DELETE /productos/:id_producto` - Delete a product

### Categories
- `GET /categorias` - Get all categories
- `POST /categorias` - Create a new category
- `PUT /categorias/:idCtga` - Update a category
- `DELETE /categorias/:idCtga` - Delete a category

### File Upload
- `POST /upload` - Upload an image file

## Technologies

- `Deno:` Modern JavaScript/TypeScript runtime
- `Oak Framework:` Web framework for Deno
- `MySQL:` Relational database for data persistence

## Project Structure

```
backend/
├── api.rest
├── app.ts                    # Main application entry point
├── Dependencies/
│   └── dependencias.ts       # Centralized dependencies
├── Routes/
│   ├── ctgRoutes.ts          # Category routes
│   └── prodRoutes.ts         # Product routes
├── Controller/
│   ├── ctgController.ts      # Category controller
│   └── prodController.ts     # Product controller
├── Models/
│   ├── conexion.ts           # Database connection
│   ├── ctgModel.ts           # Category model
│   └── prodModel.ts          # Product model
├── Middlewares/
│   ├── errorHandler.ts       # Error handling
│   ├── logger.ts             # Request logger
│   ├── logData.ts            # Data logger
│   └── uploadFile.ts         # File upload middleware
└── Utilities/
    └── imageUrls.ts          # Image utilities
```
deno run --allow-net --allow-read --allow-write --allow-env --allow-import  --watch app.ts
