import { useState, useEffect } from "react";
import { LuRepeat } from "react-icons/lu";
import { HiSpeakerWave } from "react-icons/hi2";
import { FaArrowLeft } from "react-icons/fa6";
import { useParams } from "react-router-dom";
import axios from "axios";

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
  const [sentences, setSentences] = useState<Sentence[]>([]);
  const [selectedSentenceData, setSelectedSentenceData] =
    useState<PreviewData | null>(null);
  const { id: urlID } = useParams<{ id: string }>();

  async function getLearningSentence() {
    try {
      const level = "lv" + urlID![5];
      const response = await axios.get(
        "https://43.203.227.36.sslip.io/server/learn",
        {
          params: { course: level },
        }
      );
      await setSentences(response.data); //여기서 잘못 들어갔거나.... 배열문제일지도.
      console.log("response.data222", response.data);
      console.log("sentences22 :", sentences);
    } catch (error) {
      console.error("getLearningSentence 받기 에러", error);
    }
  }
  //Number(missionId.split('_')[0].substring(2))
  async function getAiExample(sentence: Sentence) {
    console.log("sentence_input in getAiExample:", sentence);
    try {
      //여기서 호성's 로딩 페이지 넣기.
      const response = await axios.get(
        "https://43.203.227.36.sslip.io/server/practice/getPractice",
        {
          params: {
            expression: sentence.mission,
            meaning: sentence.meaning,
            level: Number(sentence.missionId.split("_")[0].substring(2)),
          },
        }
      );
      //끝나면 로딩 끝
      console.log(response.data);
      setSelectedSentenceData(response.data);
    } catch (error) {
      console.error("getAiExample 받기 실패", error);
    }
  }

  useEffect(() => {
    getLearningSentence();
  }, []);

  useEffect(() => {
    console.log("sentences22 :", sentences);
    getAiExample(sentences[0]);
  }, [sentences]);

  // 문장 패턴 클릭하면 예문 보이기
  // const sentenceHandler = (clickedSentence: string) => {
  //   const foundSentenceData = levelData.find(
  //     (item) => item.sentence === clickedSentence
  //   );
  //   if (foundSentenceData) {
  //     setSelectedSentenceData(foundSentenceData);
  //   }
  // };

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
                      <LuRepeat
                        onClick={() => {
                          console.log("sentence0", sentences[0].mission);
                          console.log("sentence1", sentences[1].mission);
                          console.log("sentence2", sentences[2].mission);
                          const index = sentences.findIndex(
                            (sentence) =>
                              sentence.mission ===
                              selectedSentenceData?.sentence
                          );
                          console.log(selectedSentenceData.sentence);
                          console.log("몇번째?", index);
                          getAiExample(sentences[index]);
                        }}
                      />
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
                  <p className="english">{selectedSentenceData.dialogue[0]}</p>
                  <p className="korean">
                    {selectedSentenceData.dialogue_translation[0]}
                  </p>
                  <p className="english">{selectedSentenceData.dialogue[1]}</p>
                  <p className="korean">
                    {selectedSentenceData.dialogue_translation[1]}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* 지혜님 이부분은 학습 완료처리가 된 애들만 푸 랑 대화할때 미션 리스트에 정렬되도록 체크 해주는 부분이에요. 세연님이랑 소통할 부분이니까 그러려니 하십시옹. css 건드시는건 아무 상관 없습니다.*/}
        <button
          onClick={async () => {
            const index = sentences.findIndex(
              (sentence) => sentence.mission === selectedSentenceData?.sentence
            );
            await axios
              .post("https://43.203.227.36.sslip.io/server/missionComplete", {
                mission_id: sentences[index].missionId,
              })
              .then
              //뭔가 부트스트랩 체크표시 같은 애니메이션 효과..?
              ();
          }}
        >
          학습 완료
        </button>

        <div className="three-sentence-area">
          <h3 className="sentence-sub-title">하루 3문장</h3>
          <ul>
            {sentences.map((sentence, i) => (
              <li
                key={i}
                onClick={() => {
                  getAiExample(sentence);
                }}
              >
                <span className="number-btn">{i + 1}</span>
                <span>{sentence.mission}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
