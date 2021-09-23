import React from "react";
import "./TextInput.css";

interface Props {
  type: string;
  label?: string;
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
}

const TextInput = ({
  type = "text",
  label,
  value,
  onChange,
  placeholder,
}: Props) => (
  <div className="simple-form-group">
    {label && <label className="simple-text-label">{label}</label>}
    <input
      type={type}
      className="simple-text-input"
      value={value}
      onChange={(e) => onChange && onChange(e.target.value)}
      placeholder={placeholder}
    />
  </div>
);

export default TextInput;
