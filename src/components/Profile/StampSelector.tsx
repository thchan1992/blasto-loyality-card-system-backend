import { useState, useEffect } from "react";

const StampSelector = ({ initialValue, onChange }) => {
  const [selectedOption, setSelectedOption] = useState(initialValue);

  const options = [
    { value: 5, label: "5 Stamps" },
    { value: 10, label: "10 Stamps" },
  ];

  useEffect(() => {
    setSelectedOption(initialValue);
  }, [initialValue]);

  const handleOptionChange = (value) => {
    setSelectedOption(value);
    onChange(value);
  };

  return (
    <div className="m-3 flex flex-col items-center space-y-4 rounded-box border-2 border-white p-3">
      <h2 className="mb-4 text-2xl font-bold">Choose Your Stamp Package</h2>
      <div className="flex flex-col space-y-4 sm:flex-row sm:space-x-4 sm:space-y-0">
        {options.map((option) => (
          <div key={option.value} className="w-full sm:w-auto">
            <input
              type="radio"
              name="stamps"
              id={`stamps-${option.value}`}
              className="peer btn btn-ghost btn-lg hidden"
              checked={selectedOption === option.value}
              onChange={() => handleOptionChange(option.value)}
            />
            <label
              htmlFor={`stamps-${option.value}`}
              className="btn btn-outline btn-lg btn-block peer-checked:btn-primary"
            >
              <span className="mr-2 text-2xl font-bold">{option.value}</span>
              <span>Stamps</span>
            </label>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StampSelector;
