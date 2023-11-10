import React from 'react';

const Loading = ({ height = "100vh" }) => {
    return (
        <div className="d-flex justify-content-center align-items-center gap-2" style={{ height }}>
            <div className="spinner-border" role="status">
            </div>
            <span className="sr-only">Loading...</span>
        </div>
    );
};

export default Loading;
