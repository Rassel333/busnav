import React from "react";
import { InputAdornment, TextField, withStyles } from "@material-ui/core";
import { Clear } from "@material-ui/icons";

const StyledInput = withStyles({
  root: {
    "& .MuiFormLabel-root": {
      fontFamily: "'AvantGardeCTT', arial",
    },
    "& .MuiInputBase-root": {
      fontFamily: "'AvantGardeCTT', arial",
      color: "rgba(255, 255, 255, 0.42)",
    },
    "& .MuiFilledInput-underline:after": {
      borderBottom: "1px solid #fff",
    },
    "& .MuiFilledInput-underline:before": {
      borderBottom: "1px solid rgba(255, 255, 255, 0.42)",
    },
    "& .MuiInputLabel-filled": {
      color: "rgba(255, 255, 255, 0.6)",
    },
    "& .Mui-focused": {
      color: "#fff",
    },
    "& .MuiFilledInput-root": {
      background: "#475d862e",
    },
  },
})(TextField);

export const SearchInput = ({
  label,
  size = "small",
  icon,
  onChange,
  value,
}) => (
  <StyledInput
    value={value}
    onChange={(e) => onChange(e.target.value)}
    variant="filled"
    label={label}
    fullWidth
    size={size}
    InputProps={{
      endAdornment: (
        <InputAdornment position="end">
          {icon}
          <Clear
            style={{ cursor: "pointer", color: "#fff" }}
            onClick={() => onChange("")}
          />
        </InputAdornment>
      ),
    }}
  />
);
