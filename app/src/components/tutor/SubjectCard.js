import React, { useState } from 'react'
import Input from '../common/Input'
import GradePills from './GradePills'
import Button from '../common/Button'
import { upload_tutor_rates } from '../../axios/tutor'
import { toast } from 'react-toastify'

const SubjectCard = ({ subject, onSave, rateVal, gradesVal, handleGrades, faculty }) => {
    const [rate, setRate] = useState(rateVal)
    const [grades, setGrades] = useState(gradesVal)
    const [editable, setEditable] = useState(false);
    const tutorId = localStorage.getItem('tutor_user_id')
    const options = [
        {
            value: '1-3',
            text: '1-3'
        },
        {
            value: '4-6',
            text: '4-6'
        },
        {
            value: '7-9',
            text: '7-9'
        },
        {
            value: '10-12',
            text: '10-12'
        }, {
            value: "University"
        }
    ]
    const validate = (value) => {
        const regex = /^\d{1,3}?$/;

        if (regex.test(value) || value === '') {
            return true
        }
        return false
    }

    const handleOnChangeRate = (value) => {
        if (validate(value)) {
            setRate(value)
        }
    }

    const handleSave = async (e) => {
        e.preventDefault()
        if (!grades.length) return toast.warning("Please selct at least one grade!")
        setEditable(false);
        const data = await upload_tutor_rates(rate, grades, tutorId, faculty, subject)
        if (data?.response?.status === 400) {
            toast.error('Failed to Save Record')
        }
        else {
            toast.success('Succesfully Save The Record')
        }
    }

    return (
        <div className={`border p-2 rounded  mx-2 d-flex justify-content-between align-items-center `} style={{ background: !editable ? '#d8d8d8' : "" }}>
            <h6 className='m-0 text-start col-2'>{subject}</h6>
            <form onSubmit={handleSave}
                className=' d-flex justify-content-between align-items-center'>

                <div className='d-flex '>
                    {options.map(option =>
                        <GradePills editable={editable} grade={option.value} setGrades={setGrades} grades={grades} />)
                    }
                </div>
                <div className='col-2'>
                    <Input placeholder={"00"} inputGroupText={"$"} required className="form-control m-0" inputGroup={true} vertical={false} value={rate} onChange={handleOnChangeRate} disabled={!editable} />
                </div>
                <div className='float-end'>

                    <Button type={"button"} className='btn-primary btn-sm' handleClick={() => setEditable(!editable)}>
                        Edit
                    </Button>

                    <Button type='submit' className='btn-success btn-sm' disabled={!editable}>
                        Save
                    </Button>
                </div>
            </form>

        </div >
    )
}

export default SubjectCard