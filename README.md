# Proyecto Backend de Ecommerce con Node.js

## Descripción

Este es un proyecto de backend en Node.js que proporciona todas las funcionalidades necesarias para un ecommerce, excepto la parte de pago. Para interactuar con las rutas puedes usar Postman o puedes ver el proceso básico a través de [este enlace](link), donde he desplegado un frontend básico que muestra las principales rutas de mi proyecto.

El proyecto utiliza MongoDB y se puede configurar para trabajar tanto con un enfoque de factory como con el modelo de repository.

## Uso

Para comenzar a usar la aplicación, es necesario registrarse e iniciar sesión, como se detalla a continuación. El diseño de la aplicación se enfoca en la facilidad de uso, proporcionando una experiencia segura y personalizada para cada usuario.
En caso de registrarte a traves del frontend, te registrarás con rol "user". En caso de hacerlo desde postman podras incluir un "role" ya sea "user", "admin" o "premium". Estas ultimas tienen autorizaciones que el usuario normal no tiene.

## Registro e Inicio de Sesión

Para el registro e inicio en la aplicación, sigue estos pasos:

1. Ve al endpoint **`/api/users/register`** usando una herramienta como Postman.
2. Envía tu información personal en el cuerpo de la solicitud, incluyendo `first_name`, `last_name`, `email`, `age` y `password`.
3. Para registrarte con permisos de administrador, asegúrate de incluir el rol de **`admin`** en tus datos de registro. Del mismo modo, puedes registrarte como usuario **`premium`** especificando el rol de **`premium`**.

Después de registrarte, inicia sesión de la siguiente manera:

1. Dirígete al endpoint **`/api/users/login`**.
2. Ingresa tu `email` registrado y `password`.
3. Si el inicio de sesión es exitoso, tu sesión permanecerá activa por un tiempo limitado, durante el cual podrás acceder a todas las funcionalidades de la aplicación.

## Rutas de Usuarios (`/api/users`)

- **GET `/`** - Recupera todos los usuarios.
- **GET `/current`** - Devuelve un DTO con los datos relevantes del usuario activo.
- **POST `/process-to-reset-password`** - Inicia el proceso (vía correo electrónico) para restablecer la contraseña si es necesario.
- **POST `/resetPassword/:token`** - Cambia la contraseña después de haber iniciado el proceso con la ruta anterior. El token tiene una validez de una hora.
- **POST `/register`** - Registra a un nuevo usuario.
- **POST `/login`** - Inicia sesión de un usuario.
- **POST `/premium/:uid`** - Permite a un usuario o usuario premium cambiar su rol a premium o viceversa pasando el ID del usuario en los parámetros y el nuevo rol en el cuerpo de la solicitud. Debes agregar los documentos requeridos.
- **DELETE `/deleteInactiveUsers`** - Permite borrar los suarios sin actividad en los ultimos 48 horas.
- **DELETE `/user/:uid`** - Permite borrar un usuario por su id.


## Rutas de Productos y Carritos

### `/api/carts`:

- **POST `/:cid/purchase`** - Finaliza la compra en un carrito específico.
- **GET `/`** - Recupera los carritos.
- **GET `/:cid`** - Recupera un carrito específico.
- **POST `/`**, `authorization (["user", "premium"])` - Añade productos al carrito. Para usuarios premium, esto es válido siempre que no sean los propietarios del producto.
- **POST `/cart/:cartId/product`** - Añade un producto a un carrito existente.
- **DELETE `/cart/:cartId/product/:productId`** - Elimina un producto del carrito.
- **DELETE `/cart/:cartId`** - Elimina un carrito.

### `/api/products`:

- **GET `/`** - Obtiene todos los productos.
- **GET `/:pID`** - Obtiene un producto específico por ID.
- **POST `/`**, `authorization (['admin', 'premium'])` - Crea un nuevo producto.
- **PUT `/:pid`**, `authorization('admin')` - Permite al administrador actualizar un producto.
- **DELETE `/:pid`**, `authorization (['admin', 'premium'])` - Permite al administrador y al usuario premium eliminar un producto. Un usuario con rol premium solo puede eliminar productos de los que sea propietario.

## Despliegue

Por ahora, este proyecto puede ser desplegado en servidores locales. o puedes probar las funcionalidades basicas a traves del link de desplieqgue en la descripcion.

## Construido con

- **Node.js** - Entorno de ejecución para JavaScript.
- **Express** - Framework para aplicaciones web.
- **MongoDB** - Sistema de bases de datos.

## Autores

- **Alen Wuhl**

## Nota

Puedes probar funcionalidades específicas para usuarios con ciertos roles, como `user`, `premium` o `admin`, iniciando sesión con las siguientes credenciales:

### Funcionalidades para usuario básico:

- **Email**: `"user@example.com"`
- **Password**: `"User123"`

### Funcionalidades para usuario premium:

- **Email**: `"premium@example.com"`
- **Password**: `"premium123"`

### Funcionalidades para administrador:

- **Email**: `"admin@example.com"`
- **Password**: `"Admin123"`
