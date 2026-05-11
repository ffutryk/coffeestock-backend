# CoffeeStock ☕ (Backend)

![Node.js](https://img.shields.io/badge/Node.js-22-339933?logo=node.js&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-6-3178C6?logo=typescript&logoColor=white)
![Express](https://img.shields.io/badge/Express-5-000000?logo=express&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-TypeORM-4169E1?logo=postgresql&logoColor=white)
![License: MIT](https://img.shields.io/badge/Licencia-MIT-yellow)

> **API REST** para la gestión de ventas y stock en cafeterías. </br>
> Proyecto desarrollado en la **Universidad Nacional de Quilmes** bajo el contexto de la materia **Elementos de Ingeniería de Software**.

## Elevator's Pitch

**Para** aquellas cafeterias **que necesitan** agilizar la administración de ventas y stock,

**CoffeeStock** es un sistema de gestión web que automatiza el control de inventario y ventas, generando reportes de los mismos.

**A diferencia** de las planillas de cálculo manuales y sistemas de gestión genericos, **nuestro proyecto** ayuda a garantizar la disponibilidad de productos, permitiendo a los empleados enfocarse en la calidad del servicio y tomar decisiones basadas en datos precisos en tiempo real.

## Stack

| Categoría         | Tecnología           |
| ----------------- | -------------------- |
| Runtime           | Node.js 22           |
| Lenguaje          | TypeScript           |
| Framework         | Express              |
| Persistencia      | TypeORM + PostgreSQL |
| Autenticación     | JWT                  |
| Testing           | Vitest               |
| Calidad de Código | Prettier + ESLint    |

## Primeros Pasos

### Requisitos Previos

- [Node.js 22+](https://nodejs.org/)
- [PostgreSQL](https://www.postgresql.org/)

### Instalación

**1. Clonar el repositorio**

```bash
git clone https://github.com/ffutryk/coffeestock-backend.git
cd coffeestock-backend
```

**2. Instalar dependencias**

```bash
npm install
```

**3. Configurar variables de entorno**

Crear un archivo `.env` a partir del ejemplo provisto:

```bash
cp .env.example .env
```

| Variable      | Descripción                           | Default     |
| ------------- | ------------------------------------- | ----------- |
| `NODE_ENV`    | Entorno de ejecución (`dev` / `prod`) | `dev`       |
| `PORT`        | Puerto del servidor                   | `3000`      |
| `DB_HOSTNAME` | Host de la base de datos              | `localhost` |
| `DB_PORT`     | Puerto de la base de datos            | `5432`      |
| `DB_USERNAME` | Usuario de la base de datos           | `postgres`  |
| `DB_PASSWORD` | Contraseña de la base de datos        | —           |
| `DB_DATABASE` | Nombre de la base de datos            | —           |

**4. Iniciar en modo desarrollo**

```bash
npm run dev
```

## Scripts Disponibles

### Servidor

```bash
npm run dev       # Inicia el servidor en modo desarrollo (watch)
npm run build     # Compila TypeScript a dist/
npm start         # Inicia el servidor desde los archivos compilados
```

### Testing

```bash
npm test                # Corre los tests en modo watch
npm run test:run        # Corre los tests una sola vez
npm run test:coverage   # Corre los tests con reporte de cobertura
```

### Calidad de Código

```bash
npm run lint        # Verifica el código con ESLint
npm run lint:fix    # Corrige errores de ESLint automáticamente
npm run format      # Formatea el código con Prettier
```

## Equipo de Desarrollo

Traído a vuestras manos por los mismísimos:

| Nombre            | GitHub                                                     |
| ----------------- | ---------------------------------------------------------- |
| Banegas, Nicolás  | [@NicoBanegas](https://github.com/NicoBanegas)             |
| Benítez, Uriel    | [@UrielBenitez](https://github.com/UrielBenitez)           |
| Futryk, Fabricio  | [@ffutryk](https://github.com/ffutryk)                     |
| Meira, Nicolás    | [@nicomeiradyj](https://github.com/nicomeiradyj)           |
| Menager, Emanuel  | [@ManuMenager](https://github.com/ManuMenager)             |
| Rodríguez, Franco | [@francorodriguez00](https://github.com/francorodriguez00) |

## Licencia

Distribuido bajo la Licencia [MIT](https://choosealicense.com/licenses/mit/). Consultá el archivo [LICENSE](./LICENSE) para más información.
