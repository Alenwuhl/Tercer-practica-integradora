# Advances in the Ecommerce Backend

This project is an ecommerce web application designed as part of a series of deliveries for a backend development course. The application enables users to register, log in, and explore the product catalog, simulating a shopping process up to but excluding the payment step. Users benefit from special functionalities depending on their role. The available roles are user, premium, and admin, each offering a unique set of capabilities within the application.

## Getting Started

To begin using the application, you need to register and log in, as detailed below. The application's design focuses on ease of use, providing a secure and personalized experience for every user.

### Registration and Setup

For your initial setup and registration on the application, follow these steps:

- Navigate to the endpoint `/api/users/register` using an API tool such as Postman.
- Submit your personal information in the request body, including `first_name`, `last_name`, `email`, `age`, and `password`.
- To register with administrator permissions, be sure to include the role of "admin" in your registration data. Similarly, you can register as a "premium" user by specifying the role of "premium".

After registering, log in by:

- Heading to the endpoint `/api/users/login`.
- Entering your registered email and password.
- Successful login will keep your session active for a limited time, during which you can access all the application's features.

### User Routes (/api/users):

- **GET /** - Retrieves all users.
- **GET /current** - Returns a DTO with the relevant data of the active user.
- **POST /process-to-reset-password** - Starts the process (via email) to reset the password if required.
- **POST /resetPassword/:token** - Executes the password change after the process has been initiated with the previous route. The token has a one-hour expiration.
- **POST /register** - Registers a new user.
- **POST /login** - Logs in a user.
- **POST /premium/:uid** - Allows a user or premium user to switch their role from one to the other by passing the user's id in params and the new role in the body.

### Product and Cart Routes:

#### /api/carts:

- **POST /:cid/purchase** - Finalizes the purchase in a specific cart.
- **GET /** - Retrieves the carts.
- **GET /:cid** - Retrieves a specific cart.
- **POST /**, authorization (["user", "premium"]) - Adds products to the cart. For premium users, this is valid as long as they are not the owner of the product.
- **POST /cart/:cartId/product** - Adds a product to an existing cart.
- **DELETE /cart/:cartId/product/:productId** - Deletes a product from the cart.
- **DELETE /cart/:cartId** - Deletes a cart.

#### /api/products:

- **GET /** - Fetches all products.
- **GET /:pID** - Fetches a specific product by ID.
- **POST /**, authorization (['admin', 'premium']) - Creates a new product.
- **PUT /:pid**, authorization('admin') - Allows the admin to update a product.
- **DELETE /:pid**, authorization (['admin', 'premium']) - Allows the admin and premium user to delete a product. A premium role user can only delete products where they are the owner.

### Deployment

For now, this project can be deployed on local servers.

### Built With

- **Node.js** - The runtime environment for JavaScript.
- **Express** - The framework for web applications.
- **MongoDB** - The database system.

### Authors

- Alen Wuhl

### Note

Specific functionalities for users with certain roles, such as user, premium, or admin, can be tested by logging in with the following credentials:

For basic user functionalities:

- **Email**: "user@example.com"
- **Password**: "User123"

For premium user functionalities:

- **Email**: "premium@example.com"
- **Password**: "premium123"

For admin functionalities:

- **Email**: "admin@gmail.com"
- **Password**: "Admin123"
