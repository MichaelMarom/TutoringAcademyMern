import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { login } from '../axios/auth';
import { toast } from 'react-toastify';

const LoginPage = () => {
    const navigate = useNavigate()
    const [loginForm, setLoginForm] = useState({
        email: '',
        password: '',
    });
    const [loading, setLoading] = useState(false);

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true)
        const result = await login(loginForm);
        if (result.status === 200) {
            toast.success("Login Successfull!");
            setLoginForm({});
            localStorage.setItem('user', JSON.stringify(result.data));
            navigate(`/${result.data[0].role}/setup`);
        }
        else {
            toast.warning(result.message)
        }
        setLoading(false)
    };

    return (
        <section>
            <div
                className="px-4 py-5 px-md-5 text-center text-lg-start"
                style={{
                    backgroundColor: 'hsl(0, 0%, 96%)',
                    height: '100vh',
                }}
            >
                <div className="container m-auto h-100">
                    <div className="row m-auto h-100 gx-lg-5 align-items-center">
                        <div className="col-lg-6 mb-5 mb-lg-0">
                            <h1 className="my-5 display-3 fw-bold ls-tight">
                                The best offer <br />
                                <span className="text-primary">for your business</span>
                            </h1>
                            <p style={{ color: 'hsl(217, 10%, 50.8%)' }}>
                                Lorem ipsum dolor sit amet consectetur adipisicing elit. Eveniet, itaque accusantium odio, soluta,
                                corrupti aliquam quibusdam tempora at cupiditate quis eum maiores libero veritatis? Dicta facilis sint
                                aliquid ipsum atque?
                            </p>
                        </div>

                        <div className="col-lg-6 mb-5 mb-lg-0">
                            <div className="card">
                                <div className="card-body py-5 px-md-5">
                                    <form onSubmit={handleLogin}>
                                        <div className="form-outline mb-4">
                                            <input
                                                required
                                                type="email"
                                                id="form3Example3"
                                                className="form-control"
                                                placeholder="Email"
                                                value={loginForm.email}
                                                onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })}
                                            />
                                        </div>

                                        <div className="form-outline mb-4">
                                            <input
                                                required
                                                type="password"
                                                id="form3Example4"
                                                className="form-control"
                                                placeholder="Password"
                                                value={loginForm.password}
                                                onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                                            />
                                        </div>

                                        <button
                                            id="loading-button"
                                            className={`btn ${loading ? 'btn-secondary' : 'btn-primary'}`}
                                            disabled={loading}
                                            type='submit'
                                        >
                                            {loading && (
                                                <span
                                                    className="spinner-border spinner-border-sm mr-2"
                                                    role="status"
                                                    aria-hidden="true"
                                                ></span>
                                            )}
                                            {!loading && 'Login'}
                                        </button>

                                        <div className="text-center">
                                            <p>Don't have an account? <Link to="/signup">Sign up</Link></p>
                                        </div>

                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default LoginPage;
