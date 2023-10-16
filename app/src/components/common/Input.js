import React from 'react';
import { Form } from 'react-bootstrap';

function Input(props) {
    const { type, placeholder, value, onChange } = props;

    return (
        <Form.Control type={type} placeholder={placeholder} value={value} onChange={onChange} />
    );
}

export default Input;
