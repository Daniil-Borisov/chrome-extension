import React from 'react';
import noInternet from './../.../../../../../Assets/Images/Icons/noInternet.svg';
import './NoInternetComponent.scss'

const NoInternetComponent: React.FC = () => {
  return (
    <div className="noInternet">
      <div className="noInternet__card">
        <img src={noInternet} alt="" />
        <h4>Reload</h4>
        <h5>Something wrong with connection</h5>
      </div>
    </div>
  )
}

export default NoInternetComponent
