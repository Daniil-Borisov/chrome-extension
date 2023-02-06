import { GiphyFetch } from '@giphy/js-fetch-api'
import { Gif } from '@giphy/react-components'
import { Card, CardContent, Popover, Stack } from '@mui/material'
import { Box } from '@mui/system'
import Picker from 'emoji-picker-react'
import React, {useCallback, useContext, useEffect, useState} from 'react'
import more from '../../../Assets/Images/Icons/more.svg'
import share from '../../../Assets/Images/Icons/share.svg'
import { CommentContext } from '../../../context/CommentsContext'
import CommentsUtils from '../CommentPageUtil'
import AttachmentsGallery from './AttachmentsGallery/AttachmentsGallery'
import './Comment.scss'
import EmojiReaction from './Emoji/EmojiReaction'
import Reply from './Reply/Reply'
import './Reply/Reply.scss'
import reactionIcon from '../../../Assets/Images/Icons/emodjiLogo.svg'
import { REACTIONS } from '../../../Components/Reactions/REACTIONS_EMOJI'
import { LOG } from '../../../Utils/debug';
import useClickOutside from "../../../hooks/useClickOutside";

const BASE_URL = process.env.REACT_APP_GIPHY_API_KEY
const gf = new GiphyFetch(BASE_URL)

const Comment = ({
  id,
  first,
  last,
  photo,
  userEmoji,
  title,
  numOfReplies,
  reactions,
  isComment,
  commentId,
  isReply,
  parentReplies,
  setParentReplies,
  commentDate,
  commentTime,
  replyBoxData,
  isReplyClicked,
  gifId,
  attachments,
  reloadReply,
  setReloadReply,
  setReloadComments
}) => {
  const [emojiPopup, openEmoji] = useState(false)
  const [anchorEl, setAnchorEl] = useState(null)
  const [replyBox, setReplyBox] = useState(null)
  const [gif, setGif] = useState(null)
  const [emojiPickerElement, setEmojiPickerElement] = useState(null)
  const [emojiPickerBtn, setEmojiPickerBtn] = useState(null)
  const emojiPickerRef = useCallback((element)=>{
    setEmojiPickerElement(element)
  },[])
  const emojiPickerBtnRef = useCallback((element)=>{
    setEmojiPickerBtn(element)
  },[])
  useClickOutside(emojiPickerElement, emojiPickerBtn, emojiPopup, openEmoji)

  const {
    setReplies,
    fetchReplies,
    replies,
    reactWithEmoji,
  } = CommentsUtils()

  const { setAllUserComments, comments } = useContext(CommentContext)
  const [openMoreBtns, setOpenMoreBtns] = useState(false)
  
  const handleEmojiSelect = (emoji) => {
    openEmoji(false)
    reactWithEmoji(
      emoji,
      commentId,
      isComment ? null : id, 
    )

    const updatedReplies = (isComment ? comments : parentReplies).map((r) => {
      const itemId = isComment ? commentId : id;

      if (r.id === itemId) {
        let reactionObj = {}

        if (r.reactions[emoji]?.me) {
          reactionObj = {
            count: (r.reactions[emoji]?.count || 0) - 1,
            me: false,
          };
        } else {
          reactionObj = {
            count: (r.reactions[emoji]?.count || 0) + 1,
            me: true,
          };
        }

        return {
          ...r,
          reactions: {
            ...r.reactions,
            [emoji]: reactionObj,
          },
        }
      }

      return r
    })

    if (!isComment) {
      setParentReplies(updatedReplies);
    } else {
      setAllUserComments(updatedReplies)
    }
  }

  const getGif = async (fetchId) => {
    try {
      LOG(4, 'Comment - getGif ', fetchId);
      const { data } = await gf.gif(fetchId)
      setGif(data)
    } catch (error) {
      LOG(2, 'Comment - getGif:error', error);
    }
  }

  useEffect(() => {
    if (!reloadReply || reloadReply.reload) {
      return;
    }
    
    LOG(4, 'Comment - loadComment:', id, gifId)
    setReplies([])
    fetchReplies(id, false)

    setReplyBox(replyBoxData)
    if (gifId && gifId.length > 0) {
      getGif(gifId);
    }
  }, [])

  useEffect(() => {
    if (reloadReply?.id !== id) {
      return;
    }
    if (reloadReply.reload){
      LOG(4, 'Comment - reloadReply:', reloadReply, id)
      fetchReplies(id, true)
      setReplyBox(replyBoxData)
      setReloadReply({id:'', reload: false})
    }
  }, [reloadReply])

  return (
    <div 
      className={`iffy-shortCommentWrapper iffy-short-comment ${isReply ? 'iffy-short-comment--reply' : ''}`}
      onMouseLeave={() => setOpenMoreBtns(false)}
      >
      <Card
        className="iffy-commentCard"
        classes={{ root: 'commentCardRoot' }}
        sx={{ border: isReply ? 0 : 2 }}
      >
        <CardContent className="iffy-commentCardContent">
          <Stack className="iffy-titleAndMoreOptions">
            {!isReply && (
              <div className="iffy-short-comment__comment-info">
                <div className="iffy-short-comment__type">
                  {userEmoji ?
                  <img alt="" src={REACTIONS[userEmoji - 1]}/> : <img src={photo} alt="sad onion" />}
                </div>
                <div className="iffy-short-comment__info">
                  <div className="iffy-short-comment__author">
                    {`${first} ${last}`}
                  </div>
                  <div className="iffy-short-comment__data">
                    {commentTime}  <span>{commentDate}</span>
                  </div>
                </div>
                </div>
            )}
            <Box
              className={`iffy-moreOptionsWrapper iffy-short-comment__actions ${
                isReply ? 'iffy-short-comment__actions--reply' : ''
              }`}
            >
              <div className="iffy-moreOptionsInnerWrapper">
                <div
                  className="iffy-short-comment__actions-icon"
                  onClick={(e) => {
                    isReplyClicked(
                      replyBoxData.commentId !== commentId ?
                      { isReplyClick: true, commentId, replyTo: `${first} ${last}` } :
                      { isReplyClick: false, commentId: null, replyTo: null }
                    );
                  }}
                >
                  <img src={share} alt="share" />
                </div>
                <div
                  ref={emojiPickerBtnRef}
                  className="iffy-short-comment__actions-icon"
                  onClick={(e) => {
                    openEmoji(!emojiPopup);
                  }}
                >
                  <img src={reactionIcon} alt="reaction" />
                </div>
              </div>
            </Box>
            <Box sx={{ width: 'fit-content', display: 'flex' }}>
              {isReply ? (
                <Box component="span" className="iffy-reviewTitle">
                  <Box sx={{ fontWeight: 600 }} className='iffy-reviewName' component="span">
                    {first}
                  </Box>
                  <div className="iffy-short-comment__data">
                    {commentTime}  <span>{commentDate}</span>
                  </div>
                  <Box>{title}</Box>
                </Box>
              ) : (
                <div className="iffy-reviewTitle">
                  <Box>{title}</Box>
                </div>
              )}
            </Box>
          </Stack>
          <div className="iffy-attachments-wrapper">
            {(attachments && attachments?.length > 0) && <AttachmentsGallery attachments={attachments}/>}
            <div className="iffy-gif-wrapper">
              {gif && <Gif gif={gif} height={170} hideAttribution={true} noLink={true}/>}
            </div>
          </div>
          <EmojiReaction
            emoji={emojiPopup}
            reactions={reactions}
            handleEmojiSelect={handleEmojiSelect}
          />

          {numOfReplies > 0 && (
            <Reply
              commentId={commentId}
              replies={replies}
              setReplies={setReplies}
            />
          )}
        </CardContent>
      </Card>
      {emojiPopup && <div className='iffy-picker' ref={emojiPickerRef}>
        <Picker
          onEmojiClick={(e, emojiObj) => {
            handleEmojiSelect(emojiObj.emoji);
          }}
        />
      </div>}
    </div>
  )
}

export default Comment
