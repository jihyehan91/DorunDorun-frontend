import { useState } from 'react';

export default function Wordquiz() {
  const enAnswers = [
    {
      sentence: 'This is a sample sentence for shuffling',
      krTranslation: '이것은 셔플링을 위한 샘플 문장입니다',
      question: 'This a sentence sample is shuffling for'
    },
    {
      sentence: 'I love to eat pizza on Fridays',
      krTranslation: '나는 금요일에 피자를 먹는 것을 좋아합니다',
      question: 'Fridays pizza to on eat love I'
    },
    {
      sentence: 'He goes jogging in the park every morning',
      krTranslation: '그는 매일 아침 공원에서 조깅을 합니다',
      question: 'morning jogging park goes every in He the'
    },
    {
      sentence: 'We had a picnic by the river last weekend',
      krTranslation: '지난 주말에 우리는 강가에서 소풍을 했습니다',
      question: 'weekend river by picnic a had We last the'
    }
  ];

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0); // 현재 질문
  const [currentAnswer, setCurrentAnswer] = useState(enAnswers[currentQuestionIndex]); // 답변
  const [krAnswer, setKrAnswer] = useState(enAnswers[currentQuestionIndex].krTranslation); // 해석
  const [questionArr, setQuestionArr] = useState(enAnswers[currentQuestionIndex].question.split(' '));
  const [userAnswer, setUserAnswer] = useState('');
  const [wrongAnswer, setWrongAnswer] = useState(false);

  const checkAnswer = () => {
    if (userAnswer.trim() === '') {
      alert('답변을 입력해주세요!');
      return;
    }

    if (currentAnswer.sentence === userAnswer.trim()) {
      alert('정답입니다!');
      setUserAnswer('');
      setWrongAnswer(false);
      moveToNextQuestion();
      firework()
    } else {
      setWrongAnswer(true);
    }
  };

  const userAnswerHandler = (word : string) => {
    setUserAnswer((prevAnswer) => {
      if (prevAnswer === '') {
        return word;
      } else {
        return prevAnswer + (prevAnswer.endsWith(' ') ? '' : ' ') + word;
      }
    });
    setQuestionArr((prevArr) => prevArr.filter((val) => val !== word));
  };

  const moveToNextQuestion = () => {
    if (currentQuestionIndex < enAnswers.length - 1) {
      setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
      setCurrentAnswer(enAnswers[currentQuestionIndex + 1]);
      setQuestionArr(enAnswers[currentQuestionIndex + 1].question.split(' '));
      setKrAnswer(enAnswers[currentQuestionIndex + 1].krTranslation);
      setUserAnswer('');
      setWrongAnswer(false);
    } else {
      alert('모든 문제를 푸셨습니다!');
      setCurrentQuestionIndex(0);
      setCurrentAnswer(enAnswers[0]);
      setQuestionArr(enAnswers[0].question.split(' '));
      setKrAnswer(enAnswers[0].krTranslation);
      setUserAnswer('');
      setWrongAnswer(false);
    }
  };

  const undoClick = () => {
    setUserAnswer((prevAnswer) => {
      const words = prevAnswer.split(' ');
      words.pop();
      return words.join(' ');
    });
    setQuestionArr((prevArr) => [...prevArr, userAnswer.split(' ').pop()]);
  };

  const firework = () => {
    let duration = 20 * 100;
    let animationEnd = Date.now() + duration;
    let defaults = { startVelocity: 20, spread: 360, ticks: 100, zIndex: 0 };
    //  startVelocity: 범위, spread: 방향, ticks: 갯수
  
    function randomInRange(min, max) {
      return Math.random() * (max - min) + min;
    }
  
    let interval = setInterval(function () {
      let timeLeft = animationEnd - Date.now();
  
      if (timeLeft <= 0) {
        return clearInterval(interval);
      }
  
      let particleCount = 50 * (timeLeft / duration);
      // since particles fall down, start a bit higher than random
      confetti(
        Object.assign({}, defaults, {
          particleCount,
          origin: { x: randomInRange(-0.1, 0.3), y: Math.random() - 0.2 }
        })
      );
      confetti(
        Object.assign({}, defaults, {
          particleCount,
          origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 }
        })
      );
    }, 250);
  }

  return (
    <div className='mx-auto mt-10 text-center p-5 border border-[var(--border-divide-color)] shadow rounded-xl'>
      <p className='text-2xl font-semibold text-gray-800 mb-3 py-4'>
  <span className="bg-blue-100 px-2 py-1 rounded-lg shadow-md mr-2">{krAnswer}</span>
      </p>
      <input
  type='text'
  value={userAnswer}
  readOnly
  className='border border-gray-300 rounded-md px-4 py-2 mb-4 w-full max-w-md mx-auto focus:outline-none focus:ring-2 focus:ring-blue-500 font-semibold'
  style={{ fontSize: '16px', color: 'blue', backgroundColor: '#f4f4f4', textAlign : 'center' }}
/>

      <div className='flex flex-wrap justify-center'>
        {questionArr.map((val, index) => (
          <span
            key={index}
            onClick={() => userAnswerHandler(val)}
            className='bg-gray-200 px-4 py-2 rounded-md text-sm m-1 cursor-pointer'
          >
            {val}
          </span>
        ))}
      </div>

      {!wrongAnswer && (
        <button
          onClick={checkAnswer}
          className='mt-8 bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded'
        >
          확인
        </button>
      )}

      {wrongAnswer && (
        <div className='mt-4'>
          <h1 className='text-red-600'>틀렸습니다.</h1>
          <strong>
            정답은 <span className='text-blue-500'>'{currentAnswer.sentence}'</span>입니다.
          </strong>
        </div>
      )}

      {wrongAnswer && (
        <button
          onClick={moveToNextQuestion}
          className='mt-4 bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded'
        >
          다음 문제
        </button>
      )}

      {userAnswer && !wrongAnswer && (
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
