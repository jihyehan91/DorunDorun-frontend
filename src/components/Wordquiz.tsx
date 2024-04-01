import { useState } from 'react';
import useUserData from './UserData';

export default function Wordquiz() {
  const [showQuestions, setShowQuestions] = useState(false);
  const { userCheck } = useUserData(); 

  //LEVEL 1
  const enAnswers = [
    {
      sentence: 'This is a sample sentence for shuffling',
      krTranslation: '이것은 셔플링을 위한 샘플 문장입니다',
      question: 'This a sentence sample is shuffling for',
    },
    {
      sentence: '그는 오늘 학교에 가지 않았어요.',
      krTranslation: 'He did not go to school today.',
      question: 'not to today go school did He',
    },
    {
      sentence: 'She is a very talented singer.',
      krTranslation: '그녀는 매우 재능 있는 가수입니다.',
      question: 'a talented is very singer She',
    },
    {
      sentence: 'I like to drink coffee in the morning.',
      krTranslation: '저는 아침에 커피를 마시는 것을 좋아합니다.',
      question: 'like drink to morning in coffee I',
    },
    {
      sentence: 'The cat chased the mouse around the house.',
      krTranslation: '고양이가 집 주변에서 쥐를 쫓았습니다.',
      question: 'the around chased the cat mouse house the',
    },
  ];

  //LEVEL 2
  const enAnswers_lv2 = [
    {
      sentence: 'Despite the rain, they decided to go hiking in the mountains.',
      krTranslation: '비가 오는데도 불구하고, 그들은 산에 하이킹을 가기로 결정했습니다.',
      question: 'the Despite hiking decided to they in go rain mountains the',
    },
    {
      sentence: 'The scientist conducted a series of experiments to test their hypothesis.',
      krTranslation: '과학자는 그들의 가설을 실험하기 위한 일련의 실험을 진행했습니다.',
      question: 'hypothesis series test to conducted their scientist a experiments of The',
    },
    {
      sentence: 'After a long day at work, she treated herself to a relaxing bubble bath.',
      krTranslation: '긴 하루 일한 후, 그녀는 스스로를 편안한 거품 목욕으로 보답했습니다.',
      question: 'work relaxing bath bubble a to treated at day herself After long she',
    },
    {
      sentence: 'In order to succeed, one must be willing to embrace failure as part of the journey.',
      krTranslation: '성공하기 위해서는, 실패를 여정의 일부로 받아들일 준비가 되어야 합니다.',
      question: 'the embrace as part to one must willing journey. In order failure succeed, of be',
    },
    {
      sentence: 'Despite the language barrier, they managed to communicate effectively through gestures.',
      krTranslation: '언어 장벽에도 불구하고, 그들은 몸짓을 통해 효과적으로 의사 소통을 성공했습니다.',
      question: 'the communicate Despite gestures. to through language they effectively managed barrier,',
    },
  ];
  

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0); // 현재 질문
  const [currentAnswer, setCurrentAnswer] = useState(
    enAnswers[currentQuestionIndex]
  ); // 답변
  const [krAnswer, setKrAnswer] = useState(
    enAnswers[currentQuestionIndex].krTranslation
  ); // 해석
  const [questionArr, setQuestionArr] = useState(
    enAnswers[currentQuestionIndex].question.split(' ')
  ); //문제 종합
  const [userAnswer, setUserAnswer] = useState(''); //내 답변
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
