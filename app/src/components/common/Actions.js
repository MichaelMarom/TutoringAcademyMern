import React from 'react';
import Button from './Button';

const actionsStyle = {
    position: 'fixed',
    bottom: '0',
    left: '0',
    right: '0',
    backgroundColor: 'white',
    borderTop: '1px solid #ccc',
    padding: '10px',
};

const Actions = ({
    loading = false,
    onSave = () => { },
    onBack = () => { },
    onEdit = () => { },
    onNext = () => { }
}) => {
    return (
        <div style={actionsStyle}>
            <div className="container">
                <div className="row justify-content-center">
                    <div className="col-1">
                        <button onClick={onBack} className="btn btn-secondary">Back</button>
                    </div>
                    <div className="col-1">
                        <button onClick={onEdit} className="btn btn-warning" disabled>Edit</button>
                    </div>
                    <div className="col-1">
                        <Button handleClick={onSave} className="btn btn-primary" type="submit" loading={loading} >
                            Save
                        </Button>
                    </div>
                    <div className="col-1">
                        <button onClick={onNext} className="btn btn-success">Next</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Actions
