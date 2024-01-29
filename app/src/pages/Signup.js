import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaFacebook, FaGoogle, FaTwitter, FaGithub } from 'react-icons/fa';
import { signup } from '../axios/auth';
import { toast } from 'react-toastify';
import { useSignUp, useAuth, SignUp, SignIn, useUser } from "@clerk/clerk-react";
import Button from '../components/common/Button';

const Signup = () => {
  const [signupFormValues, setSignupFormValues] = useState({
    email: '',
    password: '',
    role: ''
  });
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate()
  const { isLoaded, signUp, setActive } = useSignUp();
  const { user } = useUser();
  const { userId } = useAuth()

  const { getToken } = useAuth();
  const [pendingVerification, setPendingVerification] = useState(false);
  const [code, setCode] = useState("");

  const handleValidation = () => {
    const newErrors = {};

    if (signupFormValues.email.trim() === '') {
      newErrors.email = 'Email is required';
    } else if (!isValidEmail(signupFormValues.email)) {
      newErrors.email = 'Invalid email address';
    }

    if (signupFormValues.password.trim() === '') {
      newErrors.password = 'Password is required';
    } else if (!isValidPassword(signupFormValues.password)) {
      newErrors.password = 'Password must be at least 6 characters and contain letters and numbers';
    }
    const acceptedRoles = ['tutor', 'student', 'visitor', 'admin', 'parent']
    if (!acceptedRoles.includes(signupFormValues.role)) {
      newErrors.role = 'Please select role! '
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const isValidPassword = (password) => {
    if (password.length < 6) {
      return false;
    }

    const hasLetter = /[a-zA-Z]/.test(password);
    const hasNumber = /\d/.test(password);

    return hasLetter && hasNumber;
  }

  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await signUp.create({
        emailAddress: signupFormValues.email,
        password: signupFormValues.password,
        unsafeMetadata: {
          role: signupFormValues.role,
        },
      });
      await signUp.prepareEmailAddressVerification({ strategy: "email_code" });
      setPendingVerification(true);
    }
    catch (err) {
      console.log(err.errors[0].message)
      toast.error(err.errors[0].message)
    }
    setLoading(false)
  };

  const handleVerification = async (e) => {
    setLoading(true);
    e.preventDefault();
    if (!isLoaded) {
      return;
    }
    try {
      const completeSignUp = await signUp.attemptEmailAddressVerification({
        code,
      });
      if (completeSignUp.status === "complete") {
        await setActive({ session: completeSignUp.createdSessionId });
        const token = await getToken();
        if (token !== null) {
          localStorage.setItem("access_token", token);
          const result = await signup({
            email: signupFormValues.email,
            SID: completeSignUp.createdUserId,
            role: signupFormValues.role
          })
          if (result.status === 200) {
            setSignupFormValues({ role: '', email: '', password: '' })
            toast.success('Registration Succesfull')
          }
          else {
            toast.error("Error: Please contact support!");
          }
        } else {
          toast.error("Could not retrieve token from clerk");
        }
      } else {
        toast.error("Unable to complete sign up. Please contact support");
      }
    } catch (err) {
      // setErrors(err.errors);
    } finally {
      setLoading(false);
      setPendingVerification(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSignupFormValues({ ...signupFormValues, [name]: value });
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
                Lorem ipsum dolor sit amet consectetur adipisicing elit.
                Eveniet, itaque accusantium odio, soluta, corrupti aliquam
                quibusdam tempora at cupiditate quis eum maiores libero
                veritatis? Dicta facilis sint aliquid ipsum atque?
              </p>
            </div>
            <div className="col-lg-6 mb-5 mb-lg-0">
              {/* <SignUp path="/signup" routing="path" signInUrl="/login" /> */}
              <div className="card">
                <div className="card-body py-5 px-md-5">
                  <form onSubmit={handleSignup}>

                    <div className='row'>
                      <div className="form-outline mb-4 col-md-6">
                        <input
                          type="email"
                          id="email"
                          name="email"
                          className="form-control m-0"
                          placeholder="Email"
                          value={signupFormValues.email}
                          onChange={handleInputChange}
                        />
                        {errors.email && <span className='small text-danger'>{errors.email}</span>}
                      </div>
                      <div className="form-outline mb-4 col-md-6">
                        <input
                          type="password"
                          id="password"
                          name="password"
                          className="form-control m-0"
                          placeholder="Password"
                          value={signupFormValues.password}
                          onChange={handleInputChange}
                        />
                        {errors.password && <span className='small text-danger'>{errors.password}</span>}

                      </div>
                    </div>

                    <div className='form-outline mb-4'>
                      <select className="form-select"
                        name="role"
                        value={signupFormValues.role}
                        aria-label="Default select example" onChange={handleInputChange}>
                        <option selected>Select Role</option>
                        <option value="tutor">Tutor</option>
                        <option value="student">Student</option>
                        <option value="visitor">Visitor</option>
                        <option value="parent">Parent</option>
                        <option value="admin">Admin</option>
                      </select>
                      {errors.role && <span className='small text-danger'>{errors.role}</span>}
                    </div>

                    <button type="submit" className="action-btn btn btn-block mb-4">
                      {loading ? (
                        <div className="spinner-border text-primary" role="status">
                          <span className="visually-hidden">Loading...</span>
                        </div>
                      ) : (
                        <div className="button__content">
                          <p className="button__text">Sign up</p>
                        </div>
                      )}
                    </button>

                    <div className="text-center">
                      <p>Already have an account? <Link to="/login">Login</Link></p>
                    </div>

                    <div className="text-center">
                      <p>or sign up with:</p>
                      <button type="button" className="btn btn-link btn-floating mx-1">
                        <FaFacebook />
                      </button>

                      <button type="button" className="btn btn-link btn-floating mx-1">
                        <FaGoogle />
                      </button>

                      <button type="button" className="btn btn-link btn-floating mx-1">
                        <FaTwitter />
                      </button>

                      <button type="button" className="btn btn-link btn-floating mx-1">
                        <FaGithub />
                      </button>
                    </div>
                  </form>
                  {pendingVerification && (
                    <div>
                      <form>
                        <input type='text' onBlur={() => { }} onChange={(e) => setCode(e.target.value)} />
                        <Button handleClick={handleVerification}>
                          Verify Email
                        </Button>
                      </form>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Signup;
