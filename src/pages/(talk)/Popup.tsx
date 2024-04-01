import { useRef, useState, useEffect, Dispatch, SetStateAction } from 'react';
import { IoMdCloseCircle } from 'react-icons/io';
import { useNavigate } from 'react-router-dom';
import { Mission, Character } from '../Talk'; // Mission 인터페이스를 가져옴

interface PopupProps {
	title: string;
	correctDatas?: string[] | undefined;
	charDatas?: Character[] | undefined;
	mssDatas?: Mission[] | undefined;
	isPop: boolean;
	setIsPop: Dispatch<SetStateAction<boolean>>;
}

interface ListProps {
	title: string;
}

export const Popup: React.FC<PopupProps> = ({ title, correctDatas, charDatas, mssDatas, isPop, setIsPop }) => {
	// missions, authUser : 교정목록에서만 사용함.
	const modalRef = useRef<HTMLDivElement>(null);
	const navigate = useNavigate();
	const [mssCount, setMssCount] = useState(0); //일 목표치 할당 카운트:추후 예정?
	const completedCount = mssDatas?.filter((data) => data.complete).length || 0; //교정목록에서만 사용함. (closeHandler 용)
	useEffect(() => {
		if (completedCount === 3 && mssCount < 1) {
			setMssCount((prevMss) => prevMss + 1);
		}
		window.addEventListener('scroll', function () {
			const _scrollX = Math.round(0 - window.scrollX);
			modalRef.current && (modalRef.current.style.left = _scrollX + 'px');
		});
	}, [mssCount, completedCount, modalRef]);

	function closeHandler() {
		if (title === '교정 목록') {
			alert('복습하기 페이지로 이동합니다');
			navigate(`/review`);
		}
		setIsPop(false);
	}

	function List({ title }: ListProps) {
		switch (title) {
			case '교정 목록':
				return (
					<>
						{correctDatas?.length === 0 ? (
							<div>Perfect Grammar</div>
						) : (
							<ul className="list-correct">
								{correctDatas?.map((msg, i) => {
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
							{mssDatas?.length === 0 ? (
								<li className="nodata">오늘의 미션이 없습니다</li>
							) : (
								mssDatas?.map((mission, i) => {
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
						{charDatas && charDatas.length > 0 && (
							<>
								<strong className="text-lg">{charDatas[0].name}</strong>
								<p>{charDatas[0]?.desc}</p>
							</>
						)}
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
			<div ref={modalRef} className={`ly-modal${isPop ? '' : ' !hidden'}`}>
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
};
