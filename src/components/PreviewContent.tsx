import { useState, useEffect } from 'react';
import { LuRepeat } from 'react-icons/lu';
import { HiSpeakerWave } from 'react-icons/hi2';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Spinner from './Spinner';

interface Sentence {
  meaning: string;
  mission: string;
  missionId: string;
  learned: boolean;
}

interface PreviewData {
  id: string;
  no: number;
  sentence: string;
  sentence_translation: string;
  similar: string[];
  similar_translation: string[];
  dialogue: string[];
  dialogue_translation: string[];
  used: boolean;
}

export default function PreviewContent() {
  // 로딩
  const [isLoading, setIsLoading] = useState(true);
  // 응답 데이터 담기
  const [sentences, setSentences] = useState<Sentence[]>([]);
  // 하루 3문장 선택한 문장 담기
  const [selectedSentenceData, setSelectedSentenceData] =
    useState<PreviewData | null>(null);
  const { id: urlID } = useParams<{ id: string }>();
  const navigate = useNavigate();

  // 학습하기에서 학습한 문장 받아오기
  async function getLearningSentence() {
    try {
      const level = 'lv' + urlID![5];
      const response = await axios.get(
        'https://43.203.227.36.sslip.io/server/learn',
        {
          params: { course: level },
        }
      );
      if (!response.data) {
        if (
          confirm(
            `${urlID} 에서의 학습을 모두 완료했습니다! 캐릭터와 배운 표현을 사용해보세요.`
          )
        ) {
          navigate('/chat');
        }
        return;
      }
      await setSentences(response.data);
    } catch (error) {
      console.error('getLearningSentence 받기 에러', error);
    }
  }

  // AI한테 하루 3문장 관련 예문 받아오기
  async function getAiExample(sentence: Sentence) {
    try {
      setIsLoading(true);
      const response = await axios.get(
        'https://43.203.227.36.sslip.io/server/practice/getPractice',
        {
          params: {
            expression: sentence.mission,
            meaning: sentence.meaning,
            level: Number(sentence.missionId.split('_')[0].substring(2)),
          },
        }
      );
      setSelectedSentenceData(response.data);
    } catch (error) {
      console.error('getAiExample 받기 실패', error);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    getLearningSentence();
  }, []);

  useEffect(() => {
    if (sentences.length > 0 && !sentences[0].learned) {
      getAiExample(sentences[0]);
    }
  }, [sentences]);

  // 학습완료 버튼
  const handleLearnedButtonClick = async () => {
    try {
      const index = sentences.findIndex(
        (sentence) =>
          sentence.mission === selectedSentenceData?.sentence.substring(5)
      );
      await axios.post('https://43.203.227.36.sslip.io/server/learned', {
        mission_id: sentences[index].missionId,
      });

      const updatedSentences = [...sentences];
      updatedSentences[index] = {
        ...updatedSentences[index],
        learned: true,
      };
      await setSentences(updatedSentences);

      // 미학습 문장 확인하기
      const remainingUnlearnedSentences = updatedSentences.filter(
        (sentence) => !sentence.learned
      );
      if (remainingUnlearnedSentences.length === 0) {
        if (
          confirm('오늘 학습 완료! 캐릭터와 오늘 배운 내용을 사용해보세요!')
        ) {
          navigate('/chat');
        }
      } else {
        const nextUnlearnedSentence = remainingUnlearnedSentences[0];
        getAiExample(nextUnlearnedSentence);
      }
    } catch (error) {
      console.error('학습 완료 처리 실패', error);
    }
  };

  return (
    <section className='preview-sentence'>
      <div className='preview-sentence-container'>
        {/* 예문 불러오기 로딩 알림 */}
        {isLoading ? (
          <div className='flex m-auto w-2/3 h-1/3 justify-center items-center mt-10 mb-20'>
            <Spinner loadingText='AI가 예문을 생성중...' />
          </div>
        ) : (
          <div className='sample-sentence-area'>
            <div className='key-sentence-english'>
              <p>{selectedSentenceData && selectedSentenceData.sentence}</p>
              <p>
                {selectedSentenceData &&
                  selectedSentenceData.sentence_translation}
              </p>
            </div>
            {/* 예시 구문 - 3문장 랜덤 반복 출력 */}
            <div className='sample-sentence'>
              {selectedSentenceData && (
                <div className='example' key={selectedSentenceData.id}>
                  <div className='pattern-sentence'>
                    <div className='flex p-0'>
                      <p className='sentence-sub-title'>문장 패턴</p>
                      <button type='button'>
                        <LuRepeat
                          onClick={() => {
                            const index = sentences.findIndex(
                              (sentence) =>
                                sentence.mission ===
                                selectedSentenceData?.sentence.substring(5)
                            );
                            getAiExample(sentences[index]);
                          }}
                        />
                      </button>
                      {/* <button type='button'>
                        <HiSpeakerWave />
                      </button> */}
                    </div>
                    <ul>
                      {selectedSentenceData.similar.map((similar, index) => (
                        <li key={index}>
                          <p className='english'>{similar}</p>
                          <p className='korean'>
                            {selectedSentenceData.similar_translation[index]}
                          </p>
                        </li>
                      ))}
                    </ul>
                  </div>
                  {/* 예시 대화문 - A,B 1세트 */}
                  <div className='dialog'>
                    <p className='sentence-sub-title'>대화문</p>
                    <p className='english'>
                      {selectedSentenceData.dialogue[0]}
                    </p>
                    <p className='korean'>
                      {selectedSentenceData.dialogue_translation[0]}
                    </p>
                    <p className='english'>
                      {selectedSentenceData.dialogue[1]}
                    </p>
                    <p className='korean'>
                      {selectedSentenceData.dialogue_translation[1]}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
        {/* 학습완료 내역 대화창 미션 리스트에 정렬시키기 */}
        <button
          type='button'
          className='bg-[var(--highlight-color)] text-white'
          onClick={async () => {
            handleLearnedButtonClick();
          }}
        >
          학습 완료
        </button>

        <div className='three-sentence-area'>
          <h3 className='sentence-sub-title'>하루 3문장</h3>
          <ul>
            {sentences.map((sentence, i) => (
              <li
                key={i}
                onClick={() => {
                  getAiExample(sentence);
                }}
              >
                <span
                  className={`number-btn cursor-pointer ${
                    sentence.learned ? 'active' : ''
                  }`}
                >
                  {i + 1}
                </span>
                <span>{sentence.mission}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
