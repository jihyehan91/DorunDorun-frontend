import { useState /* , useEffect */ } from 'react';
import '../index.css';
import '../assets/css/home.css';
import datas from '../../datas.json'; //임시 데이터
import { CharacterList } from './Chat';
import Wordquiz from '../components/Wordquiz';
import { Link } from 'react-router-dom';

function Home() {
  const getRandomElements = (array, count) => {
    const shuffled = array.sort(() => Math.random() - 0.5);
    return shuffled.slice(0, count);
  };

  const randomRecommendations = getRandomElements(datas.characters, 4);
  const [recomm] = useState(randomRecommendations); //임시

  return (
    <>
      <div className='main-bannder flex mt-20'>
        <div className='banner'>
          <div className='banner-text-area'>
            <h3>Let's chat</h3>
            <p className='banner-text'>안녕, 나와 대화해볼래?</p>
            <p className='banner-text'>우리 함께 즐거운 영어 공부하자!</p>
            <Link to='/chat' className='banner-link-chat'>
              지금 대화하러 가기
            </Link>
          </div>
          <div className='img-box'>
            {/* <img src='/image1.png' alt='푸우' /> */}
            <img src='/pc-banner.png' alt='푸우' />
          </div>
        </div>
      </div>
      {/* 추천 캐릭터 */}
      <div className='main-character'>
        <h2 className='list-title main-title'>추천 대화</h2>
        <p className='mb-10 text-[var(--sub-font-color)] text-lg'>
          친구들이 당신을 기다리고 있어요{`:)`}
        </p>
        <CharacterList data={recomm} />
      </div>
      {/* 예문, 퀴즈 */}
      <div className='main-learn flex'>
        <div>
          <h2 className='list-title main-title'>새로운 표현을 배워볼까요?</h2>
          <p className='text-[var(--sub-font-color)] text-lg'>
            하루에 딱 3문장만 공부하면 실력이 UP!
          </p>
          <div>
            <div>예문학습</div>
          </div>
        </div>
        <div>
          <h2 className='list-title main-title'>퀴즈 풀고 실력 높이기!</h2>
          <p className='text-[var(--sub-font-color)] text-lg mb-10'>
            문장 완성하는 퀴즈를 풀며 즐겁게 공부해요~
          </p>
          <div>
            <Wordquiz />
          </div>
        </div>
      </div>
    </>
  );
}

export default Home;
