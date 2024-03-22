import { useState } from 'react';

export default function Wordquiz() {
  const krAnswer = '해석 : 이것은 셔플링에 대한 샘플 문장입니다';
  const enAnswer = 'This is a sample sentence for shuffling';
  const [newArr, setNewArr] = useState(enAnswer.split(' '));
  const [userAnswer, setUserAnswer] = useState('');
  const [correctAnswer, setCorrectAnswer] = useState(false);
  const [clickedWords, setClickedWords] = useState([]);
  const [showUndoButton, setShowUndoButton] = useState(false);

  const checkAnswer = () => {
    if (enAnswer === userAnswer) {
      alert('정답입니다!');
      // firework(); // 이 부분은 정의되지 않았으므로 주석 처리했습니다.
      setShowUndoButton(false);
      setUserAnswer('아래 버튼을 눌러 다음 문제로 넘어가시오');
    } else {
      alert('오답입니다.');
      setCorrectAnswer(true);
      setShowUndoButton(true);
    }
  };

  const userAnswerHandler = (word) => {
    setUserAnswer((prevAnswer) => {
      if (prevAnswer === '') {
        return word;
      } else {
        return prevAnswer + (prevAnswer.endsWith(' ') ? '' : ' ') + word;
      }
    });
    setNewArr((prevArr) => prevArr.filter((val) => val !== word));
    setClickedWords((prevClickedWords) => [...prevClickedWords, word]);
    setShowUndoButton(true);
  };

  const undoClick = () => {
    if (clickedWords.length > 0) {
      const lastClickedWord = clickedWords[clickedWords.length - 1];
      setUserAnswer((prevAnswer) => {
        const regex = new RegExp(`\\b${lastClickedWord}\\b`);
        return prevAnswer.replace(regex, '').trim();
      });
      setNewArr((prevArr) => [...prevArr, lastClickedWord]);
      setClickedWords((prevClickedWords) => prevClickedWords.slice(0, -1));
      if (clickedWords.length === 1) {
        setShowUndoButton(false);
      }
    }
  };

  return (
    <div className='mx-auto mt-10 text-center p-5 border-2'>
      <p className='text-xl mb-4'>{krAnswer}</p>
      <input
        type='text'
        value={userAnswer}
        onChange={(e) => setUserAnswer(e.target.value)}
        className='border border-gray-300 rounded-md px-4 py-2 mb-4 w-full max-w-md mx-auto'
      />

      <div className='flex flex-wrap justify-center'>
        {newArr.map((val, index) => (
          <span
            key={index}
            onClick={() => userAnswerHandler(val)}
            className='bg-gray-200 px-4 py-2 rounded-md text-sm m-1 cursor-pointer'
          >
            {val}
          </span>
        ))}
      </div>

      <button
        onClick={checkAnswer}
        className='mt-8 bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded'
      >
        확인
      </button>

      {correctAnswer && (
        <div className='mt-4'>
          <h1 className='text-red-600'>틀렸습니다.</h1>
          <strong>
            정답은 <span className='text-blue-500'>'{enAnswer}'</span>입니다.
          </strong>
        </div>
      )}

      {showUndoButton && (
        <button
          onClick={undoClick}
          className='mt-4 bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded'
        >
          되돌리기
        </button>
      )}
    </div>
  );
}
