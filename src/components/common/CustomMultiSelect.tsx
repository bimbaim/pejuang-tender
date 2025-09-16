// File: src/components/common/CustomMultiSelect.tsx
"use client";

import React, { useState, useEffect, useRef } from "react";
import "./CustomMultiSelect.css";

interface MultiSelectOption {
  value: string;
  label: string;
}

interface CustomMultiSelectProps {
  options: MultiSelectOption[];
  defaultValue: string[];
  onChange: (selectedValues: string[]) => void;
  onBlur?: () => void;
  placeholder?: string;
  limit?: number;
}

const CustomMultiSelect: React.FC<CustomMultiSelectProps> = ({
  options,
  defaultValue,
  onChange,
  onBlur,
  placeholder = "Pilih SPSE",
  limit,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState<string[]>(defaultValue);
  const [searchTerm, setSearchTerm] = useState("");
  const componentRef = useRef<HTMLDivElement>(null);

  // Close dropdown if click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        componentRef.current &&
        !componentRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [componentRef]);

  const handleToggle = () => setIsOpen(!isOpen);

  const handleCheckboxChange = (option: MultiSelectOption) => {
    if (selected.includes(option.value)) {
      const newSelected = selected.filter((v) => v !== option.value);
      setSelected(newSelected);
      onChange(newSelected);
    } else {
      if (limit && selected.length >= limit) {
        return;
      }
      const newSelected = [...selected, option.value];
      setSelected(newSelected);
      onChange(newSelected);
    }
  };

  const handleRemoveTag = (
    event: React.MouseEvent,
    valueToRemove: string
  ) => {
    event.stopPropagation();
    handleCheckboxChange({ value: valueToRemove, label: "" });
  };

  const getSelectedLabels = () => {
    return selected
      .map((value) => options.find((opt) => opt.value === value)?.label)
      .filter(Boolean);
  };

  const filteredOptions = options.filter((option) =>
    option.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div 
      className="custom-multi-select" 
      ref={componentRef}
      onBlur={onBlur} // Attach onBlur event here
      tabIndex={0} // Make the div focusable so onBlur works
    >
      <div className="select-box" onClick={handleToggle}>
        <div className="selected-tags-container">
          {getSelectedLabels().length > 0 ? (
            getSelectedLabels().map((label, index) => (
              <div key={index} className="selected-tag">
                <span>{label}</span>
                <button
                  type="button"
                  className="remove-tag-btn"
                  onClick={(e) => handleRemoveTag(e, selected[index])}
                >
                  &times;
                </button>
              </div>
            ))
          ) : (
            <span className="placeholder">{placeholder}</span>
          )}
        </div>
        <span className="dropdown-arrow">▼</span>
      </div>
      {isOpen && (
        <div className="dropdown-menu">
          <div className="search-input-container">
            <input
              type="text"
              placeholder="Cari SPSE..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onClick={(e) => e.stopPropagation()}
              className="search-input"
            />
          </div>
          {filteredOptions.length > 0 ? (
            filteredOptions.map((option) => (
              <label key={option.value} className="dropdown-item">
                <input
                  type="checkbox"
                  checked={selected.includes(option.value)}
                  disabled={
                    limit !== undefined &&
                    selected.length >= limit &&
                    !selected.includes(option.value)
                  }
                  onChange={() => handleCheckboxChange(option)}
                />
                {option.label}
              </label>
            ))
          ) : (
            <div className="no-options">Tidak ada opsi ditemukan.</div>
          )}
        </div>
      )}
    </div>
  );
};

export default CustomMultiSelect;