import { Box } from '@mui/material'
import React, { useState } from 'react'
import FsLightbox from 'fslightbox-react';
import './attachmentsGallery.scss'

const AttachmentsGallery = ({ attachments }) => {
  const [lightboxController, setLightboxController] = useState({
    toggler: false,
    slide: 1
  });

  if (attachments?.length === 0) return null

  function openLightboxOnSlide(number) {
    setLightboxController({
      toggler: !lightboxController.toggler,
      slide: number
    });
  }

  return (
    <div className='attachmentsGalleryContainer'>
      <div className="img-container">
        {attachments?.map((attachment, index) => (
          <Box className='img-box' key={attachment} sx={{
            height: 'auto',
            maxHeight: '150px',
            overflow: 'hidden'
          }}>
            <img src={attachment} onClick={()=>openLightboxOnSlide(index+1)} alt="attachment" style={{ width: '100%', height: '100%', objectFit: 'cover'}}/>
          </Box>
        ))}
      </div>
      <FsLightbox
        toggler={lightboxController.toggler}
        sources={attachments}
        type="image"
        slide={lightboxController.slide}
      />
    </div>
  )
}

export default AttachmentsGallery