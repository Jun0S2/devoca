export function CheckboxInput({
  name,
  checked,
  onChange,
  label,
}: {
  name: string;
  checked: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  label: string;
}) {
  return (
    <label className="flex items-center space-x-2">
      <input
        type="checkbox"
        name={name}
        checked={checked}
        onChange={onChange}
        className="form-checkbox accent-blue-600 dark:accent-blue-400"
      />
      <span className="text-gray-800 dark:text-white">{label}</span>
    </label>
  );
}
