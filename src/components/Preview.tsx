import { Link } from 'react-router-dom';
import '../assets/css/preview.css';

export default function Preview() {
  const levelLinks = [
    { id: 'level0', label: 'Lv.0' },
    { id: 'level1', label: 'Lv.1' },
    { id: 'level2', label: 'Lv.2' },
    { id: 'level3', label: 'Lv.3' },
  ];

  return (
    <>
      <p>난이도에 따라 100문장씩 배워볼까요?</p>
      <ul className='preview-container'>
        {levelLinks.map((link) => (
          <li key={link.id} className='preview'>
            <Link to={`/learning/${link.id}`} className='preview-sentence-link'>
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </>
  );
}
