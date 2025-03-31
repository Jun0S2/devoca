// app/components/breadcrumbs.tsx
import { Link, useMatches, useLocation } from "@remix-run/react";

export function Breadcrumbs() {
  const matches = useMatches();
  const location = useLocation();

  const crumbs = matches
    .filter(match => match.handle?.breadcrumb)
    .map((match, index, arr) => ({
      path: match.pathname,
      name: match.handle.breadcrumb(match.params),
      isLast: index === arr.length - 1
    }));

  if (crumbs.length <= 1) return null; // 홈만 있을 때 숨김

  return (
    <div className="mb-6">
      <nav className="flex" aria-label="Breadcrumb">
        <ol className="flex items-center space-x-2">
          {crumbs.map((crumb, i) => (
            <li key={crumb.path} className="flex items-center">
              {i > 0 && (
                <span className="mx-2 text-gray-400">/</span>
              )}
              {crumb.isLast ? (
                <span className="text-gray-900 font-medium">
                  {crumb.name}
                </span>
              ) : (
                <Link
                  to={crumb.path}
                  className="text-blue-600 hover:text-blue-800 hover:underline"
                >
                  {crumb.name}
                </Link>
              )}
            </li>
          ))}
        </ol>
      </nav>
    </div>
  );
}