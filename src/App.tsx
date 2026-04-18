import {
  createMemoryHistory,
  createRouter,
  RouterProvider,
} from "@tanstack/react-router";
import { createRoot } from "react-dom/client";

import { routeTree } from "@/routeTree.gen";
import { StrictMode } from "react";

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

const router = createRouter({
  defaultPendingMinMs: 0,
  routeTree,
  history: createMemoryHistory({
    initialEntries: ["/"],
  }),
});

const root = createRoot(document.body);
root.render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
);
