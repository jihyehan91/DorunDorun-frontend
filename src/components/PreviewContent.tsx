import { useState, useEffect } from 'react';
import { LuRepeat } from 'react-icons/lu';
import { HiSpeakerWave } from 'react-icons/hi2';
import { FaArrowLeft } from 'react-icons/fa6';
import datas from '../../datas.json';
import { useParams } from 'react-router-dom';

interface Sentence {
  speaker: string;
  text: string;
}

interface PreviewData {
  id: string;
  no: number;
  sentence: string;
  sentence_translation: string;
  similar: string[];
  similar_translation: string[];
  dialogue: Sentence[];
  dialogue_translation: Sentence[];
  used: boolean;
}

export default function PreviewContent() {
  const [levelData, setLevelData] = useState<PreviewData[]>([]);
  const [sentences, setSentences] = useState<string[]>([]);
  const [selectedSentenceData, setSelectedSentenceData] =
    useState<PreviewData | null>(null);
  const { id: urlID } = useParams<{ id: string }>();

  useEffect(() => {
    const fetchData = async () => {
      // 여기서 실제 API 호출이 이루어져야 하지만, 현재는 데이터를 직접 가져옴
      const dummyData = datas.level;

      // URL의 id와 데이터의 id가 일치하는 것만 필터링하여 설정
      const filteredData = dummyData.filter((data) => data.id === urlID);
      setLevelData(filteredData);
    };

    fetchData();
  }, [urlID]);

  useEffect(() => {
    if (levelData.length > 0) {
      const availableSentences = levelData
        .filter((sentence) => !sentence.used)
        .map((sentence) => sentence.sentence);
      const selectedSentences: string[] = [];
      while (selectedSentences.length < 3 && availableSentences.length > 0) {
        const randomIndex = Math.floor(
          Math.random() * availableSentences.length
        );
        const randomSentence = availableSentences[randomIndex];
        selectedSentences.push(randomSentence);
        availableSentences.splice(randomIndex, 1);
      }
      setSentences(selectedSentences);

      // 페이지가 처음 로드될 때 첫 번째 문장을 자동으로 클릭
      if (selectedSentences.length > 0) {
        sentenceHandler(selectedSentences[0]);
      }
    }
  }, [levelData]);

  // 문장 패턴 클릭하면 예문 보이기
  const sentenceHandler = (clickedSentence: string) => {
    const foundSentenceData = levelData.find(
      (item) => item.sentence === clickedSentence
    );
    if (foundSentenceData) {
      setSelectedSentenceData(foundSentenceData);
    }
  };

  // 새로운 랜덤 문장 선택 및 렌더링 함수
  const handleNewRandomSentence = () => {
    const availableSentences = levelData
      .filter((sentence) => !sentence.used)
      .map((sentence) => sentence.sentence);
    const randomIndex = Math.floor(Math.random() * availableSentences.length);
    const randomSentence = availableSentences[randomIndex];
    sentenceHandler(randomSentence);
  };

  return (
    <section className='preview-sentence'>
      <div className='container'>
        {/* 하루3문장 연결 탭 */}
        <button type='button' className='exit-btn'>
          <FaArrowLeft />
        </button>
        <div className='sample-sentence-area'>
          {/* 랜덤으로 선택된 문장들 렌더링 */}
          <p>{selectedSentenceData && selectedSentenceData.sentence}</p>
          {/* 예시 대화문 */}
          <div className='sample-sentence'>
            <div className='preview-text-btn'>
              <span className='sentence-sub-title'>예문</span>
              <button type='button' onClick={handleNewRandomSentence}>
                <LuRepeat />
              </button>
              <button type='button'>
                <HiSpeakerWave />
              </button>
            </div>
            {selectedSentenceData && (
              <div className='example' key={selectedSentenceData.id}>
                <div>
                  <p>문장 패턴</p>
                  <ul>
                    {selectedSentenceData.similar.map((similar, index) => (
                      <li key={index}>
                        <p>{similar}</p>
                        <p>{selectedSentenceData.similar_translation[index]}</p>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className='dialog'>
                  <br />
                  <br />
                  <p>대화문</p>
                  <p className='dialog-english'>
                    {selectedSentenceData.dialogue[0].text}
                  </p>
                  <p className='dialog-korea'>
                    {selectedSentenceData.dialogue_translation[0].text}
                  </p>
                  <p className='dialog-english'>
                    {selectedSentenceData.dialogue[1].text}
                  </p>
                  <p className='dialog-korea'>
                    {selectedSentenceData.dialogue_translation[1].text}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
        {/* 하루 3구문 */}
        <div className='three-sentence-area'>
          <h3 className='sentence-sub-title'>하루 3문장</h3>
          <ul>
            {sentences.map((sentence, i) => (
              <li key={i} onClick={() => sentenceHandler(sentence)}>
                {i + 1}. {sentence}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
