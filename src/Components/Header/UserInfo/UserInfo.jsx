import React from 'react';
import './UserInfo.scss'

const UserInfo = ({icon, text, count}) => (
    <div className='iffy-wrapper' key={icon}>
      <img src={icon} alt=""/>
      <p>{text}</p>
      <strong>{count}</strong>
    </div>
  );

export default UserInfo;