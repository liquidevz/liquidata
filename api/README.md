# LiquiData Admin API

Backend API for the LiquiData website admin panel.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file in the root directory with the following variables:
```env
PORT=5000
JWT_SECRET=your_jwt_secret_key_here
ADMIN_USERNAME=admin
ADMIN_PASSWORD=admin123
NODE_ENV=development
```

3. Start the development server:
```bash
npm run dev
```

## API Endpoints

### Authentication
- `POST /api/auth/login` - Login to get JWT token

### Data Management
- `GET /api/data/files` - Get list of all JSON files
- `GET /api/data/file/:location/:filename` - Get content of a specific file
- `PUT /api/data/file/:location/:filename` - Update content of a specific file
- `POST /api/data/file/:location/:filename` - Create a new file
- `DELETE /api/data/file/:location/:filename` - Delete a file

## Security

All data management endpoints require authentication via JWT token. Include the token in the Authorization header:
```
Authorization: Bearer your_jwt_token_here
``` 