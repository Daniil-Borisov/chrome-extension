import React from 'react';
import IconButton from "@mui/material/IconButton";
import { REACTIONS } from './REACTIONS_EMOJI';

const Reactions = ({handleCLick, emojiReactionRef}) => (
      <div className="iffy-comment-input__quick-emojies">
        <p>A comment with reaction is more fun!</p>
        <div className='iffy-reaction-wrapper' ref={emojiReactionRef}>
          {REACTIONS.map((item, index) => (
            <IconButton key={`reaction ${item}`} className='iffy-quick-emojies-button' onClick={handleCLick(index)}>
              <img  src={item} alt="reaction" />
            </IconButton>
          ))}
        </div>
      </div>
  );

export default Reactions;

