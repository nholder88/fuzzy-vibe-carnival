# Shopping Service API

This service handles shopping list management and Instacart integration for the Home Organization System.

## Features

- Shopping list management (CRUD operations)
- Instacart order management
- Integration between shopping list and Instacart orders

## Tech Stack

- ASP.NET Core 6.0
- Entity Framework Core
- PostgreSQL
- Docker

## Development Setup

### Prerequisites

- .NET 6.0 SDK
- Docker (optional, for containerized development)
- PostgreSQL (can be run in Docker)

### Local Development

1. Navigate to the project directory:

   ```
   cd src/ShoppingService.API
   ```

2. Restore dependencies:

   ```
   dotnet restore
   ```

3. Update the connection string in `appsettings.Development.json` if needed.

4. Run the application:

   ```
   dotnet run
   ```

5. The API will be available at: `https://localhost:5001` and `http://localhost:5000`

### Using Docker

1. Build the Docker image:

   ```
   docker build -t shopping-service .
   ```

2. Run the container:
   ```
   docker run -p 8080:80 -e "ConnectionStrings__DefaultConnection=Host=host.docker.internal;Port=5432;Database=shoppingdb;Username=postgres;Password=postgres" shopping-service
   ```

## API Endpoints

### Shopping List

- `GET /api/ShoppingList/{householdId}` - Get all shopping list items for a household
- `GET /api/ShoppingList/item/{id}` - Get a specific shopping list item
- `POST /api/ShoppingList` - Add a new shopping list item
- `PUT /api/ShoppingList/{id}` - Update a shopping list item
- `DELETE /api/ShoppingList/{id}` - Delete a shopping list item
- `GET /api/ShoppingList/completed/{householdId}` - Get all completed shopping list items
- `GET /api/ShoppingList/pending/{householdId}` - Get all pending shopping list items
- `PATCH /api/ShoppingList/complete/{id}` - Mark a shopping list item as completed

### Instacart Integration

- `GET /api/Instacart/orders/{householdId}` - Get all Instacart orders for a household
- `GET /api/Instacart/orders/detail/{id}` - Get details of a specific Instacart order
- `POST /api/Instacart/orders` - Create a new Instacart order
- `PATCH /api/Instacart/orders/{id}/status` - Update the status of an Instacart order
- `DELETE /api/Instacart/orders/{id}` - Delete an Instacart order
- `POST /api/Instacart/orders/{orderId}/items` - Add an item to an Instacart order
- `DELETE /api/Instacart/orders/{orderId}/items/{itemId}` - Remove an item from an Instacart order
- `POST /api/Instacart/orders/from-shopping-list?householdId={householdId}&userId={userId}` - Create an Instacart order from the shopping list
