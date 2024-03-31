import { useState } from 'react';
import Review from '../components/Review';
import TabButton from '../components/TabButton';
import TabContent from '../components/TabContent';

function Mypage() {
  const tabs = [
    { id: 0, label: '오답노트', content: <Review /> },
    { id: 1, label: '학습내역', content: '(임시) 예문/퀴즈 내역' },
  ];
  const [activeTab, setActiveTab] = useState(tabs[0].id);
  const tabHandler = (tabID: number) => {
    setActiveTab(tabID);
  };

  return (
    <section>
      <h2 className='list-title'>나의활동</h2>
      <div className='border-[var(--border-divide-color)] border-b-2'>
        {tabs.map((tab) => (
          <TabButton
            key={tab.id}
            label={tab.label}
            onClick={() => tabHandler(tab.id)}
            isActive={activeTab === tab.id}
          />
        ))}
      </div>
      <TabContent content={tabs.find((tab) => tab.id === activeTab)?.content} />
    </section>
  );
}

export default Mypage;
