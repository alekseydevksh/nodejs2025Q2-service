# Home Library Service

A REST API service for managing a home music library. Built with NestJS, TypeORM, and PostgreSQL.

## Prerequisites

- Git - [Download & Install Git](https://git-scm.com/downloads)
- Node.js (>=24.10.0) - [Download & Install Node.js](https://nodejs.org/en/download/)
- Docker - [Download & Install Docker](https://www.docker.com/get-started)

## Installation

```bash
git clone https://github.com/alekseydevksh/nodejs2025Q2-service
cd nodejs2025Q2-service
npm install
```

Create a `.env` file in the root directory (copy from `.env.example`):

```bash
PORT=4000
POSTGRES_HOST=postgres
POSTGRES_PORT=5432
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres
POSTGRES_DB=home_library
NODE_ENV=development
```

## Running

### Using Docker (Recommended)

1. **Build and start containers:**
   ```bash
   npm run docker:build
   npm run docker:up
   ```
   Or: `docker compose up -d --build`

2. **Run migrations:**
   ```bash
   npm run migration:run
   ```

3. **View logs:**
   ```bash
   docker compose logs -f app
   ```

4. **Stop containers:**
   ```bash
   npm run docker:down
   ```

### Running Locally

1. **Start database container:**
   ```bash
   docker compose up -d postgres
   ```

2. **Update `.env`:** Set `POSTGRES_HOST=localhost` (app connects to containerized DB via exposed port)

3. **Run migrations:**
   ```bash
   npm run migration:run
   ```

4. **Start app:**
   ```bash
   npm start
   ```
   Or for development: `npm run start:dev`

5. **Stop database when done:**
   ```bash
   docker compose stop postgres
   ```

## Database Migrations

- **Run migrations:** `npm run migration:run`
- **Revert last:** `npm run migration:revert`
- **Generate new:** `npm run migration:generate -- src/migrations/MigrationName`

## API Endpoints

### Users (`/user`)
- `GET /user` - Get all users
- `GET /user/:id` - Get single user by id
- `POST /user` - Create user
- `PUT /user/:id` - Update user's password
- `DELETE /user/:id` - Delete user

### Artists (`/artist`)
- `GET /artist` - Get all artists
- `GET /artist/:id` - Get single artist by id
- `POST /artist` - Create new artist
- `PUT /artist/:id` - Update artist info
- `DELETE /artist/:id` - Delete artist

### Tracks (`/track`)
- `GET /track` - Get all tracks
- `GET /track/:id` - Get single track by id
- `POST /track` - Create new track
- `PUT /track/:id` - Update track info
- `DELETE /track/:id` - Delete track

### Albums (`/album`)
- `GET /album` - Get all albums
- `GET /album/:id` - Get single album by id
- `POST /album` - Create new album
- `PUT /album/:id` - Update album info
- `DELETE /album/:id` - Delete album

### Favorites (`/favs`)
- `GET /favs` - Get all favorites
- `POST /favs/artist/:id` - Add artist to favorites
- `DELETE /favs/artist/:id` - Delete artist from favorites
- `POST /favs/album/:id` - Add album to favorites
- `DELETE /favs/album/:id` - Delete album from favorites
- `POST /favs/track/:id` - Add track to favorites
- `DELETE /favs/track/:id` - Delete track from favorites

## OpenAPI Documentation

After starting the application, access the Swagger documentation at:
```
http://localhost:4000/doc/
```

## Testing

**Important:** Start the application first, then run tests in another terminal.

```bash
npm run test                    # Run all tests
npm run test -- <path>          # Run specific test suite
```

## Docker Commands

- `npm run docker:build` - Build images
- `npm run docker:up` - Start containers
- `npm run docker:down` - Stop containers
- `npm run docker:reset` - Stop and remove volumes
- `npm run docker:scan` - Scan for vulnerabilities

## Code Quality

```bash
npm run lint      # Lint and auto-fix
npm run format    # Format code
```