import EditIcon from '@mui/icons-material/Edit'
import React, { useState } from 'react'
import './username.scss'

const UserName = ({ name, updateUser }) => {
  const [username, setUsername] = useState(name)
  const [editMode, setEditMode] = useState(false)

  return (
    <div className="iffy-usernameWrapper">
      {editMode ? (
        <>
          <input
            value={username}
            onChange={(e) => {
              setUsername(e.target.value);
            }}
          />
          <button
            type="button"
            onClick={() => {
              setEditMode(false);
              updateUser(username, null);
            }}
          >
            save
          </button>
        </>
      ) : (
        <>
          <h4>{username}</h4>
          <EditIcon
            className="iffy-usernameEditIcon"
            onClick={() => {
              setEditMode(true);
            }}
          />
        </>
      )}
    </div>
  )
}

export default UserName
