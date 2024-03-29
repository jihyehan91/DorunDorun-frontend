import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import axios from 'axios';
import '../assets/css/review.css';

interface Data {
  id: string;
  img: string;
  name: string;
  startTime: string;
  finishTime: string;
  incorrectSentences: string[];
}

interface Room {
  id: string;
  userid: string;
  ai: string;
  createdAt: Date;
}
interface ReviewData extends Data {
  date: Date;
}

interface Props {
  data: Data;
}

function ReviewItem({ data }: Props) {
  return (
    <Link to={`/mylog/${data.id}`}>
      <div className='mr-6'>
        <img className='character-img' src={data.img} alt={`${data.name}`} />
      </div>
      <div className='flex flex-col justify-center'>
        {/* 복습 목록 - 캐릭터 이름, 시간 표기 */}
        <div className='review-character'>
          <span className='character-name'>{data.name}</span>
          <span className='start-time ml-2'>{data.startTime}</span>
          <span className='finish-time'>{data.finishTime}</span>
        </div>
        {/* 틀린 문장 보기 */}
        <div className='review-sentence my-2 flex items-center'>
          <div className='corrected-sentence-count mr-2'>
            {data.incorrectSentences.length}
          </div>
          <div className='incorrect-first text-lg truncate-1'>
            {data.incorrectSentences[0]}
          </div>
        </div>
      </div>
    </Link>
  );
}

export default function Review() {
  const [sortBy, setSortBy] = useState<string>('latest');
  const [reviewDatas, setReviewDatas] = useState<ReviewData[]>([]);
  const uniqueDates: string[] = [
    ...new Set(
      reviewDatas.map((data) => data.date.toISOString().split('T')[0])
    ),
  ];
  let rooms: Room[] = [];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get<string>(
          'https://43.203.227.36.sslip.io/server/room/getRooms'
        );
        console.log(response.data);
        // rooms = JSON.parse(response.data);
        console.log(rooms);
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
                  .filter((data) => date === data.date)
                  .map((data) => (
                    <li key={data.id} className='review-item'>
                      <ReviewItem data={data} />
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
