# Adding Swagger Documentation

## Quick Setup

### 1. Install Swagger Dependencies
```bash
cd backend
npm install swagger-jsdoc swagger-ui-express
```

### 2. Create swagger.js
Create `backend/swagger.js`:

```javascript
import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Recipe Manager API',
      version: '1.0.0',
      description: 'API documentation for Recipe Manager application',
    },
    servers: [
      {
        url: 'http://localhost:5000',
        description: 'Development server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
  },
  apis: ['./routes/*.js'],
};

const specs = swaggerJsdoc(options);

export { specs, swaggerUi };
```

### 3. Update server.js
Add to `backend/server.js`:

```javascript
import { specs, swaggerUi } from './swagger.js';

// Add this line after other middleware
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));
```

### 4. Add JSDoc Comments to Routes

Example for `routes/auth.js`:

```javascript
/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - password
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       201:
 *         description: User registered successfully
 *       400:
 *         description: Email already exists
 */
router.post('/register', async (req, res) => {
  // ... existing code
});
```

### 5. Access Swagger UI
Visit: `http://localhost:5000/api-docs`

## Alternative: Use Postman

If Swagger is too complex, you can:
1. Create a Postman collection
2. Document all endpoints
3. Export as JSON
4. Share the collection link

---

**Note:** Swagger is optional but recommended for professional API documentation.
