import { useState } from 'react';
import Preview from '../components/Preview';
import Wordquiz from '../components/Wordquiz';
import TabButton from '../components/TabButton';
import TabContent from '../components/TabContent';

export default function Learn() {
  const tabs = [
    { id: 0, label: '문장퀴즈', content: <Wordquiz /> },
    { id: 1, label: '예문100', content: <Preview /> },
  ];

  const [activeTab, setActiveTab] = useState(tabs[0].id);
  const tabHandler = (tabId: number) => {
    setActiveTab(tabId);
  };

  return (
    <section>
      {tabs.map((tab) => (
        <TabButton
          key={tab.id}
          label={tab.label}
          onClick={() => {
            tabHandler(tab.id);
          }}
          isActive={activeTab === tab.id}
        />
      ))}
      <h2 className='list-title'>{tabs[activeTab].label}</h2>
      <TabContent content={tabs.find((tab) => tab.id === activeTab)?.content} />
    </section>
  );
}
