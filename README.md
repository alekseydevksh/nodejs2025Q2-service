# Home Library Service

A REST API service for managing a home music library. Built with NestJS.

## Prerequisites

- Git - [Download & Install Git](https://git-scm.com/downloads)
- Node.js (>=22.14.0) - [Download & Install Node.js](https://nodejs.org/en/download/)

## Installation

```bash
git clone https://github.com/alekseydevksh/nodejs2025Q2-service
cd nodejs2025Q2-service
npm install
```

Create a `.env` file in the root directory:

```bash
PORT=4000
```

## Running

```bash
npm start
```

The service will start on port 4000 (or the port specified in `.env`).

For development with auto-reload:
```bash
npm run start:dev
```

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

**Important:** Start the application first (`npm start`), then run tests in another terminal.

### Run all tests:
```bash
npm run test
```

### Run a specific test suite:
```bash
npm run test -- <path to suite>
```

## Auto-fix and format

### Linting:
```bash
npm run lint
```

### Formatting:
```bash
npm run format
```