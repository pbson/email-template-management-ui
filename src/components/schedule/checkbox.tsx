export const CheckboxMultiSelect = ({ options, value, onChange, label }) => {
  return (
    <div className="space-y-2 w-full">
      <label className="block text-sm font-medium text-gray-700">{label}</label>
      <div className="bg-white border border-gray-300 rounded-md shadow-sm p-2 max-h-48 overflow-y-auto">
        {options.map((option) => (
          <label
            key={option}
            className="flex items-center space-x-2 p-1 hover:bg-gray-100 rounded"
          >
            <input
              type="checkbox"
              checked={value.includes(option)}
              onChange={() => {
                const newValue = value.includes(option)
                  ? value.filter((item) => item !== option)
                  : [...value, option];
                onChange(newValue);
              }}
              className="rounded text-blue-600 focus:ring-blue-500"
            />
            <span className="text-sm text-gray-700">{option}</span>
          </label>
        ))}
      </div>
    </div>
  );
};
