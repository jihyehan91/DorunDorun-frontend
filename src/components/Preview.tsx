import { Link } from 'react-router-dom';
import axios from 'axios';
import '../assets/css/preview.css';

export default function Preview() {
  const levelLinks = [
    { id: 'level0', label: 'Lv.0' },
    { id: 'level1', label: 'Lv.1' },
    { id: 'level2', label: 'Lv.2' },
    { id: 'level3', label: 'Lv.3' },
  ];

  const handlePreviewClick = async (linkId: string) => {
    try {
      const level = 'lv' + linkId[5];
      // 여기에 axios 요청 코드를 작성합니다. 예를 들어,
      const response = await axios.post(
        'https://43.203.227.36.sslip.io/server/course',
        {
          course: level,
        }
      );
      console.log(response.data); // 응답 데이터를 로그에 출력하거나 원하는 대로 처리
    } catch (error) {
      console.error('Error logging click:', error);
    }

    // 클릭된 preview 클래스의 link로 넘어감
    window.location.href = `/learning/${linkId}`;
  };

  return (
    <>
      <p>난이도에 따라 100문장씩 배워볼까요?</p>
      <ul className='preview-container'>
        {levelLinks.map((link) => (
          <li
            key={link.id}
            className='preview'
            onClick={() => handlePreviewClick(link.id)}
          >
            <span className='preview-sentence-link'>{link.label}</span>
          </li>
        ))}
      </ul>
    </>
  );
}
