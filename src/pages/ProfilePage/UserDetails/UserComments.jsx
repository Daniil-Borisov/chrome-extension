/* eslint-disable no-underscore-dangle */
import { Stack } from '@mui/material'
import { Box } from '@mui/system'
import React, { useEffect } from 'react'
import UserDetailsUtils from './UserDetailsUtils'

const UserComments = () => {
  const { fetchMyReplies, loader, myComments, myReplies } = UserDetailsUtils()

  useEffect(() => {
    fetchMyReplies()
  }, [])

  if (loader) {
    return (
      <Stack>
        <Box>Loading my comments..</Box>
      </Stack>
    )
  }

  return (
    <Stack className="myCommentsWrapper">
      <Box>
        My Comments
        {myComments.map((item) => <Box key={item}>{item.data}</Box>)}
      </Box>
      <Box className="replyWrapper">
        My Replies
        {myReplies.map((item) => <Box key={item}>{item.data}</Box>)}
      </Box>
    </Stack>
  )
}

export default UserComments
