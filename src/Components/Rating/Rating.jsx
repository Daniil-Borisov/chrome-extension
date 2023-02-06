import React from 'react';
import Rating from '@mui/material/Rating';
import StarRoundedIcon from '@mui/icons-material/StarRounded';

const RatingComponent = (props) => (
  <Rating
    max={5}
    precision={0.5}
    sx={{ color: '#303030', marginBottom: '0' }}
    icon={<StarRoundedIcon fontSize="inherit" />}
    emptyIcon={<StarRoundedIcon color="#B9BAB6" fontSize="inherit" />}
    {...props}
  />
)

export default RatingComponent
