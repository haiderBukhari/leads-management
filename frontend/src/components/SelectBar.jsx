import React, { useState } from 'react';
import { FormControl, InputLabel, MenuItem, Select, Checkbox, ListItemText, Chip } from '@mui/material';

const MultiSelect = ({ options }) => {
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [secondarySelectedValues, setSecondarySelectedValues] = useState([]);

  const handleChange = (event) => {
    const newSelectedOptions = event.target.value;
    setSelectedOptions(newSelectedOptions);

    // Update secondarySelectedValues based on changes in selectedOptions
    const newSecondaryValues = newSelectedOptions.filter(
      (option) => !selectedOptions.includes(option) && !secondarySelectedValues.includes(option)
    );
    setSecondarySelectedValues([...newSecondaryValues]);
    console.log(newSecondaryValues);
  };

  const getSelectedValueText = () => {
    if (selectedOptions.length === 0) {
      return 'Select Options';
    } else {
      return `${selectedOptions.length} selected`;
    }
  };

  return (
    <div className="mt-4">
      <FormControl>
        <InputLabel className="mt-5" style={{ fontSize: "20px" }} shrink>{getSelectedValueText()}</InputLabel>
        <Select
          multiple
          className="bg-white w-[250px] h-[40px] outline-none"
          value={selectedOptions}
          onChange={handleChange}
          renderValue={(selected) => (
            <div>
              {selected.map((value) => (
                <Chip key={value} label={value} className="mr-1" />
              ))}
            </div>
          )}
          MenuProps={{
            anchorOrigin: {
              vertical: 'bottom',
              horizontal: 'left',
            },
            transformOrigin: {
              vertical: 'top',
              horizontal: 'left',
            },
            getContentAnchorEl: null,
          }}
        >
          {options.map((option) => (
            <MenuItem className="h-[30px] my-3" key={option} value={option}>
              <Checkbox checked={selectedOptions.includes(option)} />
              <ListItemText primary={option} />
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </div>
  );
};

export default MultiSelect;
