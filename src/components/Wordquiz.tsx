import { useState } from 'react';

export default function Wordquiz() {
  const enAnswers = [
    {
      sentence: 'This is a sample sentence for shuffling',
      krTranslation: '이것은 셔플링을 위한 샘플 문장입니다'
    },
    {
      sentence: 'I love to eat pizza on Fridays',
      krTranslation: '나는 금요일에 피자를 먹는 것을 좋아합니다'
    },
    {
      sentence: 'The cat chased the mouse around the house',//해결 힘듬...
      krTranslation: '고양이가 집 주위를 쥐를 쫓았습니다'
    },
    {
      sentence: 'He goes jogging in the park every morning',
      krTranslation: '그는 매일 아침 공원에서 조깅을 합니다'
    },
    {
      sentence: 'We had a picnic by the river last weekend',
      krTranslation: '지난 주말에 우리는 강가에서 소풍을 했습니다'
    }
  ];

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [currentAnswer, setCurrentAnswer] = useState(enAnswers[currentQuestionIndex]);
  const [krAnswer, setKrAnswer] = useState(enAnswers[currentQuestionIndex].krTranslation);
  const [newArr, setNewArr] = useState(currentAnswer.sentence.split(' '));
  const [userAnswer, setUserAnswer] = useState('');
  const [correctAnswer, setCorrectAnswer] = useState(false);
  const [showUndoButton, setShowUndoButton] = useState(false);

  const checkAnswer = () => {
    if (currentAnswer.sentence === userAnswer) {
      alert('정답입니다!');
      firework();
      setShowUndoButton(false);
      setUserAnswer('');
      setCorrectAnswer(false);
      if (currentQuestionIndex < enAnswers.length - 1) {
        setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
        setCurrentAnswer(enAnswers[currentQuestionIndex + 1]);
        setNewArr(enAnswers[currentQuestionIndex + 1].sentence.split(' '));
        setKrAnswer(enAnswers[currentQuestionIndex + 1].krTranslation);
      } else {
        alert('모든 문제를 푸셨습니다!');
        setCurrentQuestionIndex(0);
        setCurrentAnswer(enAnswers[0]);
        setNewArr(enAnswers[0].sentence.split(' '));
        setKrAnswer(enAnswers[0].krTranslation);
      }
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
    setShowUndoButton(true);
  };

  const undoClick = () => {
    setUserAnswer((prevAnswer) => {
      const words = prevAnswer.split(' ');
      words.pop();
      return words.join(' ');
    });
    setNewArr((prevArr) => [...prevArr, userAnswer.split(' ').pop()]);
    setShowUndoButton(false);
  };

  // const firework = () => {
  //   var duration = 20 * 100;
  //   var animationEnd = Date.now() + duration;
  //   var defaults = { startVelocity: 20, spread: 360, ticks: 100, zIndex: 0 };
  //   //  startVelocity: 범위, spread: 방향, ticks: 갯수

  //   function randomInRange(min, max) {
  //     return Math.random() * (max - min) + min;
  //   }

  //   var interval = setInterval(function () {
  //     var timeLeft = animationEnd - Date.now();

  //     if (timeLeft <= 0) {
  //       return clearInterval(interval);
  //     }

  //     var particleCount = 50 * (timeLeft / duration);
  //     // since particles fall down, start a bit higher than random
  //     confetti(
  //       Object.assign({}, defaults, {
  //         particleCount,
  //         origin: { x: randomInRange(-0.1, 0.3), y: Math.random() - 0.2 },
  //       })
  //     );
  //     confetti(
  //       Object.assign({}, defaults, {
  //         particleCount,
  //         origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
  //       })
  //     );
  //   }, 250);
  // }
  // };

  return (
    <div className='mx-auto mt-10 text-center p-5 border border-[var(--border-divide-color)] shadow rounded-xl'>
      <p className='text-xl mb-4'>{krAnswer}</p>
      <input
        type='text'
        value={userAnswer}
        readOnly
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
            정답은 <span className='text-blue-500'>'{currentAnswer.sentence}'</span>입니다.
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
