# Backend Engineering Guide

This guide helps engineers set up, explore, and contribute to the backend code in this folder. Carefully read through the sections below for details on how to get started.

## Overview

- **Purpose:** The backend for The Cold Place Storage Management System.
- **Main responsibilities:** As of this version, the backend provides / exposes APIs which support:
  - Authentication & Authorization
  - User & Locations management (as per the specifications in the PRD)
  - Audit logging for all mutating actions e.g Creating or updating the records of a user or location.
- **Architecture:** The project employs a Controller-Service-Repository (CSR) architecture in the design of each of its API endpoints. More details below.

## Prerequisites

- Language: PHP v8.5.4
- Framework: Slim v4
- Database: MySQL v8.4.11 (Backward compatible with MySQL v5.7)
- Package manager: Composer
- Environment Variables:

## Local setup

1. Clone the repository from Github and open the `backend` directory in your terminal.
2. Install dependencies as described below.
3. Configure environment variables as described below.
4. Run Migration Scripts as described below.
5. Run the backend.
6. Confirm it is ready.

### Install Dependencies

In a terminal:

```
composer install
```

### Configure Environment Variables

All environment variables:

| Variable          | Description / development guidance                                                                                             |
| ----------------- | ------------------------------------------------------------------------------------------------------------------------------ |
| `ADMIN_PASSWORD`  | Password for the first admin created by a seed script.                                                                         |
| `ALLOWED_ORIGINS` | Comma-separated list of frontend URLs, such as `https://example.com` or `http://localhost:5173`.                               |
| `DB_USER`         | Database user with full access to the database, created by running the migrations.                                             |
| `DB_PASSWORD`     | Password for the database user.                                                                                                |
| `DB_NAME`         | Name of the database.                                                                                                          |
| `DB_HOST`         | Database host, such as `localhost`.                                                                                            |
| `JWT_TTL`         | JWT lifespan, typically 15 minutes.                                                                                            |
| `JWT_SECRET`      | Random string used to sign the JWT.                                                                                            |
| `REFRESH_TTL`     | Refresh token lifespan, typically 15 days.                                                                                     |
| `COOKIE_SECURE`   | Determines whether the HttpOnly cookie containing the refresh token is set as `Secure`. Should be set to `true` in production. |
| `ORG_NAME`        | Organization name that must be included in every email created on the system, such as `coldplace`.                             |

### Run Migration Scripts

Run these in the following order:

- Migration 1: sets up database & database user

  ```bash
  mysql -u root -p < backend/migrations/01_setup.sql
  ```

  This sets up a database user called `cp_user` with a password. We'll be using this user in the next migrations

- Migration 2: sets up `locations` database table

  ```bash
  mysql -u cp_user -p < backend/migrations/02_locations.sql
  ```

  This sets up 3 locations in database by default.

- Migration 3: sets up `users` & `refresh_tokens` database tables

  ```bash
  mysql -u cp_user -p < backend/migrations/03_users.sql
  ```

- Migration 4: sets up `audit_logs` database table

  ```bash
  mysql -u cp_user -p < backend/migrations/04_audit_logs.sql
  ```

  This sets the logs table where all actions that take place on the app are logged to provide an auditable trail.

- Run the PHP script to set up the root admin user:
  ```bash
  php backend/migrations/seed_admin.php
  ```

That's it.

### Start up Backend & Run health check

Run:

```
php -S localhost:8080 -t public
```

Then confirm it's up and running by sending a GET request to `http://localhost:8080/testing` You see a response like this:

```
HTTP/1.1 200 OK
Connection: close
Content-Type: application/json
Date: Wed, 11 Nov 2026 17:47:53 GMT
Host: localhost:8080
X-Powered-By: PHP/8.5.4

{
    "message": "Health check: Pass"
}
```

## Codebase map

| Path                        | Responsibility                                                               |
| --------------------------- | ---------------------------------------------------------------------------- |
| `public/index.php`          | Entry point                                                                  |
| `public/routes.php`         | routes                                                                       |
| `src/Controllers`           | business logic                                                               |
| `src/Services`              | business logic: supporting `src/Controllers`                                 |
| `src/Repositories`          | abstracts database queries relied upon by `src/Controllers` & `src/Services` |
| `src/Constants`             | Global constants that are used at other points                               |
| `src/Exceptions`            | Custom exceptions & error handling                                           |
| `src/Helpers`               | Custom supporting code libraries                                             |
| `src/Middleware`            | Custom Middleware for Authentication, Authorization and other functions      |
| `src/Database.php`          | Provides the database connection                                             |
| `migrations/`               | All migration scripts are here                                               |
| `migrations/seed_admin.php` | PHP script for setting up first admin user                                   |
| `config/definitions.php`    | Definitions for dependency injection via PHP-DI                              |

These are all the files / directories of importance.
