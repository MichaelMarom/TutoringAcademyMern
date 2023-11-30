import React from 'react';

const Loading = ({ height = "100vh", iconSize = "30px", loadingText = "Loading..." }) => {
    return (
        <div className="d-flex justify-content-center align-items-center gap-2" style={{ height }}>
            <div className="spinner-border" role="status" style={{ width: iconSize, height: iconSize }}>
            </div>
            <span className="sr-only">{loadingText}</span>
        </div>
    );
};

export default Loading;
