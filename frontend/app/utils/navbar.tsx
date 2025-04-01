// app/components/navbar.tsx
import { Link, useLocation } from "@remix-run/react";
import { useEffect, useState } from "react";
import logo from "/logo.png";

export function Navbar() {
  const location = useLocation();
  const currentPath = location.pathname.toLowerCase();
  const levels = ["a1", "a2", "b1", "b2"];
  const [darkMode, setDarkMode] = useState(false);

  // 초기 설정 및 localStorage 동기화
  useEffect(() => {
    const isDark = localStorage.getItem('darkMode') === 'true';
    setDarkMode(isDark);
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);

  const toggleDarkMode = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    localStorage.setItem('darkMode', String(newMode));
    if (newMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 h-[7vh] bg-white shadow-sm z-50 dark:bg-gray-800">
      <div className="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between">
        {/* Home (로고 이미지) */}
        <Link to="/" className="flex items-center">
          <img
            src={logo}
            alt="DEVoca Logo"
            className="h-8 w-auto object-contain"
          />
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
                  isSelected ? "text-red-400" : "text-gray-700 dark:text-gray-300"
                } hover:text-red-200 dark:hover:text-red-400`}
              >
                <span>{level.toUpperCase()}</span>
              </Link>
            );
          })}
        </div>

        {/* 우측 메뉴 (추가 버튼 + 다크모드 토글) */}
        <div className="flex items-center space-x-4">
          {/* 다크모드 토글 버튼 */}
          <button
            onClick={toggleDarkMode}
            className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
            aria-label={darkMode ? "라이트 모드로 전환" : "다크 모드로 전환"}
          >
            {darkMode ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-yellow-300" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-700" viewBox="0 0 20 20" fill="currentColor">
                <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
              </svg>
            )}
          </button>

          {/* Add Voca 버튼 */}
          <Link
            to="/words/new"
            className="px-3 py-1.5 rounded-md text-sm font-medium text-white bg-red-400 hover:bg-red-300 dark:bg-red-500 dark:hover:bg-red-400"
          >
            +
          </Link>
        </div>
      </div>
    </nav>
  );
}