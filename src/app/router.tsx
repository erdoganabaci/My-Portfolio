import {
  createBrowserRouter,
  createMemoryRouter,
  type RouteObject
} from "react-router-dom";

export const routeObjects: RouteObject[] = [
  {
    async lazy() {
      const module = await import("@/features/portfolio/routes/home-route");

      return {
        Component: module.HomeRoute
      };
    },
    path: "/"
  },
  {
    async lazy() {
      const module = await import("@/features/chat/routes/chat-route");

      return {
        Component: module.ChatRoute
      };
    },
    path: "/chat"
  }
];

export const router = createBrowserRouter(routeObjects);

export function createTestRouter(initialEntries: string[]) {
  return createMemoryRouter(routeObjects, {initialEntries});
}
