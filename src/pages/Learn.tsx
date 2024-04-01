import {useState, useEffect} from 'react';
import {useNavigate, useLocation} from 'react-router-dom';
import Preview from '../components/Preview';
import Wordquiz from '../components/Wordquiz';
import TabButton from '../components/TabButton';
import TabContent from '../components/TabContent';

export default function Learn() {
    const navigate = useNavigate();
    const location = useLocation();
    const tabs = [
        {
            id: 0,
            label: '문장퀴즈',
            content: <Wordquiz/>,
            description: '단어를 조합해서 맞는 문장을 만들어보세요!'
        },
        {
            id: 1,
            label: '예문100',
            content: <Preview/>,
            description: '난이도별로 준비된 100개의 예문을 익히며 영어 실력을 키워보세요!'
        }
    ];

    const locationId = Number(location.hash.split("#std")[1]) || 0;
    const [activeTab, setActiveTab] = useState(locationId);

    const tabHandler = (tabId: number) => {
        navigate(`/learning#std${tabId}`);
    };
    useEffect(()=>{
        setActiveTab(locationId);
        (location?.hash === '') && navigate(`/learning#std${locationId}`);
    },[location.hash]);

    return (
        <section>
            <h2 className='list-title'>학습하기</h2>
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
            <p className='text-[var(--sub-font-color)] pt-3 pb-8'>
                {tabs[activeTab].description}
            </p>
            <TabContent content={tabs.find((tab) => tab.id === activeTab)?.content}/>
        </section>
    );
}