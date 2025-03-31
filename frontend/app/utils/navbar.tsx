// app/components/navbar.tsx
import { Link, useLocation } from "@remix-run/react";

export function Navbar() {
  const location = useLocation();
  const currentPath = location.pathname.toLowerCase();

  const levels = ["a1", "a2", "b1", "b2"];

  return (
    <nav className="fixed top-0 left-0 right-0 bg-white shadow-sm z-50">
      <div className="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between">
        {/* Home */}
        <Link to="/" className="flex items-center text-gray-700 hover:text-red-200">
          <span className="text-xl font-bold text-red-400">DEVoca</span>
        </Link>

        {/* Level 메뉴 */}
        <div className="flex items-center space-x-2 md:space-x-4">
          {levels.map(level => {
            const isSelected = currentPath.includes(`/${level}`);
            return (
              <Link
                key={level}
                to={`/${level}`}
                className={`flex items-center font-bold text-md ${
                  isSelected ? "text-red-400" : "text-gray-700"
                } hover:text-red-200`}
              >
                <span>{level.toUpperCase()}</span>
              </Link>
            );
          })}
        </div>

        {/* Add Voca */}
        <div className="flex items-center space-x-4">
          <Link
            to="/words/new"
            className="px-3 py-1.5 rounded-md text-sm font-medium text-white bg-red-400 hover:bg-red-300"
          >
            +
          </Link>
        </div>
      </div>
    </nav>
  );
}
