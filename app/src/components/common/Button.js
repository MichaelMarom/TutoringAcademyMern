import React from 'react';

function Button({ loading=false, type="button", handleClick = () => { }, children, className='' }) {

    // const buttonClass = type === 'inverted' ? 'btn-inverted' : 'btn-default';
    return (
        <button
            className={`btn ${loading ? 'btn-secondary' : className}`}
            disabled={loading}
            type={type}
            onClick={handleClick}
        >
            {loading && (
                <span
                    className="spinner-border spinner-border-sm mr-2"
                    role="status"
                    aria-hidden="true"
                ></span>
            )}
            {!loading && children}
        </button>
    );
}

export default Button;
