import React from 'react'
import Avatar from '../../../components/common/Avatar'
import TAButton from '../../../components/common/TAButton'
import { MdCancel } from 'react-icons/md'

const ShortlistAdCard = ({ photo, name, adText }) => {
    return (
        <div className='d-flex border p-2 align-items-center rounded text-bg-dark col-md-4 flex-column position-relative'>
            <div className='position-absolute top-0 end-0 p-1 cursor-pointer'><MdCancel /> </div>
            <Avatar avatarSrc={photo} size='100px' showOnlineStatus={false} />
            <h5>{name}</h5>
            <div className='border text-bg-dark p-2' dangerouslySetInnerHTML={{ __html: adText }} style={{ height: "150px", overflowY: "auto" }} />

            <div className='mt-2'>
                <TAButton buttonText={'See Profile'} style={{width:"150px"}} />
            </div>
        </div>
    )
}

export default ShortlistAdCard