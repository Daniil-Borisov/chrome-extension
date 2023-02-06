import React, { useEffect, useState } from 'react';
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import { Box } from '@mui/system';
import Comment from '../Comment';
import CommentsUtils from '../../CommentPageUtil';
import './Reply.scss'

const Reply = ({ commentId, replies, setReplies }) => {
  const [reply, setReply] = useState('');
  const [viewAll, setViewAll] = useState(false)

  useEffect(()=>{
    if (replies.length > 2){
      setReply(replies.slice(0, 2))
    } else {
      setReply(replies)
    }

    if (viewAll){
      setReply(replies)
    }
  }, [replies, viewAll])

  const { secondsToTime, secondToHours } = CommentsUtils()
  return (
    <Box sx={{ mt: '10px'}}>
      <Box className="iffy-replies">
        {reply.length > 0 ? reply.map((r) => (
              <Comment
                key={r.id}
                id={r.id}
                title={r.data}
                first={r.user_name || ''}
                last={r.last_name || ''}
                username={r.user_id}
                text={r.data}
                rating={r.ratings}
                photo={r.user_image || ''}
                selected={true}
                readMoreActive={false}
                setReadMoreFor={null}
                expandComment={false}
                setExpandCommentFor={null}
                numOfReplies={null}
                reactions={r.reactions}
                isComment={false}
                commentId={commentId}
                parentReplies={replies}
                setParentReplies={setReplies}
                isReply={true}
                // eslint-disable-next-line no-underscore-dangle
                commentDate={secondsToTime(r?.createdDate?._seconds)}
                // eslint-disable-next-line no-underscore-dangle
                commentTime={secondToHours(r?.createdDate?._seconds)}
              />
            )) : null}
      </Box>
      {replies.length > 2 && !viewAll && (
          <div className='iffy-replies__view-all'>
            <div
              onClick={() => setViewAll(true)}
            >
              View all {replies.length} replies
              <KeyboardArrowDownIcon style={{fontSize:'initial'}}/>
            </div>
          </div>
        )}
      {viewAll && (
        <div
          className='iffy-replies__view-all'
          onClick={() => setViewAll(false)}
        >
          <div>
            Hide all replies
            <KeyboardArrowDownIcon style={{transform: 'rotate(180deg)', fontSize:'initial'}}/>
          </div>
        </div>
      )}
    </Box>
  )
}
export default Reply
