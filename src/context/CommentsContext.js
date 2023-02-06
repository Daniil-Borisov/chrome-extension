import React, { useState, createContext } from 'react'
import { LOG } from '../Utils/debug';

export const CommentContext = createContext()

export const CommentProvider = ({ children }) => {
  const [comments, setComments] = useState([])
  const [isCommentsLoading, setIsCommentsLoading] = useState(true)
  const [error, setError] = useState('')

  const getAllUserComments = (webId, lastId, userId) => {
    if (userId && webId) {
      chrome.runtime.sendMessage({
        from: "CS",
        action: "getcomments",
        data: { web_id: webId, last_id: lastId, user_id: userId }
      }, ({ res, err }) => {
        const lastErr = chrome.runtime.lastError;
        if (lastErr) {
          LOG(2, `CommentProvider - getAllUserComments:lastError: ${JSON.stringify(lastErr)}`);
        } else if (res) {
          const { data } = res;
          LOG(4, "CommentProvider - getAllUserComments:res ", data);
          let updatedComments = [];
          if (Array.isArray(data)) {
            if (!lastId) updatedComments = data
            else updatedComments = [...comments, ...data]


            // if (!lastId) 
            //   updatedComments = data
            // else
            //   updatedComments = [...comments, ...data]
            updatedComments = updatedComments.map((item) => {
              const ratings = 3;
              return {
                ...item,
                ratings,
                first_name: item.first_name || '',
                last_name: item.last_name || '',
                title: item.data || 'Review Title 23',
              }
            })

            setComments(updatedComments)
          } else {
            updatedComments = comments;
          }
          setIsCommentsLoading(false)
        } else if (err) {
          LOG(2, 'CommentProvider - getAllUserComments:error in api', error)
          setError('Some error occured')
          setIsCommentsLoading(false)
        }
      });
    } else {
      LOG(2, 'CommentProvider - getAllUserComments: UserId or webIds missing!')
    }
  }
  const setAllUserComments = (data) => setComments(data)

  return (
    // eslint-disable-next-line react/jsx-no-constructed-context-values
    <CommentContext.Provider value={{ comments, getAllUserComments, setAllUserComments, isCommentsLoading, error }}>
      {children}
    </CommentContext.Provider>
  )
}