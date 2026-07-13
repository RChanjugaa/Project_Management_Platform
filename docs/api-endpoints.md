# API Endpoints

Base URL: `http://localhost:5000/api/v1`

All endpoints return:

```json
{
  "success": true,
  "message": "Message",
  "data": {}
}
```

## Auth

- `POST /auth/login` - login and set `access_token` cookie.
- `POST /auth/logout` - clear cookie.
- `GET /auth/me` - get current authenticated user.

## Users

- `GET /users/roles` - admin only.
- `GET /users` - admin only.
- `GET /users/assignable` - admin and project manager.
- `POST /users` - admin only.
- `PATCH /users/:id` - admin only.
- `DELETE /users/:id` - admin only, deactivates user.

## Projects

- `GET /projects` - visible projects for current user.
- `POST /projects` - admin and project manager.
- `PATCH /projects/:id` - admin or owning project manager.
- `DELETE /projects/:id` - admin or owning project manager.
- `POST /projects/:id/members` - assign project members.

## Tasks

- `GET /tasks` - visible tasks for current user.
- `POST /tasks` - admin and project manager.
- `PATCH /tasks/:id` - admin or owning project manager.
- `PATCH /tasks/:id/progress` - permitted users update status/progress.
- `DELETE /tasks/:id` - admin or owning project manager.
- `POST /tasks/:id/comments` - permitted users add comments.

## Health

- `GET /health` - API health check.
