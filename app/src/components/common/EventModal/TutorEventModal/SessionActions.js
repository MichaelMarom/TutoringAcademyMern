import React from 'react'
import Button from '../../Button'

export const SessionActions = ({clickedSlot, handlePostpone}) => {
    
    return (
        <div style={{width:"95%"}}>

            <Button handleClick={handlePostpone} className='btn-warning w-100'>Postpone this lesson</Button>
            <Button handleClick={() => { }} className='btn-danger w-100'>Delete this lesson</Button>
        </div>
    )
}
