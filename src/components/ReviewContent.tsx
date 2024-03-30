import { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { IoArrowForward } from 'react-icons/io5';
import '../assets/css/reviewContent.css';
import datas from '../../datas.json';

interface Message {
  speaker: string;
  message: string;
}

interface ConversationData {
  id: string;
  messages: Message[];
  wrongSentence: string;
  correctedSentence: string;
}

export default function ReviewContent() {
  // 임시 데이터
  // const dummyData = datas.chat;

  const { id } = useParams<{ id: string }>();
  // const [conversationData, setConversationData] =
  //   useState<ConversationData | null>(null);
  // const [conversationData, setConversationData] = useState(dummyData);
  // const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get<ConversationData>(
          `https://43.203.227.36.sslip.io/server/message/getMessagesByRoomid`,
          { params: { roomid: id } }
        );
        console.log(response.data);

        // setConversationData(response.data);
      } catch (error) {
        console.error('Error fetching conversation data:', error);
        // setError('대화 데이터를 가져오는 도중 오류가 발생했습니다.');
      }
    };

    fetchData();
  }, [id]);

  // if (error) {
  //   return <div>{error}</div>; // 에러 메시지 표시
  // }

  // if (!conversationData) {
  //   return <div>대화를 찾을 수 없습니다.</div>;
  // }

  // const { messages, wrongSentence, correctedSentence } = conversationData;

  return (
    <div className='list-talk1'>
      {/* <div className='history'>
        <ul>
          {messages.map((talkMessage, i) => (
            <li
              key={i}
              className={talkMessage.speaker === 'user' ? 'user' : 'ai'}
            >
              <div className='profile'>
                <img
                  src={
                    talkMessage.speaker === 'user'
                      ? '/user-default.png'
                      : '/image1.png'
                  }
                  alt='프로필 이미지'
                />
              </div>
              <div className='info'>
                <div className='name'>
                  {talkMessage.speaker === 'user' ? '사용자' : 'AI'}
                </div>
                {talkMessage.message === wrongSentence ? (
                  <div className='message'>
                    <div style={{ color: 'red' }} className='wrong-sentence'>
                      {talkMessage.message}
                    </div>
                    <div className='corrected-sentence'>
                      <IoArrowForward />
                      {correctedSentence}
                    </div>
                  </div>
                ) : (
                  <div className='message'>{talkMessage.message}</div>
                )}
              </div>
            </li>
          ))}
        </ul>
      </div> */}
    </div>
  );
}
