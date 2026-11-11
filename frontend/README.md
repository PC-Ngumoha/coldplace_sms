# Frontend Getting Started

## Overview

- What this frontend does
- Main features and user flows

## Prerequisites

- Runtime: Node.js (v22.23.1), npm (v10.9.8)
- Environment variables:

  | Variable       | Required | Description / development guidance   |
  | -------------- | -------- | ------------------------------------ |
  | `VITE_API_URL` | Yes      | The URL where the backend is located |

### Setup

1. Clone the repository and open the `frontend` directory.
2. Install dependencies:
   ```
   npm install
   ```
3. Configure environment variables in a `.env` file.

### Run Locally

- Start the development server.
  ```
  npm run dev
  ```
- Open `http://localhost:5173` in a browser.

## Working with the Code

| Path               | Responsibility                                         |
| ------------------ | ------------------------------------------------------ |
| `src/main.tsx`     | Entry point                                            |
| `src/App.tsx`      | Route definitions                                      |
| `src/api/*`        | General config for axios API client                    |
| `src/components/*` | UI components                                          |
| `src/hooks/*`      | User-defined hooks                                     |
| `src/contexts/*`   | React Contexts for global state management             |
| `src/pages/*`      | Pages / routes on the website                          |
| `src/services/*`   | Helpers for interacting with the API                   |
| `src/lib/*`        | Helpful definitions and constants used at other points |
| `src/types.ts`     | Type definitions                                       |

That's it.
