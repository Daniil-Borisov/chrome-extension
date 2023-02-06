import React, { useMemo } from 'react';
import {useDropzone} from 'react-dropzone';
import DropIcon from '../../Assets/Images/Icons/drop.svg'
import './dropzone.scss'


function Dropzone({onDrop}, props) {
  const { getRootProps, getInputProps, isFocused, isDragAccept, isDragReject } = useDropzone({
    onDrop,
    accept: 'image/jpg, image/jpeg, image/png,',
    multiple: false,
  });

  const focusedStyle = {
    borderColor: '#2196f3'
  };

  const acceptStyle = {
    borderColor:  '#E38058',
    background:'rgba(227, 128, 88, 0.1)',
  };

  const rejectStyle = {
    borderColor: '#ff1744'
  };

  const style = useMemo(() => ({
    ...(isFocused ? focusedStyle : {}),
    ...(isDragAccept ? acceptStyle : {}),
    ...(isDragReject ? rejectStyle : {})
  }), [
    isFocused,
    isDragAccept,
    isDragReject
  ]);

  return (
    <section className="iffy-dropzone">
      <div {...getRootProps({style})} className='iffy-dropzone-wrapper'>
        <input {...getInputProps()}></input>
          <div className="iffy-zone">
            <img src={DropIcon} alt="" />
          </div>
      </div>
      <p>Drag and Drop your file</p>
    </section>
  );
}

export default Dropzone