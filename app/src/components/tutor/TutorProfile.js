import { useState } from 'react';
import { COLUMNS } from '../../Tables/Me/columns';
import { useEffect } from 'react';
import { get_my_data, get_rates, get_tutor_profile } from '../../axios/tutor';
import { convertGMTOffsetToLocalString } from '../../helperFunctions/timeHelperFunctions';
import { useParams } from 'react-router';

const TutorProfile = () => {
    const params = useParams();
    const studentId = localStorage.getItem('student_user_id');
    // const [dateTime, setDateTime] = useState(null);


    // useEffect(() => {
    //     if (GMT) {
    //         const localTime = convertGMTOffsetToLocalString(GMT);
    //         setDateTime(localTime);
    //     }
    // }, [GMT]);

    useEffect(() => {
        const fetch_profile = async () => {
            const data = await get_tutor_profile(params.id, studentId);
            console.log(data)
        }

        fetch_profile();
    }, [params.id, studentId])

    return (
        <div>

        </div>
    );
}

export default TutorProfile;