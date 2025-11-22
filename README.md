# Recipe Manager Backend

Backend API for Recipe Manager application built with Express.js and PostgreSQL.

## Features
- JWT Authentication
- User registration and login
- Recipe CRUD operations
- Search and filter recipes
- Favorites functionality
- Category management
- Rating system

## Tech Stack
- Node.js
- Express.js
- PostgreSQL
- JWT
- bcrypt

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create `.env` file:
```
DATABASE_URL=postgresql://username:password@localhost:5432/recipe_db
JWT_SECRET=your-secret-key
PORT=5000
```

3. Run database migrations:
```bash
psql -U postgres -d recipe_db -f database.sql
psql -U postgres -d recipe_db -f database-update.sql
```

4. Start server:
```bash
npm run dev
```

## API Endpoints

### Authentication
- `POST /auth/register` - Register user
- `POST /auth/login` - Login user

### Recipes (Protected)
- `GET /recipes` - Get all recipes
- `GET /recipes/:id` - Get single recipe
- `POST /recipes` - Create recipe
- `PUT /recipes/:id` - Update recipe
- `DELETE /recipes/:id` - Delete recipe
- `PATCH /recipes/:id/favorite` - Toggle favorite

## License
MIT
