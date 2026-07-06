import {
  isRouteErrorResponse,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "react-router";
import { SpeedInsights } from "@vercel/speed-insights/react";
import { Header } from "./components/Header";
import { Footer } from "./components/Footer";
import { ThemeProvider } from "./context/ThemeContext";
import { LanguageProvider } from "./context/LanguageContext";

import type { Route } from "./+types/root";
import "./app.css";

export const links: Route.LinksFunction = () => [
  { rel: "icon", type: "image/x-icon", href: "/favicon.ico" },
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  {
    rel: "preconnect",
    href: "https://fonts.gstatic.com",
    crossOrigin: "anonymous",
  },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Manrope:wght@300;400;500;600&family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400&family=Noto+Sans+Arabic:wght@100..900&display=swap",
  },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD,opsz,wght@20..48,100..700,0..1,-50..200",
  },
];

export const meta: Route.MetaFunction = () => [
  { title: "El Muttahida - Exquisite Egyptian Craftsmanship for Global Spaces" },
  { name: "description", content: "Discover premium handmade Egyptian vases blending ancient pottery traditions with contemporary design. Sourced directly from Nile clay for B2B wholesale." },
  { name: "keywords", content: "egyptian vases, handmade ceramics, b2b wholesale, nile clay pottery, luxury home decor" },
];

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" dir="ltr">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body className="antialiased min-h-screen">
        <ThemeProvider>
          <LanguageProvider>
            <Header />
            {children}
            <Footer />
          </LanguageProvider>
        </ThemeProvider>
        <ScrollRestoration />
        <Scripts />
        <SpeedInsights />
      </body>
    </html>
  );
}

export default function App() {
  return <Outlet />;
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  let message = "Oops!";
  let details = "An unexpected error occurred.";
  let stack: string | undefined;

  if (isRouteErrorResponse(error)) {
    message = error.status === 404 ? "404" : "Error";
    details =
      error.status === 404
        ? "The requested page could not be found."
        : (error.statusText || details) as string;
  } else if (import.meta.env.DEV && error && error instanceof Error) {
    details = error.message;
    stack = error.stack;
  } else if (error instanceof Error) {
    details = error.message;
  }

  let renderDetails = String(details);

  return (
    <main className="min-h-screen flex items-center justify-center p-6 sm:p-12 relative overflow-hidden">
      <div className="text-center">
        <h1 className="text-9xl font-bold text-primary">{message}</h1>
        <p className="mt-4 text-xl">{details}</p>
        {stack && (
          <pre className="mt-8 w-full max-w-2xl overflow-x-auto rounded bg-gray-100 p-4 text-left text-sm">
            {stack}
          </pre>
        )}
      </div>
    </main>
  );
}
