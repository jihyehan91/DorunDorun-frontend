import { useState, useEffect } from "react";
import { LuRepeat } from "react-icons/lu";
import { HiSpeakerWave } from "react-icons/hi2";
import { FaArrowLeft } from "react-icons/fa6";
import { useParams } from "react-router-dom";
import datas from "../../datas.json";
import axios from "axios";

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

interface Params {
  expression: string;
  meaning: string;
  level: Number;
}

export default function PreviewContent() {
  const [levelData, setLevelData] = useState<PreviewData[]>([]);
  const [sentences, setSentences] = useState<string[]>([]);
  const [selectedSentenceData, setSelectedSentenceData] =
    useState<PreviewData | null>(null);
  const { id: urlID } = useParams<{ id: string }>();
  // const [params, setParams] = useState();

  const setParamData = () => {};
  const data = [
    {
      mission_id: "lv1_1",
      mission: "I am trying to",
      meaning: "~ 해 보려고 하는 중이에요",
      complete: false,
    },
    {
      mission_id: "lv1_2",
      mission: "I am ready to",
      meaning: "~ 할 준비가 되었어요",
      complete: false,
    },
    {
      mission_id: "lv1_3",
      mission: "I am just about to",
      meaning: "지금 막 ~ 하려는 참이에요",
      complete: false,
    },
  ];
  async function getLearningSentence() {
    try {
      const level = "lv" + urlID![5];
      const response = await axios.get(
        "https://43.203.227.36.sslip.io/server/learn",
        {
          params: { course: level },
        }
      );
      console.log(response.data);
      // setMissions(response.data);
    } catch (error) {
      console.error("Fetch and play audio error:", error);
    }
  }

  useEffect(() => {
    getLearningSentence();
  }, []);
  useEffect(() => {
    const fetchData = async () => {
      // 더미데이터 > 나중에 api 호출
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

  // 뒤로가기 버튼
  const backHandler = () => {
    window.history.back();
    // 탭이 있다면 예문 탭이 보이게
  };

  return (
    <section className="preview-sentence">
      <div className="preview-sentence-container">
        <button
          className="exit-btn"
          type="button"
          onClick={backHandler}
          aria-label="뒤로가기"
        >
          <FaArrowLeft />
        </button>
        <div className="sample-sentence-area">
          {/* 랜덤으로 선택된 문장들 렌더링 */}
          <div className="key-sentence-english">
            <p>{selectedSentenceData && selectedSentenceData.sentence}</p>
            <p>
              {selectedSentenceData &&
                selectedSentenceData.sentence_translation}
            </p>
          </div>
          {/* 예시 대화문 */}
          <div className="sample-sentence">
            {selectedSentenceData && (
              <div className="example" key={selectedSentenceData.id}>
                <div className="pattern-sentence">
                  <div className="flex p-0">
                    <p className="sentence-sub-title">문장 패턴</p>
                    <button type="button">
                      <LuRepeat />
                    </button>
                    <button type="button">
                      <HiSpeakerWave />
                    </button>
                  </div>
                  <ul>
                    {selectedSentenceData.similar.map((similar, index) => (
                      <li key={index}>
                        <p className="english">{similar}</p>
                        <p className="korean">
                          {selectedSentenceData.similar_translation[index]}
                        </p>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="dialog">
                  <p className="sentence-sub-title">대화문</p>
                  <p className="english">
                    {selectedSentenceData.dialogue[0].text}
                  </p>
                  <p className="korean">
                    {selectedSentenceData.dialogue_translation[0].text}
                  </p>
                  <p className="english">
                    {selectedSentenceData.dialogue[1].text}
                  </p>
                  <p className="korean">
                    {selectedSentenceData.dialogue_translation[1].text}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
        <div className="three-sentence-area">
          <h3 className="sentence-sub-title">하루 3문장</h3>
          <ul>
            {sentences.map((sentence, i) => (
              <li key={i} onClick={() => sentenceHandler(sentence)}>
                <span className="number-btn">{i + 1}</span>
                <span>{sentence}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
