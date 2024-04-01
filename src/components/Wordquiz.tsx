import { useState } from 'react';
import { firework } from '../utils/firework';
import { enAnswersData, enAnswersLv2Data } from '../utils/word';

export default function Wordquiz() {
  const [showQuestions, setShowQuestions] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0); // 현재 질문
  const [currentLevel, setCurrentLevel] = useState(1); // 현재 레벨
  const [enAnswers, setEnAnswers] = useState(enAnswersData); // LEVEL 1
  const [enAnswers_lv2, setEnAnswers_lv2] = useState(enAnswersLv2Data); // LEVEL 2
  const [currentAnswer, setCurrentAnswer] = useState(enAnswers[currentQuestionIndex]); // 답변
  const [krAnswer, setKrAnswer] = useState(enAnswers[currentQuestionIndex].krTranslation); // 해석
  const [questionArr, setQuestionArr] = useState(enAnswers[currentQuestionIndex].question.split(' ')); // 문제 종합
  const [userAnswer, setUserAnswer] = useState(''); // 내 답변
  const [wrongAnswer, setWrongAnswer] = useState(false); // 틀리면 나오는

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

  const userAnswerHandler = (word) => {
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
      // 모든 문제를 푼 경우
      if (currentLevel === 1) {
        alert('모든 Level 1 문제를 푸셨습니다! Level 2로 이동합니다.');
        setCurrentLevel(2);
        setEnAnswers(enAnswers_lv2);
        setCurrentQuestionIndex(0);
        setCurrentAnswer(enAnswers_lv2[0]);
        setQuestionArr(enAnswers_lv2[0].question.split(' '));
        setKrAnswer(enAnswers_lv2[0].krTranslation);
        setUserAnswer('');
        setWrongAnswer(false);
      } else {
        alert('모든 문제를 푸셨습니다!');
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
              color: 'var(--highlight-color)',
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
