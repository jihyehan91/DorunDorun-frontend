import '../assets/css/talk.css';
import { /* useEffect, */ useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { RiThumbUpFill, RiThumbDownFill } from 'react-icons/ri';
import datas from '../../datas.json'; //임시 데이터
import { MdOutlineRecordVoiceOver } from 'react-icons/md';


function Character() {
	const { id } = useParams();
	const [account] = useState('test');
	// const [article, setArticle] = useState([]); //api로 사용예정
	const [article] = useState(datas.characters.find((character) => character.id === id)); //임시
	return (
		<>
			<div className="list-talk">
				<div className="inner">
					<div className="head">
						<div className="profile">
							<img src={article.img} alt="" className="h-full" />
						</div>
						<dl>
							<dt>
								<Link to={`/talk/${id}`}>
									<MdOutlineRecordVoiceOver /> {article.name}
								</Link>
							</dt>
							<dd>{article.desc}</dd>
							<dd>
								<div className="btn-group mt-3">
									<button>
										<RiThumbUpFill /> (10k)
									</button>
									<button>
										<RiThumbDownFill /> (0)
									</button>
								</div>
							</dd>
						</dl>
					</div>
					<ul>
						{article.length > 0 ? (
							article.map((val, i) => {
								return (
									<li className={account === val.sendId ? '' : 'ai'} key={i}>
										<div className="profile">
											<img src={val.img} alt="" />
										</div>
										<div className="info">
											<div className="name">{val.sendId}</div>
											<div className="message">{val.msg}</div>
										</div>
									</li>
								);
							})
						) : (
							<>
								<li>새로운 대화를 시작해 보세요~!</li>
								<li>
									<Link to={`/talk/${id}`} className="flex items-center gap-1">
										<MdOutlineRecordVoiceOver /> 대화 하기
									</Link>
								</li>
							</>
						)}
					</ul>
				</div>
			</div>
		</>
	);
}

export default Character;
