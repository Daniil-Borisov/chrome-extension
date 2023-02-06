import React from 'react';
import './ModalWindow.scss'

const ModalWindow = ({children, setOpen}) => {

  return (
    <div className='iffy-modal-window' onClick={setOpen}>
      <div className="iffy-content">
        {children}
      </div>
    </div>
  );
};

export default ModalWindow;