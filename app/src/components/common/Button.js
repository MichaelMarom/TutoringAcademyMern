import React from 'react';

function Button({ loading = false, type = "button", handleClick = () => { }, children, className = '', ...otherProps }) {

    return (
        <button
            className={`btn ${loading ? 'btn-secondary' : className}`}
            disabled={loading}
            type={type}
            onClick={handleClick}
            {...otherProps}
        >
            {loading &&
                <>
                    <span
                        className="spinner-border spinner-border-sm mr-2"
                        role="status"
                        aria-hidden="true"
                    ></span>
                    {otherProps.loadingText}
                </>
            }
            {!loading && children}
        </button>
    );
}

export default Button;
