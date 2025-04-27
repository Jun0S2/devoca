import { Link } from "@remix-run/react";

export function MenuCard({
  title,
  buttons,
}: {
  title: string;
  buttons: { label: string; href: string }[];
}) {
  return (
    <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-transform hover:scale-[1.02] p-6 flex flex-col justify-between items-center h-80">
      <div className="text-2xl font-semibold text-gray-800 mb-4">{title}</div>
      <div className="flex w-full gap-4 p-10 flex-1 items-stretch">
        {buttons.map(({ label, href }) => (
          <Link
            key={label}
            to={href}
            className="flex-1 flex items-center justify-center border border-gray-200 rounded-xl shadow-sm text-gray-800 font-bold text-lg hover:bg-fuchsia-100 hover:shadow-fuchsia-300 transition-all duration-200"
          >
            {label}
          </Link>
        ))}
      </div>
    </div>
  );
}
