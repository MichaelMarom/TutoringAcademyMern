import React, { useState } from 'react'
import { toast } from 'react-toastify';
import { forget_password } from '../../axios/auth';
import Button from '../common/Button';
import Modal from '../common/Modal'

export const ForgetPasswordModal = ({ modalOpen, setOpenModel }) => {
    const [password, setPassword] = useState();
    const [confirmPassword, setConfirmPassword] = useState();
    const [email, setEmail] = useState('')
    const [loading, setLoading] = useState(false)

    const handlePasswordChange = async () => {
        setLoading(true)
        const data = await forget_password(email, password);
        if (data) {
            toast.success("Passowrd Updates Succesfully")
        }
        else {
            toast.error("Could not update password")
        }
        setLoading(false)
    }

    return (
        <Modal
            show={modalOpen}
            onHide={() => setOpenModel(false)}
            title={"Change Password"}
        >
            <div className="container">
                <div className="form-group">
                    <label htmlFor="password">Email:</label>
                    <input
                        type="email"
                        className="form-control"
                        id="email"
                        placeholder="Enter Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="password">Password:</label>
                    <input
                        type="password"
                        className="form-control"
                        id="password"
                        placeholder="Enter password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="confirmPassword">Confirm Password:</label>
                    <input
                        type="password"
                        className="form-control"
                        id="confirmPassword"
                        placeholder="Confirm password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                </div>

                {password !== confirmPassword && (
                    <div className="alert alert-danger">
                        Passwords do not match.
                    </div>
                )}
                <hr className='mt-4'/>
                <div className='d-flex justify-content-between'>
                    <Button className='btn-secondary' handleClick={() => setOpenModel(false)}>
                        Cancel
                    </Button>
                    <Button className='btn-primary' handleClick={handlePasswordChange} loading={loading}>
                        Change Passowrd
                    </Button>
                </div>
            </div>
        </Modal>
    )
}
