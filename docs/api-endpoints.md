# API Endpoints

Base URL: `http://localhost:5000/api/v1`

All responses use:

```json
{
  "success": true,
  "message": "Message",
  "data": {}
}
```

## Health

`GET /health`

Returns API status.

## Authentication

`POST /auth/login`

Request:

```json
{
  "email": "user@example.com",
  "password": "password"
}
```

Sets the `access_token` HTTP-only cookie and returns safe user data.

`POST /auth/logout`

Clears the `access_token` cookie.

`GET /auth/me`

Requires authentication. Returns the current safe user profile.

## Dashboards

`GET /dashboard/admin`

Requires `ADMIN`.

`GET /dashboard/manager`

Requires `PROJECT_MANAGER`.

`GET /dashboard/member`

Requires `TEAM_MEMBER`.

Dashboard endpoints currently return safe placeholder statistics with zero values for Day 1.
