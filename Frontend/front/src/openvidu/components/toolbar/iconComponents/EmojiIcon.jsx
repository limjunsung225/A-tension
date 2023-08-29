import React from 'react';
import emoji from './img/emojiIcon.png';

const EmojiIcon = () => {
  return (
    <img src={emoji} alt="아이콘" style={{ width: '32px', height: '32px' }} />
  );
};

export default EmojiIcon;
