import { Gif } from '@giphy/react-components'
import { Grid, Carousel } from '@giphy/react-components'
import GiphyIcon from '../../../Assets/Images/Icons/giphy.svg'
import useGiphy from './useGiphy'
import { GiphyFetch } from '@giphy/js-fetch-api'
import { IGif } from "@giphy/js-types";
import { Avatar, Stack } from '@mui/material'
import { default as EmojiPicker } from 'emoji-picker-react'
import { getDownloadURL, uploadBytes, ref } from 'firebase/storage'
import React, {useCallback, useEffect, useState} from 'react'
import { EmojiObject } from '../../../../types'
import AddImageLogo from '../../../Assets/Images/Icons/AddImageLogo.svg'
import closeIcon from '../../../Assets/Images/Icons/close-icon.svg'
import AddIcon from '../../../Assets/Images/Icons/addIcon.svg'
import CloseReactions from '../../../Assets/Images/Icons/closeReactions.svg'
import SearchGif from '../../../Assets/Images/Icons/SearchGif.svg'
import HeaderUtils from '../../../Components/Header/HeaderUtils'
import { storage } from '../../../firebase-config'
import CommentsUtils from '../CommentPageUtil'
import AddUserReviewUtil from './AddUserReviewUtils'
import logo from '../../../Assets/Images/Logo/logo.svg'
import Reactions from "../../../Components/Reactions/Reactions";
import SearchIcon from '../../../Assets/Images/Icons/search.svg'
import IconButton from "@mui/material/IconButton";
import Dropzone from "../../../Components/Dropzone/Dropzone";
import { REACTIONS } from '../../../Components/Reactions/REACTIONS_EMOJI'
import { LOG } from '../../../Utils/debug';
import './InputBar.scss'
import useClickOutside from "../../../hooks/useClickOutside";
import ModalWindow from '../../../Components/ModalWindow/ModalWindow'
import ErrorImg from '../../../Assets/Images/Icons/error.svg'

const placeholder = 'PRESS ENTER TO SEND'

export const InputBar: React.FC = (props: any) => {
  const [inputValue, setInputValue] = useState<any>('')
  const [showEmojiesReaction, setShowEmojiesReaction] = useState<boolean>(false)
  const [showGifPicker, setShowGifPicker] = useState<boolean>(false)
  const [showEmojiPicker, setShowEmojiPicker] = useState<boolean>(false)
  const [selectedFile, setSelectedFile] = useState<any>(null)
  const [attachments, setAttachments] = useState<any>([])
  const [isSearch, setIsSearch] = useState<boolean>(false)
  const [searchValue, setSearchValue] = useState<string>('')
  const [selectedGif, setSelectedGif] = useState<any>('')
  // const [gifs, setGifs] = useState<any>([])
  const [searchTerm, setSearchTerm] = useState<any>([])
  const [searchingGif, setSearchingGif] = useState<any>([])
  const [isOpenDropzone, setIsOpenDropzone] = useState<boolean>(false)
  const [userEmoji, setUserEmoji] = useState<any>('')
  const [gifPickerElement, setGifPickerElement] = useState<any>(null)
  const [dropzoneElement, setDropzoneElement] = useState<any>(null)
  const [emojieReactionElement, setEmojieReactionElement] = useState<any>(null)
  const [openGifPickerBtn, setOpenGifPickerBtn] = useState<any>(null)
  const [openDropzoneBtn, setOpenDropzoneBtn] = useState<any>(null)
  const [emojiReactionNoCloseElement, setEmojiReactionNoCloseElement] = useState<any>(null)
  const [incorrectFileFormat, setIncorrectFileFormat] = useState<any>(null)

  const gf = new GiphyFetch('gBqFkQxHw776QjRbeat56wf3ub2CMj0u');
  const fetchGifs = (offset: number) => gf.trending({ offset, limit: 10 })
  const searchGifs = (offset: number) => gf.search(searchTerm, { offset, limit: 10 })
  // const [fetchGifs, searchGifs] = useGiphy()
  const { postComment } = AddUserReviewUtil()
  const { fetchNumOfPeople, userProfiles, visitorNum } = HeaderUtils()
  const [isMounted, setIsMounted] = useState<boolean>(false)
  
  const STORAGE_MEDIA_FOLDER = 'media';
  const { postReply } = CommentsUtils();
  const [warning, setWarning] = useState<any>('')

  const gifPickerRef = useCallback((element)=>{
    setGifPickerElement(element)
  },[])
  const openGifButtonRef = useCallback((element)=>{
    setOpenGifPickerBtn(element)
  },[])
  const dropZoneRef = useCallback((element)=>{
    setDropzoneElement(element)
  },[])
  const openDropzoneBtnRef = useCallback((element)=>{
    setOpenDropzoneBtn(element)
  },[])
  const emojiReactionRef = useCallback((element)=>{
    setEmojieReactionElement(element)
  },[])
  const emojiReactionNoCloseRef = useCallback((element)=>{
    setEmojiReactionNoCloseElement(element)
  },[])

  useClickOutside(gifPickerElement, openGifPickerBtn, showGifPicker, setShowGifPicker, )
  useClickOutside(dropzoneElement, openDropzoneBtn, isOpenDropzone, setIsOpenDropzone )
  useClickOutside(emojieReactionElement, emojiReactionNoCloseElement, showEmojiesReaction, setShowEmojiesReaction )

  // const handleGifFetch = async () => {
  //   LOG(4, "InputBar - handleGifFetch");
  //   const { data } = await fetchGifs()
  //   // setGifs(data)
  // }
  // const handleGifSearch = async (searchValue: string) => {
  //   const { data } = await searchGifs(searchValue)
  //   LOG(4, "InputBar - handleGifSearch", data);
  //   setSearchTerm(data);
  //   // setGifs(data)
  // }

  const handleEmojiesReactionVisibility: () => void = () => {
    LOG(4, "InputBar - handleEmojiesReactionVisibility");
    setShowGifPicker(false);
    setSearchingGif(false);
    setShowEmojiPicker(false);
    setShowEmojiesReaction(!showEmojiesReaction);
  }

  const handleGifSearchVisibility: () => void = () => {
    LOG(4, "InputBar - handleGifSearchVisibility");
    // handleGifFetch()
    setShowGifPicker(!showGifPicker);
    setSearchingGif(false);
  }

  const handleDropZoneVisibility: () => void = () =>{
    setIsOpenDropzone(!isOpenDropzone)
    setShowEmojiesReaction(false);
  }
  
  const handleGIFSelect = (gif: IGif, event: any) => {
    LOG(4, "InputBar - handleGIFSelect", gif);
    event.preventDefault()
    setSelectedGif(gif)
    setShowGifPicker(false)
    setShowGifPicker(false)
  }

  const handleSearchEnter: (event: any) => void = (event) => {
    LOG(4, "InputBar - handleSearchEnter ", searchValue, searchingGif);
    if (searchValue)
      setSearchingGif(true);
    else
      setSearchingGif(false);
    
    setSearchTerm(searchValue);
    // if (event.key === 'Enter') handleGifSearch(searchValue)
    // if (event.key === 'x' || event.keyCode === 8) handleGifFetch();
  }
  
  const handleSearchInput: (event: any) => void = (event) => setSearchValue(event.target.value)
  
  const handleChooseEmoji = (index: number) => (event: any) => {
    LOG(4, "InputBar - handleChooseEmoji");
    setUserEmoji(index + 1)
    setShowEmojiesReaction(false)
  }
  
  const onEmojiClick = (event: any, emojiObject: EmojiObject) => {
    LOG(4, "InputBar - onEmojiClick");
    setInputValue(`${inputValue}${emojiObject.emoji}`);
    setShowEmojiPicker(false);
  }

  const handleInput: (event: any) => void = (event) => {
    LOG(4, "InputBar - handleInput");
    setInputValue(event.currentTarget.textContent);
  }

  const handleFocus: (event: any) => void = (event) => {
    LOG(4, "InputBar - handleFocus");
    !inputValue && (event.currentTarget.textContent = '')
    if (!userEmoji){
      // setWarning('Pick a reaction from the left!')
      // showWarning()
      setShowEmojiesReaction(true);
    }
  }

  const handleBlur: (event: any) => void = (event) => {
    LOG(4, "InputBar - handleBlur");
    (!inputValue) && (event.currentTarget.textContent = placeholder)
    setWarning('')
  }
 
  const handleFileSelect: (event: any) => void = (event) => {
    const file = event[0]
    console.log(file);
    if (!file){
      setIncorrectFileFormat(true)
      setIsOpenDropzone(false)
      return
    }
    const storageRef = ref(
      storage,
      `/${STORAGE_MEDIA_FOLDER}/${new Date().getTime()}-${file.name}`
    )
    
    uploadBytes(storageRef, file).then((snapshot) => {
      getDownloadURL(storageRef).then((url: any) => {
        setAttachments([...attachments, url])
      })
      setIsOpenDropzone(false)
    })
  }

  const removeSelectedFile: (attachmentName: string) => void = (attachmentName: string) => {
    const updatedAttachments = attachments.filter(
      (attachment: any) => attachment !== attachmentName
    );
    setAttachments(updatedAttachments);
  }

  const handleEnter: (event: any) => void = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      LOG(4, "InputBar - handleEnter ", inputValue);
      if (!userEmoji){
        setWarning('You can’t send message without reaction!')
        showWarning()
        return
      }
      postComment(inputValue, attachments, selectedGif, userEmoji, props.fetchCmntDataFromZero, props.handleSubmit);
      setInputValue('');
      setAttachments([]);
      setSelectedGif('');
      e.currentTarget.textContent = ''
      setUserEmoji('')
    }
  }

  const handleReplyEnter: (event: any) => void = async (e) => {
    if (e.key === 'Enter') {
      LOG(4, "InputBar - handleReplyEnter ", inputValue, props.replyState.commentId);
      e.preventDefault()
      e.currentTarget.textContent = '';
      await postReply(props.replyState.commentId, inputValue);
      props.isReplyClicked({ isReplyClick: false, commentId: null, replyTo: null });
      props.handleSubmit(true)
      const timer = setTimeout(() => {
        LOG(4, "InputBar - set reload");
        props.setReloadReply({id: props.replyState.commentId, reload: true});
      }, 300);
      setInputValue('');
    }
  }

  const showWarning = () => {
    setTimeout(()=> {
      setWarning('')
    }, 5000)
  }
  
  useEffect(() => {
    setIsMounted(true)
    LOG(4, "InputBar - fetchNumOfPeople");
    fetchNumOfPeople()
    return () => setIsMounted(false);
  },[])
  
  return (
    <>
      <div className="iffy-comment-input">
        <div className="iffy-comment-input-main">
          <div className="iffy-comment-input-wrapper" ref={emojiReactionNoCloseRef}>
            {props.replyState.isReplyClick ? (
              <div className="iffy-replyTo-bar">
                Reply to <span className="iffy-userName">@{props.replyState.replyTo}</span>
              </div>
            ) : null}
            {warning && (<p className='iffy-warning-message'>{warning}</p>)}
            <div className="iffy-comment-input__emojies-reaction" >
              <button
                onClick={handleEmojiesReactionVisibility}
                className="iffy-comment-input__emojies-reaction-button"
              >
                {userEmoji ? <img src={REACTIONS[userEmoji-1]} alt="" /> :
                    showEmojiesReaction ? <img className="iffy-comment-input__emojies-reaction-logo" src={CloseReactions}/> :
                                          <img className="iffy-comment-input__emojies-reaction-logo" src={AddIcon}/>}
              </button>
              {showEmojiesReaction && !props.replyState.isReplyClick && (
                <Reactions handleCLick={handleChooseEmoji} emojiReactionRef={emojiReactionRef}/>
              )}
            </div>
            <div className='iffy-input-emulation'>
              <div className="iffy-comment-input__actions" >
                <IconButton onClick={handleDropZoneVisibility} className="iffy-comment-input__image-picker" ref={openDropzoneBtnRef}>
                  <img className={`${showEmojiesReaction ? 'iffy-opacity-50' : ''}`} src={AddImageLogo} alt="add image" />
                </IconButton>
                <IconButton onClick={handleGifSearchVisibility} className="iffy-comment-input__action-button" ref={openGifButtonRef}>
                  <img className={`${showEmojiesReaction ? 'iffy-opacity-50' : ''}`} src={SearchGif} alt="search gif logo" />
                </IconButton>
              </div>
              <p contentEditable={true}
                  onKeyDown={(e) => props.replyState.isReplyClick ? handleReplyEnter(e) : handleEnter(e)}
                  onInput={handleInput}
                  onFocus={handleFocus}
                  onBlur={handleBlur}
                  className={`iffy-comment-input__input ${inputValue && 'iffy-input-active'}`}
                  suppressContentEditableWarning={true}
              >
                {placeholder}
              </p>
            </div>
          </div>

          {showGifPicker && (
            <div className="iffy-comment-input__picker-container" ref={gifPickerRef}>
              <p>powered by <img src={GiphyIcon} alt=""/></p>
              <div className="iffy-inputWrapper">
                <img src={SearchIcon} alt=""/>
                <input
                  type="text"
                  placeholder="Search Gifs..."
                  value={searchValue}
                  onChange={handleSearchInput}
                  onKeyUp={handleSearchEnter}
                />
              </div>
              <div className="iffy-comment-input__gifs">
                {searchingGif ?
                  <Grid width={280} columns={2} fetchGifs={searchGifs} gutter={6} hideAttribution={true} onGifClick={(gif,e) => {handleGIFSelect(gif,e)}} key={searchTerm}/> :
                  <Grid width={280} columns={2} fetchGifs={fetchGifs} gutter={6} hideAttribution={true} onGifClick={(gif,e) => {handleGIFSelect(gif,e)}}/>
                }
                </div>
            </div>
          )}
          {showEmojiPicker && <EmojiPicker onEmojiClick={onEmojiClick} />}
          {attachments.length > 0 && (
            <div className="iffy-comment-input__attachments">
              {attachments.map((attachment: any) => (
                <div key={attachment} className="iffy-comment-input__attachment">
                  <div
                    className="iffy-comment-input__attachment-delete"
                    onClick={() => removeSelectedFile(attachment)}
                  >
                    <img src={closeIcon} alt="close icon" />
                  </div>
                  <img src={attachment} alt="image" />
                </div>
              ))}
            </div>
          )}
          {selectedGif && <div style={{position: "relative"}}>
            <div
                className="iffy-comment-input__attachment-delete"
                onClick={() => setSelectedGif('')}
            >
              <img src={closeIcon} alt="close icon" />
            </div>
            <Gif key={selectedGif.id} gif={selectedGif} width={200} hideAttribution={true} noLink={true}/>
          </div>}
        </div>
        <Stack className="iffy-imagesWrapper">
          <img src={logo} alt="" className="iffy-footer_logo"/>
          <div className="iffy-avatars_wrapper">
            <div className="iffy-avatars">
              {isMounted ? userProfiles.map((item, i) => (
                <Avatar
                  style={{ left: (i + 1) * 11 }}
                  className={'iffy-avatar'}
                  key={i}
                  alt="Remy Sharp"
                  src={item.user_image}
                />
              )) : null}
            </div>
            <div className="iffy-visitorColumn">
              <h4><strong>{isMounted ? visitorNum : null}</strong> iffing</h4>
            </div>
          </div>
        </Stack>
      </div>
      {isOpenDropzone &&
          <div className='iffy-modal-window' >
            <div className="iffy-content" ref={dropZoneRef}>
              <Dropzone  onDrop={handleFileSelect}/>
            </div>
          </div>
      }
      {incorrectFileFormat && 
        <ModalWindow setOpen={() => setIncorrectFileFormat(false)}>
          <img src={ErrorImg} alt="" />
          <h2 className='iffy-h2'>Incorrect File Format</h2>
          <p className='iffy-error'>Something wrong with format</p>
        </ModalWindow>
      }
    </>
  )
}

export default InputBar
