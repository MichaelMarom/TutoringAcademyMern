import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { get_user_setup_detail, login } from '../axios/auth';
import { toast } from 'react-toastify';
import { useDispatch } from 'react-redux';
import { setUser } from '../redux/auth_state/auth';
import { ForgetPasswordModal } from '../components/auth/ForgetPasswordModal';
import '../styles/auth.css'
import Button from '../components/common/Button';
import { useSignUp, useAuth, SignUp, SignIn, useSignIn } from "@clerk/clerk-react";


const LoginPage = () => {
    const navigate = useNavigate()
    const { signIn } = useSignIn()
    const [modalOpen, setOpenModel] = useState(false)
    const [loginForm, setLoginForm] = useState({
        email: '',
        password: '',
    });
    const [loading, setLoading] = useState(false);
    const dispatch = useDispatch()

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true)
        try {
            const result = await signIn.create({
                identifier: loginForm.email,
                password: loginForm.password,
            });
            console.log(result);
        }
        catch (err) {
            console.log(err.errors[0].message)
            toast.error(err.errors[0].message)
        }
        // const result = await login(loginForm);
        localStorage.setItem('tutor_user_id', null)
        localStorage.setItem('student_user_id', null)
        localStorage.setItem('student_screen_name', null)
        localStorage.setItem('tutor_screen_name', null)
        localStorage.setItem('user', null)
        localStorage.setItem('user_role', null)
        localStorage.setItem('logged_user', null);

        // if (result.status === 200) {
        //     toast.success("Login Successfull!");
        //     setLoginForm({});
        //     localStorage.setItem('user', JSON.stringify(result.data));
        //     localStorage.setItem('user_role', result.data[0].role)

        //     const getUserSetup = await get_user_setup_detail(result.data[0].role, result.data[0].SID);
        //     dispatch(setUser(result.data))
        //     if (result.data[0].role === 'admin') {
        //         return navigate(`/${result.data[0].role}/tutor-data`);

        //     }
        //     localStorage.setItem(`${result.data[0].role}_user_id`, getUserSetup.AcademyId)
        //     navigate(`/${result.data[0].role}/intro`);
        // }
        // else {
        //     toast.warning(result.message)
        // }
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
                                        <div className='w-100 d-flex justify-content-end text-primary'>
                                            <div onClick={() => setOpenModel(true)}>
                                                forgot password?
                                            </div>
                                        </div>

                                        <Button className="btn-primary" type="submit" loading={loading}>
                                            Login
                                        </Button>

                                        <div className="text-center">
                                            <p>Don't have an account? <Link to="/signup">Sign up</Link></p>
                                        </div>

                                    </form>
                                </div>
                                <ForgetPasswordModal
                                    setOpenModel={setOpenModel}
                                    modalOpen={modalOpen}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default LoginPage;
