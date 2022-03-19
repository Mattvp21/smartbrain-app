import React from 'react';

import './Rank.css'


const Rank = ({username, userentries}) => {
    return (
        <div>
            <div className='white f3'>
                {`${username}, your current rank is....`}
            </div>
            <div className='white f1'>
                {userentries}
            </div>
        </div>
    );
    
}

export default Rank;