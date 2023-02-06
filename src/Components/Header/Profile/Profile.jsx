import { CircularProgress, Container, Stack } from '@mui/material'
import IconButton from "@mui/material/IconButton";
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage'
import React, { useCallback, useContext, useEffect, useState } from 'react'
import { useDropzone } from 'react-dropzone';
import { storage } from '../../../firebase-config'
import { AppContext } from '../../../context/AppContext'
import ProfilePageUtils from "../../../pages/ProfilePage/ProfilePageUtils";
import UserName from "../../UserName/UserName";
import '../../../layout/Components.scss'
import UserInfo from "../UserInfo/UserInfo";
import ReviewWritten from '../../../Assets/Images/Icons/review_written.svg'
import TotalViews from '../../../Assets/Images/Icons/eye.svg'
import HelpfulReview from '../../../Assets/Images/Icons/helpful_review.svg'
import Star from '../../../Assets/Images/Icons/star.svg'
import ReactionsReview from '../../../Assets/Images/Icons/reactions_review.svg'

const STORAGE_PROFILE_FOLDER = 'profile'

const Profile = () => {
  const [file, setFile] = useState('')
  const [loading, setLoading] = useState(false)
  const [openUserInfo, setOpenUserInfo] = useState(false)
  const { appState } = useContext(AppContext)

  const { updateUser } = ProfilePageUtils();
    const onDrop = useCallback(
    (acceptedFiles) => {
      if (!acceptedFiles.length) {
        return
      }
      setLoading(true)

      const imageFile = acceptedFiles[0]
      const extractedExt = imageFile.name.split('.').pop()
      const storageRef = ref(storage, `/${STORAGE_PROFILE_FOLDER}/${appState.googleUser.uid}.${extractedExt}`)

      uploadBytes(storageRef, imageFile)
        .then((snapshot) => {
          const profileImage = ref(
            storage,
            `/${STORAGE_PROFILE_FOLDER}/${appState.googleUser.uid}.${extractedExt}`
          )

          if (!profileImage) {
            return
          }
          getDownloadURL(ref(storage, profileImage))
            .then((url) => {
              updateUser(null, url);
            })
            .finally(() => {
              setLoading(false);
            });


          setFile(
            Object.assign(imageFile, {
              preview: URL.createObjectURL(imageFile),
            })
          )
        })
        .finally(() => setLoading(false))
    },
    [file]
  )

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: 'image/jpg,image/jpeg',
    multiple: false,
  });

  return (
    <Container className="iffy-headerProfile">
      <Stack direction="column" justifyContent="space-between" alignItems="center" spacing={2}>
        <Stack alignItems="center">
          <Container>
            <Stack>
              <div {...getRootProps()} className='iffy-avatarWrapper'>
                <input {...getInputProps()} />
                {loading ? (
                  <CircularProgress />
                ) : (
                  <img
                    src={file?.preview ? file?.preview : appState.googleUser?.photoURL}
                    alt="Profile"
                    width="70px"
                    height="70px"
                  />
                )}
              </div>
              <UserName name={appState.googleUser?.displayName} updateUser={updateUser}/>
              <span>Since 06.03.22</span>
            </Stack>
            <IconButton className='iffy-userInfo'
              onClick={()=>setOpenUserInfo(!openUserInfo)}
            >
              <h4>User Info</h4>
              <KeyboardArrowDownIcon/>
            </IconButton>
          </Container>
        </Stack>
      </Stack>
      {openUserInfo && 
      <Stack>
        <UserInfo icon={ReviewWritten} text='Review Written' count='62'/>
        <UserInfo icon={TotalViews} text='Total Views' count='1,567'/>
        <UserInfo icon={HelpfulReview} text='Helpful Review' count='16'/>
        <UserInfo icon={Star} text='Shop you iffed' count='24'/>
        <UserInfo icon={ReactionsReview} text='Reactions you shared' count='535'/>
      </Stack>
      }
    </Container>
  )
}

export default Profile;
