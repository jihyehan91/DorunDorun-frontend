import { useState } from 'react';
import useUserData from './UserData';

export default function Wordquiz() {
  const [showQuestions, setShowQuestions] = useState(false);
  const { userCheck } = useUserData(); 

  const [level, setLevel] = useState(1);
  const enAnswers = level === 1 ? enAnswers_lv1 : enAnswers_lv2;

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [currentAnswer, setCurrentAnswer] = useState(enAnswers[currentQuestionIndex]);
  const [krAnswer, setKrAnswer] = useState(currentAnswer.krTranslation);
  const [questionArr, setQuestionArr] = useState(currentAnswer.question.split(' '));
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
      firework();
    } else {
      setWrongAnswer(true);
    }
  };

  const userAnswerHandler = (word: string) => {
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
      if (level === 1) {
        if (window.confirm('레벨 1을 완료하셨습니다. 레벨 2로 넘어가시겠습니까?')) {
          setLevel(2);
          setCurrentQuestionIndex(0);
          setCurrentAnswer(enAnswers_lv2[0]);
          setQuestionArr(enAnswers_lv2[0].question.split(' '));
          setKrAnswer(enAnswers_lv2[0].krTranslation);
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
      } else {
        alert('모든 문제를 푸셨습니다!');
        setCurrentQuestionIndex(0);
        setCurrentAnswer(enAnswers[0]);
        setQuestionArr(enAnswers[0].question.split(' '));
        setKrAnswer(enAnswers[0].krTranslation);
        setUserAnswer('');
        setWrongAnswer(false);
      }
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
          origin: { x: randomInRange(-0.1, 0.3), y: Math.random() - 0.2 },
        })
      );
      confetti(
        Object.assign({}, defaults, {
          particleCount,
          origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
        })
      );
    }, 250);
  };

  return (
    <div className='mx-auto text-center py-10 border border-[var(--border-divide-color)] shadow rounded-xl'>
      {!showQuestions && (
        <div className='text-center'>
          <h2 className='text-2xl mb-4'>문장 완성</h2>
          <p className='text-lg text-[var(--sub-font-color)] mb-4'>
            단어들을 클릭해서 문장을 완성해보세요~
          </p>
          <button
            type='button'
            onClick={() => setShowQuestions(true)}
            className='mt-8 inline-block bg-gray-300 py-2 px-6 rounded-lg transition duration-300 ease-in-out transform'
          >
            시작
          </button>
        </div>
      )}

      {showQuestions && (
        <div>
          <p className='text-2xl font-semibold text-gray-800 mb-3 py-4'>
            <span className='bg-blue-100 px-2 py-1 rounded-lg shadow-md mr-2'>
              {krAnswer}
            </span>
          </p>
          <input
            type='text'
            value={userAnswer}
            readOnly
            className='border border-gray-300 rounded-md px-4 py-2 mb-4 w-full max-w-md mx-auto focus:outline-none focus:ring-2 focus:ring-blue-500 font-semibold'
            style={{
              fontSize: '16px',
              color: 'blue',
              backgroundColor: '#f4f4f4',
              textAlign: 'center',
            }}
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
                정답은{' '}
                <span className='text-blue-500'>
                  '{currentAnswer.sentence}'
                </span>
                입니다.
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
      )}
    </div>
  );
}
