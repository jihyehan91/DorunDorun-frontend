import { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { IoArrowForward } from 'react-icons/io5';
import '../assets/css/reviewContent.css';
// import datas from '../../datas.json';

interface ConversationData {
  id: string;
  roomid: string;
  userid: string;
  ai: string;
  createdAt: number[];
  userSpeaking: boolean;
  grammarValid: boolean;
  correctedContent: string;
  content: string;
}

export default function ReviewContent() {
  // 임시 데이터
  // const dummyData = datas.chat;

  const { id } = useParams<{ id: string }>();
  const [conversationData, setConversationData] = useState<
    ConversationData[] | null
  >(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get<ConversationData[]>(
          `https://43.203.227.36.sslip.io/server/message/getMessagesByRoomid`,
          { params: { roomid: id } }
        );
        setConversationData(response.data);
      } catch (error) {
        console.error('error', error);
        setError('대화 데이터를 가져오는 도중 오류가 발생했습니다.');
      }
    };

    fetchData();
  }, [id]);

  if (error) {
    return <div>{error}</div>; // 에러 메시지 표시
  }

  if (!conversationData) {
    return <div>대화를 찾을 수 없습니다.</div>;
  }

  return (
    <div className='list-talk' >
      <div className='history !min-h-none !max-h-none'>
        <ul>
          {conversationData.map((talkMessage, i) => (
            <li
              key={i}
              className={talkMessage.userSpeaking === true ? 'user' : 'ai'}
            >
              <div className='profile'>
                <img
                  src={
                    talkMessage.userSpeaking === false
                      ? '/image1.png'
                      : '/user-default.png'
                  }
                  alt='프로필 이미지'
                />
              </div>
              <div className='info'>
                <div className='name'>
                  {talkMessage.userSpeaking === true ? '사용자' : 'AI'}
                </div>
                {talkMessage.grammarValid ? (
                  <div className='message'>{talkMessage.content}</div>
                ) : (
                  <div className='message'>
                    <div style={{ color: 'red' }} className='wrong-sentence'>
                      {talkMessage.content}
                    </div>
                    <div className='corrected-sentence'>
                      <IoArrowForward />
                      {talkMessage.correctedContent}
                    </div>
                  </div>
                )}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
