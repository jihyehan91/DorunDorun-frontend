import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import datas from '../../datas.json'; //임시 데이터

export const CharacterList = ({ data }) => {
  return (
    <ul className='list-char'>
      {data.map((article) => {
        return (
          <li key={article.id}>
            <Link
              to={`/talk/${article.id}`}
              className={article.id !== 'aaa111' ? `none` : null}
              onClick={(e) => article.id !== 'aaa111' && e.preventDefault()}
            >
              <div className='img'>
                <img src={article.img} alt='' />
              </div>
              <dl>
                <dt className='name'>{article.name}</dt>
                <dd className='text truncate-2'>{article.desc}</dd>
              </dl>
            </Link>
          </li>
        );
      })}
    </ul>
  );
};
export default function Chat() {
  const [account] = useState('test'); //로그인(인증)된 유저정보
  // const [account] = useState('undefined'); //로그인(인증)된 유저정보
  // const [likedList] = useState(datas.users.find((user) => user.userid === account).chats); //대화한 내역이라고 했는데 좋아요한 목록으로 교체 예정
  const [likedList, setLikedList] = useState([]); //대화한 내역이라고 했는데 좋아요한 목록으로 교체 예정
  // const [characterData] = useState(likedList.map(id => datas.characters.find(character => character.id === id))); //좋아요한 목록
  const [characterData, setCharacterData] = useState([]); //좋아요한 목록
  const [chracters] = useState(datas.characters); //임시

  useEffect(() => {
    if (account === undefined) {
      setLikedList([]);
    } else {
      const user = datas.users.find((user) => user.userId === account);
      if (user) {
        setLikedList(user.chats);
      }
      const characterData = likedList.map((id) =>
        datas.characters.find((character) => character.id === id)
      );
      if (characterData) {
        setCharacterData(characterData);
      }
    }
  }, [account, likedList]);

  function Choice() {
    return (
      <div className='banner item max-w-[600px] min-h-[250px]'>
        <div className='banner-text-area'>
          <h3>
            캐릭터를
            <br /> '좋아요' 해주세요
          </h3>
          <p className='banner-text'>
            캐릭터의 별표를
            <br /> 터치하면 해주세요
          </p>
        </div>
        <div className='img-box'>
          <img src='/image1.png' alt='' />
        </div>
      </div>
    );
  }

  return (
    <>
      <h2 className='list-title'>추천 캐릭터</h2>
      {account === 'undefined' ? (
        <Choice />
      ) : (
        <CharacterList data={characterData} />
      )}

      <h2 className='list-title'>전체 캐릭터</h2>
      <CharacterList data={chracters} />
    </>
  );
}
