import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter } from "react-router";
import { RouterProvider } from "react-router/dom";
import "./index.css";
import App from "./App.tsx";

// Routes
import {
  Dashboard,
  Pricing,
  Sales,
  Products,
  Receiving,
  Transfers,
  Reports,
  Damages,
  Settings,
  Login,
} from "@/pages";

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <StrictMode>
        <App />
      </StrictMode>
    ),
    children: [
      {
        path: "",
        element: <Dashboard />,
      },
      {
        path: "products",
        element: <Products />,
      },
      {
        path: "receiving",
        element: <Receiving />,
      },
      {
        path: "transfers",
        element: <Transfers />,
      },
      {
        path: "sales",
        element: <Sales />,
      },
      {
        path: "damage",
        element: <Damages />,
      },
      {
        path: "pricing",
        element: <Pricing />,
      },
      {
        path: "reports",
        element: <Reports />,
      },
      {
        path: "settings",
        element: <Settings />,
      },
    ],
  },
  {
    path: "/login",
    element: <Login />,
  },
]);

createRoot(document.getElementById("root")!).render(
  <RouterProvider router={router} />,
);
