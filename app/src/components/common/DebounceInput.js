import React, { useState, useEffect } from 'react';

const DebounceInput = ({ delay, value, setInputValue, onChange, element, ...rest }) => {
    // const [inputValue, setInputValue] = useState(value);
    const [debouncedValue, setDebouncedValue] = useState(value);

    useEffect(() => {
        const handler = setTimeout(() => {
            setInputValue(value);
        }, delay);

        return () => {
            clearTimeout(handler);
        };
    }, [value, delay]);

    const handleInputChange = (event) => {
        setInputValue(event.target.value);
    };

    const Element = element || 'input';

    return <Element {...rest} value={debouncedValue} onChange={handleInputChange} />;
};

export default DebounceInput;
