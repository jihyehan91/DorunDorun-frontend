import { useState, useEffect } from 'react';
import { IoMdCloseCircle } from 'react-icons/io';

export const Popup = ({ title, datas, isPop, setIsPop }) => {
	const [mssCount, setMssCount] = useState(0);
	useEffect(() => {
		const completedCount = datas.filter((data) => data.complete).length;
		if (completedCount === 3 && mssCount < 1) {
			setMssCount((prevMss) => prevMss + 1);
		}
	}, [datas, mssCount]);

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
						<button type="button" onClick={() => setIsPop(false)}>
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
