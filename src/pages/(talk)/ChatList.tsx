import React from 'react';
import {AuthUser} from '../Talk'; // Mission 인터페이스를 가져옴

interface ChatHistoryProps {
  talkMessages: string[];
  userInfo: AuthUser;
  characterInfo: Character[];
}

interface Character {
  id: string;
  name: string;
  img: string;
  desc: string;
}

export const ChatHistory: React.FC<ChatHistoryProps> = ({ talkMessages, userInfo, characterInfo }) => {
  return (
    <ul className={talkMessages.length === 0 ? 'h-full' : ''}>
      {talkMessages.length === 0 ? (
        <li key={0} className="h-full !m-0 flex justify-center items-center">
          대화 내역이 아직 없습니다.
        </li>
      ) : (
        talkMessages.map((talkMessage, i) => {
          return (
            <li key={i} className={talkMessage?.includes('user:') ? 'user' : 'ai'}>
              <div className="profile">
                <img src={talkMessage?.includes('user:') ? '/user-default.png' : characterInfo[0]?.img} alt="" />
              </div>
              <div className="info">
                <div className="name">
                  {talkMessage?.includes('user:') ? (userInfo?.result ? userInfo.nickname : '사용자') : talkMessage.split(': ')[0]}
                </div>
                <div className="msg">{talkMessage.split(': ')[1]}</div>
              </div>
            </li>
          );
        })
      )}
    </ul>
  );
};
