import React, { useContext } from 'react';
import '../Comment.scss'
import './EmojiReactions.scss'

const EmojiReaction = ({ emoji, reactions, handleEmojiSelect }) => {
  const emojiList = Object.keys(reactions)
    .map((r) => ({
      emoji: r,
      count: reactions[r].count,
      mine: reactions[r].me,
    }))
    .sort((r1, r2) => {
      if (r1.count < r2.count) {
        return 1
      } 
      if (r1.mine) {
        return -1
      } 
      if (r1.count > r2.count) {
        return -2
      } 
        return 0
    })
    .splice(0, 20)

  return (
    <div>
      <div className="iffy-emoji-reactions">
        {emojiList.map((em) => em.count > 0 && (
          <div
            className={`iffy-emoji-reactions__emoji ${em.mine? 'iffy-emoji-reactions__emoji-mine' : ''}`}
            key={em.emoji}
            onClick={() => handleEmojiSelect(em.emoji)}
          >
            <div className="iffy-emoji-reactions__emoji-count">{em.count}</div>
            <div className="iffy-emoji-reactions__emoji-icon">{em.emoji}</div>
          </div>))
        }
      </div>
    </div>
  )
}

export default EmojiReaction
