import React, { useState, useEffect } from 'react';

const DebounceInput = ({ delay, value, setInputValue, onChange, debouceCallback, element = 'input', ...rest }) => {
    // const [inputValue, setInputValue] = useState(value);
    const [debouncedValue, setDebouncedValue] = useState(value);

    useEffect(() => {
        const delayInputTimeoutId = setTimeout(() => {
            setDebouncedValue(value);
            debouceCallback()
        }, delay);
        return () => clearTimeout(delayInputTimeoutId);
    }, [value, delay]);

    const handleInputChange = (event) => {
        setInputValue(event.target.value);
    };

    return <input className="form-control" type="text" value={value}
        onChange={handleInputChange}  {...rest} />;
};

export default DebounceInput;
