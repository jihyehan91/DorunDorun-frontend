import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import axios from 'axios';
import '../assets/css/review.css';
import datas from '../../datas.json';

interface ReviewData {
  ai: string;
  createdAt: string;
  id: string;
  message: string;
  userid: string;
}

interface DummyData {
  img?: string;
}
interface Props {
  data: ReviewData;
  dummy: DummyData[];
}

function ReviewItem({ data, dummy }: Props) {
  const dateString = data.createdAt;
  const [date, time] = dateString.split(' ');

  return (
    <Link to={`/mylog/${data.id}`}>
      <div className='mr-6'>
        {/* <img className='character-img' src={dummy.} alt={`${data.ai}`} /> */}
      </div>
      <div className='flex flex-col justify-center'>
        <div className='review-character'>
          <span className='character-name'>{data.ai}</span>
          <span className='start-time ml-2'>{time}</span>
        </div>
      </div>
    </Link>
  );
}

export default function Review() {
  const [reviewDatas, setReviewDatas] = useState<ReviewData[]>([]);
  const [dummyDatas, setDummyDatas] = useState<DummyData[]>([]);
  const [sortBy, setSortBy] = useState<string>('latest');

  const uniqueDates: string[] = [
    ...new Set(
      reviewDatas.map((data) => {
        const [date] = data.createdAt.split(' ');
        return date;
      })
    ),
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          'https://43.203.227.36.sslip.io/server/room/getRooms'
        );
        setReviewDatas(response.data);
        // dummyDatas를 적절한 방식으로 설정해야 합니다.
        // 예를 들어, JSON 파일에서 가져온 데이터를 사용할 수 있습니다.
        setDummyDatas(datas.reviewDatas);
      } catch (error) {
        console.error('Error fetching review data:', error);
      }
    };
    fetchData();
  }, []);

  return (
    <section className='review'>
      <div className='container'>
        <div className='conversation-controls'>
          <div className='sort-dropdown'>
            <label htmlFor='sort-select' className='hide'>
              정렬
            </label>
            <select
              id='sort-select'
              className='border-none'
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value='latest'>최신순</option>
              <option value='oldest'>과거순</option>
            </select>
          </div>
        </div>
        <div className='review-conversation-lists'>
          {uniqueDates.map((date) => (
            <div key={date}>
              <div className='date'>{date}</div>
              <ul className='review-list'>
                {reviewDatas
                  .filter((data) => date === data.createdAt.split(' ')[0])
                  .map((data) => (
                    <li key={data.id} className='review-item'>
                      <ReviewItem data={data} dummy={dummyDatas} />
                    </li>
                  ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
