import { useState, useEffect } from 'react';
import { IoMdCloseCircle } from 'react-icons/io';
import { useNavigate } from 'react-router-dom';

export const Popup = ({ title, datas, isPop, setIsPop, missions, authUser }) => { // missions, authUser : 교정목록에서만 사용함.
	const navigate = useNavigate();
	const [mssCount, setMssCount] = useState(0);//일 목표치 할당 카운트:추후 예정?
	const completedCount = missions?.filter((data) => data.complete).length || 0;//교정목록에서만 사용함. (closeHandler 용)
	useEffect(() => {
		if (completedCount === 3 && mssCount < 1) {
			setMssCount((prevMss) => prevMss + 1);
		}
	}, [missions, datas, mssCount, completedCount]);

	function closeHandler() {
		if (title === '교정 목록' && completedCount >= 3) {
      console.log(authUser);
			if (authUser?.result) {
				if (!confirm('복습하기 페이지로 이동하시겠습니까?')) return;
				navigate(`/mylog`);
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
						{/* <p className="todo">
							<span>오늘의 목표: 미달({datas.filter((data) => data.complete).length}/3)</span>{' '}
							<span>전체 목표량 : {mssCount}/30일</span>
						</p> */}
						<ul className="list-mission">
							{datas.length === 0 ? (
								<li className="nodata">오늘의 미션이 없습니다</li>
							) : (
								datas.map((mission, i) => {
									return (
										<li key={i} className={`${mission.complete ? 'complete' : ''}`}>
											<span>{mission.mission}</span>
										</li>
									);
								})
							)}
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
						<button type="button" onClick={() => closeHandler()}>
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
}