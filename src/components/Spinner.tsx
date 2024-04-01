// Spinner.js

import { useEffect, useState } from 'react';
import Lottie from 'lottie-react';
import loadingCat from '../../cat_spinner.json';
import '../assets/css/spinner.css'; 

function Spinner() {
  const [fadeIn, setFadeIn] = useState(false);

  useEffect(() => {
   
    const timer = setTimeout(() => {
      setFadeIn(true);
    }, 1000);

   
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="flex justify-center items-center w-screen h-screen">
      <div className="w-40">
        <Lottie animationData={loadingCat} />
        <h2 className={`mt-4 text-center text-xm ${fadeIn ? 'fade-in' : ''}`}>AI가 예문을 생성중...</h2>
      </div>
    </div>
  );
}

export default Spinner;
