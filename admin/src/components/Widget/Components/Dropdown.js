import React from "react";
import Select from "react-select";

const CustomSelect = ({ selectedOption, setSelectedOption, options, isDisabled }) => {
  const customDropdownStyle = {
    singleValue: (styles) => ({
      ...styles,
      color: "#07193A",
    }),
    valueContainer: (styles) => ({
      ...styles,
      backgroundColor: "#fff",
      padding: "0px",
      fontSize: "14px",
      cursor: `${isDisabled ? "not-allowed" : "pointer"}`,
    }),
    control: (styles) => ({
      ...styles,
      backgroundColor: "#fff",
      boxShadow: "none",
      padding: "0px 10px",
      borderColor: "#DFE2F1",
      "&:hover": { borderColor: "#DFE2F1" },
      cursor: `${isDisabled ? "not-allowed" : "pointer"}`,
      height: "15px",
    }),
    indicatorSeparator: (styles) => ({ ...styles, display: "none" }),
    dropdownIndicator: (styles) => ({
      ...styles,
      color: "#6766FC",
      "&:hover": { color: "#6766FC" },
      paddingRight: "0px",
    }),
    menu: (styles) => ({
      ...styles,
      left: "0",
      boxShadow: "0px 0px 12px rgba(0, 0, 0, 0.1)",
      backgroundColor: "#fff",
      opacity: "1",
      borderRadius: "6px",
    }),
    menuList: (styles) => ({
      ...styles,
      backgroundColor: "#fff",
      opacity: "1",
      maxHeight: "164px",
      padding: "0px 0px",
      borderRadius: "6px",
    }),
    option: (styles, { isFocused }) => ({
      ...styles,
      cursor: "pointer",
      fontSize: "14px",
      fontWeight: "400",
      color: "#07193A",
      padding: "10px 16px 9px 16px",
      borderBottom: "1px solid #f4f4f4",
      backgroundColor: isFocused ? "#F3F4FA" : "#fff",
      "&:active": { backgroundColor: "#F3F4FA" },
    }),
    placeholder: (styles) => ({
      ...styles,
      fontWeight: "300",
      fontSize: "16px",
    }),
  };
  return (
    <div>
      <Select value={selectedOption} onChange={setSelectedOption} options={options} isDisabled={isDisabled} styles={customDropdownStyle} />
    </div>
  );
};

export default CustomSelect;
