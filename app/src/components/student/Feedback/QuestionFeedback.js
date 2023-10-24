import React from 'react';
import { FaGrinStars, FaSmile, FaMeh, FaFrown, FaAngry } from 'react-icons/fa';

const Questions = ({ questions, handleEmojiClick }) => {

  return (
    <div className="questions">
      {questions.map((question, index) => (
        <div className="question mb-4" key={index}>
          <p>{question.title}</p>
          <div className="emojis d-flex gap-4">
            <FaGrinStars
              size={30}
              className={`mr-3 cursor-pointer best ${question.star === 5 ? ' text-success' : ''}`}
              onClick={() => handleEmojiClick(question.id, 5)}
            />
            <FaSmile
              size={30}
              className={`mr-3 cursor-pointer good ${question.star === 4 ? ' text-success' : ''}`}
              onClick={() => handleEmojiClick(question.id, 4)}
            />
            <FaMeh
              size={30}
              className={`mr-3 cursor-pointer neutral ${question.star === 3 ? ' text-warning' : ''}`}
              onClick={() => handleEmojiClick(question.id, 3)}
            />
            <FaFrown
              size={30}
              className={`mr-3 cursor-pointer angry ${question.star === 2 ? ' text-danger' : ''}`}
              onClick={() => handleEmojiClick(question.id, 2)}
            />
            <FaAngry
              size={30}
              className={`mr-3 cursor-pointer worst ${question.star === 1 ? ' text-danger' : ''}`}
              onClick={() => handleEmojiClick(question.id, 1)}
            />
          </div>
         
        </div>
      ))}
    </div>
  );
};

export default Questions;
