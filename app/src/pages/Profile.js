import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaFacebook, FaGoogle, FaTwitter, FaGithub } from 'react-icons/fa';
import { signup } from '../axios/auth';
import { toast } from 'react-toastify';
import { post_tutor_setup } from '../axios/tutor';
import { v4 as uuidv4 } from 'uuid'
import { useSelector } from 'react-redux';

function generateRandomString(minLength, maxLength) {
    const characters = 'abcdefghijklmnopqrstuvwxyz';
    const length = Math.floor(Math.random() * (maxLength - minLength + 1)) + minLength;
    let result = '';

    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        result += characters.charAt(randomIndex);
    }

    return result;
}
const Profile = () => {
    const { user } = useSelector(state => state.user)
    const [formFields, setFormFields] = useState({
        Address2: "dee",
        Email: user[0].email,
        AcademyId: generateRandomString(5, 10),
        ResponseHrs: "dede",
        TutorScreenName: 'ede',
        Headline: "dede",
        Introduction: "ded",
        Motivate: "dede",
        Password: "dwde",
        IdVerified: true,
        BackgroundVerified: true,
        userId: user[0].SID
    });
    const [errors, setErrors] = useState({})
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate()

    const handleRecordSave = async (e) => {
        e.preventDefault();
        setLoading(true)
        const result = await post_tutor_setup(formFields)
        if (result.status === 200) {
            console.log(result)
            console.log(result.data[0], 'result')
            localStorage.setItem("tutor_setup", result.data[0])
        }
        setFormFields({})
        setLoading(false)
        toast.success("Record SuccessFully Added!");
        navigate(`/tutor/setup`)
    };

    const handleProfilePicChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                const base64String = event.target.result;
                console.log(base64String)
                setFormFields({ ...formFields, Photo: base64String });
            };
            reader.readAsDataURL(file);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormFields({ ...formFields, [name]: value });
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
                            <div className="card">
                                <div className="card-body py-5 px-md-5">
                                    <form onSubmit={handleRecordSave}>
                                        <div className="row">
                                            <div className="d-flex justify-content-center mb-4">
                                                <div className="profile-pic-container">
                                                    {formFields.Photo ? (
                                                        <img
                                                            src={formFields.Photo}
                                                            alt="Profile"
                                                            className="profile-pic"
                                                        />
                                                    ) : (
                                                        <div className="default-avatar"></div>
                                                    )}
                                                </div>
                                            </div>
                                            <div className="form-outline mb-4">
                                                <input
                                                    type="file"
                                                    id="profilePic"
                                                    name="Photo"
                                                    className="form-control m-0"
                                                    onChange={handleProfilePicChange}
                                                />
                                            </div>
                                        </div>
                                        <div className="row mb-4">
                                            <div className="col-md-4">
                                                <div className="form-outline">
                                                    <input
                                                        type="text"
                                                        id="FirstName"
                                                        name="FirstName"
                                                        className="form-control m-0"
                                                        placeholder="First Name"
                                                        value={formFields.FirstName}
                                                        onChange={handleInputChange}
                                                    />
                                                    {errors.FirstName && (
                                                        <span className="small text-danger">
                                                            {errors.FirstName}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                            <div className="col-md-4">
                                                <div className="form-outline">
                                                    <input
                                                        type="text"
                                                        id="MiddleName"
                                                        name="MiddleName"
                                                        className="form-control m-0"
                                                        placeholder="Middle Name"
                                                        value={formFields.MiddleName}
                                                        onChange={handleInputChange}
                                                    />
                                                    {/* Add validation error handling for middleName */}
                                                </div>
                                            </div>
                                            <div className="col-md-4">
                                                <div className="form-outline">
                                                    <input
                                                        type="text"
                                                        id="LastName"
                                                        name="LastName"
                                                        className="form-control m-0"
                                                        placeholder="Last Name"
                                                        value={formFields.LastName}
                                                        onChange={handleInputChange}
                                                    />
                                                    {/* Add validation error handling for middleName */}
                                                </div>
                                            </div>
                                        </div>



                                        {/* //code added */}

                                        <div className="form-outline mb-4">
                                            <input
                                                required
                                                type="text"
                                                id="GMT"
                                                name="GMT"
                                                className="form-control m-0"
                                                placeholder="GMT"
                                                value={formFields.GMT}
                                                onChange={handleInputChange}
                                            />
                                            {errors.GMT && (
                                                <span className="small text-danger">{errors.GMT}</span>
                                            )}
                                        </div>

                                        <div className="form-outline mb-4">
                                            <input
                                                required
                                                type="text"
                                                id="StateProvince"
                                                name="StateProvince"
                                                className="form-control m-0"
                                                placeholder="StateProvince"
                                                value={formFields.StateProvince}
                                                onChange={handleInputChange}
                                            />
                                            {errors.StateProvince && (
                                                <span className="small text-danger">{errors.StateProvince}</span>
                                            )}
                                        </div>
                                        <div className="form-outline mb-4">
                                            <input
                                                required
                                                type="text"
                                                id="Video"
                                                name="Video"
                                                className="form-control m-0"
                                                placeholder="Video"
                                                value={formFields.Video}
                                                onChange={handleInputChange}
                                            />
                                            {errors.Video && (
                                                <span className="small text-danger">{errors.Video}</span>
                                            )}
                                        </div>

                                        <div className="form-outline mb-4">
                                            <input
                                                required
                                                type="text"
                                                id="CellPhone"
                                                name="CellPhone"
                                                className="form-control m-0"
                                                placeholder="Phone Number"
                                                value={formFields.CellPhone}
                                                onChange={handleInputChange}
                                            />
                                            {errors.CellPhone && (
                                                <span className="small text-danger">
                                                    {errors.CellPhone}
                                                </span>
                                            )}
                                        </div>

                                        <div className="form-outline mb-4">
                                            <input
                                                required
                                                type="text"
                                                id="ZipCode"
                                                name="ZipCode"
                                                className="form-control m-0"
                                                placeholder="Zip Code"
                                                value={formFields.ZipCode}
                                                onChange={handleInputChange}
                                            />
                                            {errors.ZipCode && (
                                                <span className="small text-danger">
                                                    {errors.ZipCode}
                                                </span>
                                            )}
                                        </div>

                                        <div className="form-outline mb-4">
                                            <input
                                                required
                                                type="text"
                                                id="Country"
                                                name="Country"
                                                className="form-control m-0"
                                                placeholder="Country"
                                                value={formFields.Country}
                                                onChange={handleInputChange}
                                            />
                                            {errors.Country && (
                                                <span className="small text-danger">
                                                    {errors.Country}
                                                </span>
                                            )}
                                        </div>


                                        <div className="form-outline mb-4">
                                            <input
                                                required
                                                type="text"
                                                id="Address1"
                                                name="Address1"
                                                className="form-control m-0"
                                                placeholder="Address1"
                                                value={formFields.Address1}
                                                onChange={handleInputChange}
                                            />
                                            {/* Add validation error handling for Address1 */}
                                        </div>

                                        <div className="form-outline mb-4">
                                            <input
                                                required
                                                type="text"
                                                id="CityTown"
                                                name="CityTown"
                                                className="form-control m-0"
                                                placeholder="City/Town"
                                                value={formFields.CityTown}
                                                onChange={handleInputChange}
                                            />
                                            {/* Add validation error handling for CityTown */}
                                        </div>
                                        {/*  */}
                                        <button type="submit" className="btn btn-primary btn-block mb-4">
                                            {loading ? (
                                                <div className="spinner-border text-primary" role="status">
                                                    <span className="visually-hidden">Loading...</span>
                                                </div>
                                            ) : (
                                                'Save'
                                            )}
                                        </button>




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

export default Profile;
