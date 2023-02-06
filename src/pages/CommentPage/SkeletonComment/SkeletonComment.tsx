import { Card, CardContent, Stack } from '@mui/material'
import { Box } from '@mui/system'
import React from 'react'

const SkeletonComment: React.FC = () => {
  return (
    <div>
      <div className="shortCommentWrapper short-comment">
      <Card
        className="commentCard"
        classes={{ root: 'commentCardRoot' }}
      >
        <CardContent className="commentCardContent">
          <Stack className="titleAndMoreOptions">
            <Box sx={{ width: '100%', alignItems: 'center' }} className="short-comment__comment-info">
              <div className="short-comment__type skeleton"></div>
              <div className="short-comment__author skeleton skeleton-text skeleton-text--username"></div>
            </Box>
            <Box>
              <div className="reviewTitle skeleton skeleton-text"></div>
              <div className="reviewTitle skeleton skeleton-text"></div>
              <div className="reviewTitle skeleton skeleton-text"></div>
              <div className="reviewTitle skeleton skeleton-text"></div>
              <div className="reviewTitle skeleton skeleton-text"></div>
              <div className="reviewTitle skeleton skeleton-text"></div>
              <div className="reviewTitle skeleton skeleton-text"></div>
              <div className="reviewTitle skeleton skeleton-text"></div>
            </Box>
          </Stack>
        </CardContent>
      </Card>
    </div>
    </div>
  )
}

export default SkeletonComment
