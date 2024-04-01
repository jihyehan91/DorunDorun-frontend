import { useState } from 'react';
import { Link } from 'react-router-dom';
import '../assets/css/auth.css'

function TermsOfService() {
  const [isChecked, setIsChecked] = useState({
    term1: false,
    term2: false,
    term3: false,
    // term4: false,
    allTerms: false, // 전체 동의 체크 상태
  });

  // 각 약관 동의 상태 변경 함수
  const toggleCheck = (term) => {
    setIsChecked({
      ...isChecked,
      [term]: !isChecked[term],
    });
    // 개별 약관의 체크 상태가 변경될 때마다 회원가입 버튼의 활성화 상태를 확인
    checkSignupButton();
  };

  // 전체 동의 체크 상태 변경 함수
  const toggleAllCheck = () => {
    const allChecked = !isChecked.allTerms;
    setIsChecked({
      term1: allChecked,
      term2: allChecked,
      term3: allChecked,
      // term4: allChecked,
      allTerms: allChecked,
    });
    // 전체 동의 체크 상태가 변경될 때 회원가입 버튼의 활성화 상태를 설정
    checkSignupButton(allChecked);
  };

  // 모든 약관이 선택되었는지 확인하는 함수
  const isAllChecked = () => {
    return Object.values(isChecked).slice(0, -1).every((value) => value === true);
  };

  // 회원가입 버튼의 활성화 상태 확인 함수
  const checkSignupButton = (allChecked = isChecked.allTerms) => {
    const signupButton = document.getElementById('signupButton');
    if (signupButton) {
      signupButton.disabled = !allChecked;
    }
  };

  return (
    <div className="form-container">
      <div className="form-area2">
        <Link to={'/'}>
        <h1 className="text-3xl font-bold mt-4 mb-7 text-center">DoRun-DoRun</h1>
        </Link> 
        <div className="mb-6">
          <h2 className="font-semibold mb-2 flex items-center">
            <input
              type="checkbox"
              className="mr-2 h-4 w-4 rounded-full text-#67c0cd"
              checked={isChecked.term1}
              onChange={() => toggleCheck('term1')}
            />
            <span onClick={()=>toggleCheck('term1')} className="text-gray-700 cursor-pointer">제1장: 총칙</span>
          </h2>
          <div className="overflow-y-auto max-h-24 border border-gray-200 p-1">
            <p className="mb-2">제1조 (목적)</p>
            <p className='text-sm'>이 약관은 DoRun-DoRun (이하 "회사"라 함)이 제공하는 서비스 "DoRun-DoRun" (이하 "서비스"라 함)의 이용조건 및 절차에 관한 사항을 규정함을 목적으로 합니다.</p>
            <p className="mb-2">제2조 (약관의 효력과 변경)</p>
            <p className='text-sm'>본 약관은 서비스를 이용하고자 하는 모든 회원에 대하여 효력이 있습니다.</p>
            <p className='text-sm'>회사는 필요 시 본 약관을 변경할 수 있으며, 변경된 약관은 회사가 정한 방법으로 공지함으로써 효력을 발생합니다.</p>
          </div>
        </div>
        <div className="mb-6">
          <h2 className="font-semibold mb-2 flex items-center">
            <input
              type="checkbox"
              className="mr-2 h-4 w-4 text-#67c0cd rounded"
              checked={isChecked.term2}
              onChange={() => toggleCheck('term2')}
            />
            <span onClick={()=>toggleCheck('term2')} className="text-gray-700 cursor-pointer">제2장: 서비스 이용</span>
          </h2>
          <div className="overflow-y-auto max-h-24 border border-gray-200 p-1">
            <p className="mb-2">제3조 (회원 가입)</p>
            <p className='text-sm'>서비스를 이용하기 위해서는 회원 가입이 필요합니다.</p>
            <p className='text-sm'>회원은 회사가 요구하는 정보를 정확히 제공하여 가입 절차를 완료하여야 합니다.</p>
            <p className="mb-2">제4조 (개인정보 보호)</p>
            <p className='text-sm'>회사는 회원의 개인정보 보호를 위해 최선의 노력을 다하며, 관련 법령에 따라 개인정보 처리 방침을 운영합니다.</p>
            <p className='text-sm'>회원은 개인정보의 보호 및 관리에 대한 책임이 있으며, 회사의 안내에 따라 정확한 정보를 제공하여야 합니다.</p>
          </div>
        </div>
        <div className="mb-6">
          <h2 className="font-semibold mb-2 flex items-center">
            <input
              type="checkbox"
              className="mr-2 h-4 w-4 text-#67c0cd rounded"
              checked={isChecked.term3}
              onChange={() => toggleCheck('term3')}
            />
            <span onClick={()=>toggleCheck('term3')} className="text-gray-700 cursor-pointer">제3장: 권리 및 의무</span>
          </h2>
          <div className="overflow-y-auto max-h-24 border border-gray-200 p-1">
            <p className="mb-2">제5조 (서비스 이용권한)</p>
            <p className='text-sm'>회원은 본 약관에서 정한 바에 따라 서비스를 이용할 권한을 가집니다.</p>
            <p className='text-sm'>회사는 회원에 대한 서비스 제공을 거부할 수 있으며, 이 경우 그 사유를 회원에게 통지합니다.</p>
            <p className="mb-2">제6조 (회원의 의무)</p>
            <p className='text-sm'>회원은 본 약관 및 관련 법령을 준수하여 서비스를 이용하여야 합니다.</p>
            <p className='text-sm'>회원은 타인의 정보를 도용하거나 부정한 목적으로 서비스를 이용해서는 안됩니다.</p>
          </div>
        </div>
        {/* <div className="mb-6">
          <h2 className="font-semibold mb-2 flex items-center">
            <input
              type="checkbox"
              className="mr-2 h-4 w-4 text-#67c0cd rounded"
              checked={isChecked.term4}
              onChange={() => toggleCheck('term4')}
            />
            <span className="text-gray-700">제4장: 기타</span>
          </h2>
          <div className="overflow-y-auto max-h-24 border border-gray-200 p-1">
            <p className="mb-2">제7조 (면책조항)</p>
            <p className='text-sm'>회사는 천재지변 또는 기타 불가항력적인 사유로 인하여 서비스 제공에 장애가 발생한 경우에는 책임을 면할 수 있습니다.</p>
            <p className='text-sm'>회사는 회원이 서비스를 이용함으로써 발생한 손해에 대하여 일체의 책임을 지지 않습니다.</p>
            <p className="mb-2">제8조 (준거법 및 재판관할)</p>
            <p className='text-sm'>본 약관에 명시되지 않은 사항 및 회원과 회사간에 발생한 분쟁에 대하여는 대한민국 법률을 준거법으로 하며, 관할 법원은 서울중앙지방법원으로 합니다.</p>
          </div>
        </div> */}
        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-2 flex items-center">
            <input
              type="checkbox"
              className="mr-2 h-4 w-4 text-#67c0cd rounded"
              checked={isChecked.allTerms}
              onChange={toggleAllCheck}
            />
            <span onClick={toggleAllCheck} className="text-gray-700 cursor-pointer">전체 동의하기</span>
          </h2>
          <p className="text-gray-600 className='text-sm'">실명 인증된 아이디로 가입, 위치기반서비스 이용약관(선택), 이벤트・혜택 정보 수신(선택) 동의를 포함합니다.</p>
        </div>
        
        <Link to='/signup' className={`auth-input ${isAllChecked() ? '' : 'opacity-50 cursor-not-allowed'}`}>
  <button
    id="signupButton"
    type="submit"
    className="w-full text-lg"
    disabled={!isAllChecked()}
  >
    회원가입
  </button>
</Link>
        </div>
      </div>
  );
}

export default TermsOfService;
