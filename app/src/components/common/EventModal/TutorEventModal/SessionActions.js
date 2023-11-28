import React from 'react'
import Button from '../../Button'

export const SessionActions = ({clickedSlot}) => {
    return (
        <div style={{width:"95%"}}>

            <Button handleClick={() => { }} className='btn-warning w-100'>Postpone</Button>
            <Button handleClick={() => { }} className='btn-danger w-100'>Delete</Button>
        </div>
    )
}
