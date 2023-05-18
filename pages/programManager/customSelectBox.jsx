import React, { useState } from "react";

const CustomSelectBox = ({ options, placeholder, onSelect }) => {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState("");
  const [inputValue, setInputValue] = useState("");

  const handleSelect = (option) => {
    setSelected(option);
    setOpen(false);
    setInputValue("");
    onSelect(option); // Pass the selected value back to the parent component
  };

  return (
    <div className="font-medium h-auto items-center self-center w-40 inline-block ml-10">
      <div
        onClick={() => setOpen(!open)}
        className={`bg-white w-full p-2 flex items-center justify-between rounded ${
          !selected && "text-gray-700"
        }`}
      >
        {selected
          ? selected?.length > 25
            ? selected?.substring(0, 25) + "..."
            : selected
          : placeholder}
      </div>
      <ul
        className={`bg-white mt-2 overflow-y-auto absolute w-40 z-50 ${
          open ? "max-h-60" : "max-h-0"
        } `}
      >
        <div className="flex items-center px-2 sticky top-0 bg-white">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value.toLowerCase())}
            placeholder="Enter date"
            className="placeholder:text-gray-700 p-2 outline-none w-full"
          />
        </div>
        <li
            key={0}
            className={`p-2 text-sm hover:bg-sky-600 hover:text-white h-9`}
            onClick={() => handleSelect('')}
          >
          </li>
        {options?.map((option, index) => (
          <li
            key={index+1}
            className={`p-2 text-sm hover:bg-sky-600 hover:text-white
            ${
              option?.toLowerCase() === selected?.toLowerCase() &&
              "bg-sky-600 text-white"
            }
            ${
              option?.toLowerCase().startsWith(inputValue)
                ? "block"
                : "hidden"
            }`}
            onClick={() => handleSelect(option)}
          >
            {option}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CustomSelectBox;
