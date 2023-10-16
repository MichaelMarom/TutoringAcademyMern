import React from 'react';
import { Button as BootstrapButton } from 'react-bootstrap';

function Button(props) {
    const { label, type, onClick, disabled } = props;

    const buttonClass = type === 'inverted' ? 'btn-inverted' : 'btn-default';
    return (
        <BootstrapButton className={buttonClass} onClick={onClick} disabled={disabled}>
            {label}
        </BootstrapButton>
    );
}

export default Button;
