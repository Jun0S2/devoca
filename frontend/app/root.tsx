import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "@remix-run/react";
import type { LinksFunction } from "@remix-run/node";
import type { LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import "./tailwind.css";
import { useLoaderData } from "@remix-run/react"; // 추가
import {Navbar} from "~/utils/navbar";
import { LayoutWrapper } from "./utils/layout-wrapper";
export async function loader({ request }: LoaderFunctionArgs) {
  return json({
    SUPABASE_URL: process.env.SUPABASE_URL,
    SUPABASE_ANON_KEY: process.env.SUPABASE_ANON_KEY,
  });
}

export const links: LinksFunction = () => [
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  {
    rel: "preconnect",
    href: "https://fonts.gstatic.com",
    crossOrigin: "anonymous",
  },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap",
  },
];

export function Layout({ children }: { children: React.ReactNode }) {
  const env = useLoaderData<typeof loader>(); // 👈 이 줄 추가!

  return (
    <html lang="en" className="dark:bg-gray-900">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        <Navbar />
        <LayoutWrapper>
        {children}
        </LayoutWrapper>
   
        <ScrollRestoration />
        <Scripts />
        {/* 👇 브라우저에 환경변수 전달 */}
        <script
          dangerouslySetInnerHTML={{
            __html: `window.ENV = ${JSON.stringify(env)};`,
          }}
        />
      </body>
    </html>
  );
}

export default function App() {
  return <Outlet />;
}
