import axios from 'axios';
import { useState, useEffect } from 'react';
import { IoMdCloseCircle } from 'react-icons/io';
import { useNavigate } from 'react-router-dom';

export const Popup = ({ title, allMsg, datas, isPop, setIsPop }) => {

	const navigate = useNavigate();
	const [mssCount, setMssCount] = useState(0);
	const [authUser, setAuthUser] = useState({});
	const completedCount = datas.filter((data) => data.complete).length;
	// const completedCount = 3;
	useEffect(() => {
		if (completedCount === 3 && mssCount < 1) {
			setMssCount((prevMss) => prevMss + 1);
		}
    async function auth() {//지못미;
			const res = await axios.get('https://43.203.227.36.sslip.io/server/user/authuser');
			const result = res.data;
			setAuthUser(result);

			// setAuthUser({
			// 	result: true, // userCheck
			// 	nickname: 'test_nick1', // user
			// 	userId: 'test1', //
			// 	newToken: null, //
			// });
		}
		auth();
	}, [datas, mssCount,completedCount]);


  // function historySave(allmessage) {
  //   console.log(allmessage);
  //   localStorage.setItem('_doRunChatHistory', JSON.stringify(allmessage));
  // }
  function closeHandler(){

      console.log(allMsg);
      if(title === '교정 목록' && completedCount >= 3){
        if(authUser.result){
          if(!confirm('복습하기 페이지로 이동하시겠습니까?')) return;
          // historySave(allMsg); //서버 저장
          navigate(`/mylog`);
        } else{
          if(!confirm('학습된 기록은 저장되지 않습니다. 회원가입 후 이용 해주세요.')) return;
          navigate(`/signup`);
        }
      }
      setIsPop(false);
  }
	function List({ title }) {
		switch (title) {
			case '교정 목록':
				return (
					<>
						{datas.length === 0 ? (
							<div>Perfect Grammar</div>
						) : (
							<ul className="list-correct">
								{datas.map((msg, i) => {
									return <li key={i}>{msg}</li>;
								})}
							</ul>
						)}
					</>
				);
			case '오늘의 학습 미션':
				return (
					<>
						<p className="todo">
							<span>오늘의 목표: 미달({datas.filter((data) => data.complete).length}/3)</span>{' '}
							<span>전체 목표량 : {mssCount}/30일</span>
						</p>
						<ul className="list-mission">
							{datas.map((mission) => {
								return (
									<li key={mission.id} className={`${mission.complete ? 'complete' : ''}`}>
										<span>{mission.message}</span>
									</li>
								);
							})}
						</ul>
					</>
				);
			case '캐릭터 소개':
				return (
					<>
						<strong className="text-lg">{datas[0].name}</strong>
						<p>{datas[0].desc}</p>
					</>
				);

			default:
				return (
					<>
						<div>데이터가 없습니다</div>
					</>
				);
		}
	}
	return (
		<>
			<div className={`ly-modal${isPop ? '' : ' !hidden'}`}>
				<div className="ly-inner">
					<div className="ly-head">
						<strong>{title}</strong>
						<button
							type="button"
							onClick={()=>closeHandler(authUser)}>
							<IoMdCloseCircle className="text-[var(--highlight-color)]" />
						</button>
					</div>
					<div className="ly-body">
						<List title={title} />
					</div>
				</div>
			</div>
		</>
	);
};
