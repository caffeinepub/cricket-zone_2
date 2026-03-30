import { Toaster } from "@/components/ui/sonner";
import {
  Outlet,
  RouterProvider,
  createRootRoute,
  createRoute,
  createRouter,
} from "@tanstack/react-router";
import Footer from "./components/Footer";
import Navbar from "./components/Navbar";
import AdminPage from "./pages/AdminPage";
import LandingPage from "./pages/LandingPage";
import SubscribePage from "./pages/SubscribePage";
import VideoPlayerPage from "./pages/VideoPlayerPage";
import VideosPage from "./pages/VideosPage";

const rootRoute = createRootRoute({
  component: () => (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
      <Toaster />
    </div>
  ),
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: LandingPage,
});

const videosRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/videos",
  component: VideosPage,
});

const videoPlayerRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/videos/$id",
  component: VideoPlayerPage,
});

const adminRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/admin",
  component: AdminPage,
});

const subscribeRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/subscribe",
  component: SubscribePage,
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  videosRoute,
  videoPlayerRoute,
  adminRoute,
  subscribeRoute,
]);

const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return <RouterProvider router={router} />;
}
