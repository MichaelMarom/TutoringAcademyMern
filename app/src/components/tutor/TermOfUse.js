import React, { useEffect, useState } from 'react';
import { get_adminConstants } from '../../axios/admin';
import containerVariants from '../constraint';
import { motion } from "framer-motion";

import '../../styles/scrollablebody.css'
const TermOfUseComp = () => {
    const [terms, set_terms] = useState('');
    const [agreed, setAgreed] = useState(false);

    const handleCheckboxChange = () => {
        const allCheckboxesChecked = document.querySelectorAll('.agreement-checkbox:checked').length === 3;
        setAgreed(allCheckboxesChecked);
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (agreed) {
            console.log('User agreed to all terms.');
            // Perform additional actions if all terms are agreed
        } else {
            console.log('User did not agree to all terms.');
            // Display a message or handle accordingly
        }
    };
    useEffect(() => {
        const fetchData = async () => {
            try {
                // const storedUserRole = 'notadmin';
                const result = await get_adminConstants();
                set_terms(result.data[0].TermContent);
            } catch (error) {
                console.error('Error fetching data:', error);

            }
        }
        fetchData();
    }, []);
    return (
        <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="tutor-tab-setup"
        >
            <div style={{ overflowY: "auto", height: "90%" }}>

                <div className='container' dangerouslySetInnerHTML={{ __html: terms }} />
                <form onSubmit={handleSubmit} className='container'>
                    <div className="agreement">
                    <h1>Terms of Agreement</h1>
                        <div className="agreement-item">
                            <input type="checkbox" id="e-level1" className="agreement-checkbox" onChange={handleCheckboxChange} />
                            <label htmlFor="e-level1">By selecting this box, I have agreed to the terms and conditions of use</label>
                        </div>

                        <div className="agreement-item">
                            <input type="checkbox" id="e-level2" className="agreement-checkbox" onChange={handleCheckboxChange} />
                            <label htmlFor="e-level2">I will provide my social security number when my account accumulates $50 (For American Citizens Only)</label>
                        </div>

                        <div className="agreement-item">
                            <input type="checkbox" id="e-level3" className="agreement-checkbox" onChange={handleCheckboxChange} />
                            <label htmlFor="e-level3">Tutoring academy will issue me IRS form 1099 when my account will exceed $600 (For American Citizens Only)</label>
                        </div>
                    </div>

                    <div className='d-flex flex-column'>
                        <small>* checkmark all checkboxes to enable this button</small>
                        <button type="submit" 
                        disabled={!agreed} className='btn btn-outline-primary w-25'>
                            Submit
                        </button>
                    </div>
                </form>
            </div>
        </motion.div>
    )
}

export default TermOfUseComp