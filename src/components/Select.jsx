import React from 'react';

const Select = ({ children, onValueChange, value }) => (
    <select value={value} onChange={(e) => onValueChange(e.target.value)}>
        {children}
    </select>
);

const SelectTrigger = ({ children }) => (
    <div>{children}</div>
);

const SelectValue = ({ placeholder }) => (
    <option value="" disabled>{placeholder}</option>
);

const SelectContent = ({ children }) => (
    <div>{children}</div>
);

const SelectItem = ({ value, children }) => (
    <option value={value}>{children}</option>
);

export { Select, SelectTrigger, SelectValue, SelectContent, SelectItem };
