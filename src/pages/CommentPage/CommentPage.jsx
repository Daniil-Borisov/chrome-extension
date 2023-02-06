import { Box } from '@mui/system'
import React, { useCallback, useContext, useEffect, useRef, useState } from 'react'
import '../../Assets/css/scss/Common.scss'
import { AppContext } from '../../context/AppContext'
import { CommentContext } from '../../context/CommentsContext'
import Comment from './Comment/Comment'
import './Comment/Comment.scss'
import './CommentPage.scss'
import CommentsUtils from './CommentPageUtil';
import InputBar from './InputBar/InputBar'
import SkeletonComment from './SkeletonComment/SkeletonComment'
import ModalWindow from "../../Components/ModalWindow/ModalWindow";
import ErrorImg from '../../Assets/Images/Icons/error.svg'
import { LOG } from '../../Utils/debug';

const CommentPage = (props) => {
  const [readMoreActiveFor, setReadMoreActiveFor] = useState(null)
  const [expandCommentFor, setExpandCommentActiveFor] = useState(null)
  const [replyData, setIsReplyClick] = useState({ isReplyClick: false, commentId: null, replyTo: null })
  const [reloadComments, setReloadComments] = useState(false);
  const [reloadReply, setReloadReply] = useState({ id: '', reload: false })
  // const [lastElement, setLastElement] = useState(null);

  const { appState, setAppState } = useContext(AppContext)
  const { comments, getAllUserComments, isCommentsLoading, error } = useContext(CommentContext)

  const { secondsToTime, secondToHours } = CommentsUtils()

  const setReadMoreCurrentUser = (id) => setReadMoreActiveFor(id)
  const setExpandCommentForCurrentUser = (id) => setExpandCommentActiveFor(id)

  const handleReplyClick = (value) => setIsReplyClick(value)
  const observer = useRef()

  useEffect(()=>{
    props.getStyles()
  })

  const lastCommentElement = useCallback(node => {
    if (observer.current) observer.current.disconnect()
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting) {
        LOG(4, 'CommentPage - lastCommentElement:isIntersecting', comments);
        getAllUserComments(appState?.web_id, comments[comments.length - 1]?.id, appState.googleUser ? appState.googleUser.uid : '')
      }
    })
    if (node) observer.current.observe(node)
  }, [comments]);

  useEffect(async() => {
    if(appState.googleUser && appState.googleUser.uid && appState?.web_id){
      setTimeout(async () => {
        await getAllUserComments(appState?.web_id, null, appState.googleUser ? appState.googleUser.uid : '')
      }, 100);
    }
  }, [appState.googleUser])

  useEffect(() => {
    if (reloadComments) {
      LOG(4, 'CommentPage - getcomments reloadComments', appState.googleUser);
      getAllUserComments(appState?.web_id, null, appState.googleUser ? appState.googleUser.uid : '');
    }
    setReloadComments(false);

  }, [reloadComments])

  return (
    <Box className="iffy-commentPage">
      <div className="iffy-content">
        <div className="iffy-scrollContainer" style={{ paddingBottom: '3rem' }}>
          {!isCommentsLoading ?
            comments.length > 0 && comments?.map((comment, index) => (
              <div
                key={comment.id}
                ref={comments.length === index + 1 ? lastCommentElement : null}
                className={comments.length === index + 1 ? "lastCommentElement" : null}
              >
                <Comment
                  key={comment.id}
                  id={comment.id}
                  title={comment.title}
                  gifId={comment.giffs || []}
                  attachments={comment.attachments}
                  first={comment.user_name || ''}
                  last={comment.last_name}
                  username={comment.user_id}
                  text={comment.data}
                  rating={comment.ratings}
                  photo={comment.user_image}
                  userEmoji={comment.user_emoji}
                  date={comment.date}
                  selected={true}
                  readMoreActive={comment.id === readMoreActiveFor}
                  setReadMoreFor={setReadMoreCurrentUser}
                  expandComment={comment.id === expandCommentFor}
                  setExpandCommentFor={setExpandCommentForCurrentUser}
                  numOfReplies={comment.num_replies}
                  reactions={comment.reactions}
                  isComment={true}
                  commentId={comment.id}
                  isReplyClicked={handleReplyClick}
                  replyBoxData={replyData}
                  // eslint-disable-next-line no-underscore-dangle
                  commentDate={secondsToTime(comment?.createdDate?._seconds)}
                  // eslint-disable-next-line no-underscore-dangle
                  commentTime={secondToHours(comment?.createdDate?._seconds)}
                  reloadReply={reloadReply}
                  setReloadReply={setReloadReply}
                  setReloadComments = {setReloadComments}
                />
              </div>)) : (
              <>
                <SkeletonComment />
                <SkeletonComment />
                <SkeletonComment />
              </>)}
          {!isCommentsLoading && comments.length === 0 && !error &&
            <h2 className='iffy-h2 iffy-center'>What do you want other iffyers to know?</h2>
          }
          {!isCommentsLoading && error &&
            <ModalWindow>
              <img src={ErrorImg} alt="" />
              <h2 className='iffy-h2'>Reload</h2>
              <p className='iffy-p'>Something wrong with connection</p>
            </ModalWindow>
          }
        </div>
        <InputBar replyState={replyData} isReplyClicked={handleReplyClick} handleSubmit={setReloadComments} setReloadReply={setReloadReply} />
      </div>
    </Box>
  )
}

export default CommentPage