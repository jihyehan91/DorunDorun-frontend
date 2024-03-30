import { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import datas from '../../datas.json'; //임시 데이터
import axios from 'axios';
// import { RiThumbUpFill, RiThumbDownFill } from 'react-icons/ri';
// import { BiSolidUserDetail } from 'react-icons/bi';
import { PiUserListFill } from 'react-icons/pi';
import { PiUserListDuotone } from 'react-icons/pi';

import { PiMicrophoneFill } from 'react-icons/pi';
import { PiMicrophoneSlash } from 'react-icons/pi';
import { RiSendPlaneFill } from 'react-icons/ri';
import { MdOutlineKeyboardReturn } from 'react-icons/md';
import { BsShiftFill } from 'react-icons/bs';
import { IoStop } from 'react-icons/io5';
import { IoPlay } from 'react-icons/io5';
import { PiListMagnifyingGlassDuotone } from 'react-icons/pi';
// import { MdChecklist } from 'react-icons/md';
import { RiLoader2Fill } from 'react-icons/ri';
// import { FaFileArrowDown } from 'react-icons/fa6';
import { FaArrowLeft } from 'react-icons/fa6';
// import wavfile from '/test.wav';
// import { type } from './../store/store';
import { Popup } from './(talk)/Popup';
import { ChatHistory } from './(talk)/ChatList';

// 파비콘 출천 : http://si.serverzero.kr/main/pc/index.php#five
// 이미지 출처 : https://m.blog.naver.com/sinnam88/221375405075

function Talk() {
	const { id } = useParams();
	// const [account] = useState("test");
	const [authuser, setAuthUser] = useState({});
	// const [beforeMessage, setBeforeMessage] = useState([]);//api로 사용예정
	// const [beforeMessage] = useState(datas.chats.filter((chat) => chat.roomId === id)); //임시:기존 대화한 내역 메세지

	const [mic, setMic] = useState(false); //마이크 활성 체크
	const [history, setHistory] = useState(false); //대화 내역

	const textareaRef = useRef();
	const innerRef = useRef();
	const audioRef = useRef();
	const micRef = useRef();
	const [playState, setPlayState] = useState(false); //오디오 재생 중인지 체크
	const [duration, setDuration] = useState(0); //오디오 재생 중
	const [isPop, setIsPop] = useState(false); //대화내역 활성 체크
	const [isTyped, setIsTyped] = useState(false); //음성입력(텍스트입력) 완료 체크
	// const [audioEnd, setAudioEnd] = useState(false); //오디오 종료 체크
	// const [isAudioFetched, setIsAudioFetched] = useState(false); //오디오 파일 fetch 체크
	const [correctLoad, setCorrectLoad] = useState(false); //교정 fetching 체크
	const [audioLoad, setAudioLoad] = useState(false); //오디오 fetching 체크
	const [firstAudioMsg, setFirstAudioMsg] = useState(false); //첫 대화시 오디오 파일 체크
	const [emotion, setEmotion] = useState('happy'); //
	const [aiMsg, setAiMsg] = useState({}); //
	const [talkMessages, setTalkMessages] = useState([]); //전송의 응답 메세지([user: .., pooh: ..])
	const [correctList, setCorrectList] = useState([]); //교정 할 리스트
  const [allMsg, setAllMsg] = useState([]); //대화 전체 메세지
  const [isFinishPop, setIsFinishPop] = useState(false); //대화 종료 팝업 체크
	const [isFinish, setIsFinish] = useState(false); //대화 종료

	const [characterInfo] = useState(datas.characters.filter((character) => character.id === id)); //임시
	const [bgNum, setBgNum] = useState(Math.floor(Math.random() * 3));
	const [characterDesc, setCharacterDesc] = useState(false);
	/* const [getData] = useState([
		//더미
		{
			id: 'review_1',
			messages: [
				{ speaker: 'ai', message: 'I have to go.' },
				{ speaker: 'user', message: 'why?' },
				{ speaker: 'ai', message: 'He goed to the store.' },
				{ speaker: 'user', message: 'Why do you think so?' },
			],
			wrongSentence: 'He goed to the store.',
			correctedSentence: 'He went to the store.',
		},
		{
			id: 'review_2',
			messages: [
				{ speaker: 'ai', message: 'God bless you' },
				{ speaker: 'user', message: 'what?' },
				{ speaker: 'ai', message: 'He goed to the store.' },
				{ speaker: 'user', message: 'Why do you think so?' },
				{ speaker: 'ai', message: 'He goed to the store.' },
				{ speaker: 'user', message: 'Why do you think so?' },
			],
			wrongSentence: 'He goed to the store.',
			correctedSentence: 'He went to the store..',
		},
		{
			id: 'review_3',
			messages: [
				{ speaker: 'ai', message: "That's ok." },
				{ speaker: 'user', message: 'why?' },
			],
			wrongSentence: 'He goed to the store.',
			correctedSentence: 'He went to the store!',
		},
	]); */
	/* const [missions, setMissions] = useState(
		getData.map((data, i) => ({
			id: i,
			message: data.correctedSentence,
			complete: false,
		}))
	); */
	const [missions, setMissions] = useState([]);

	type Mission = {
        mission_id: string;
        mission: string;
        meaning: string;
        complete: boolean;
      };
      
      // 데이터
      const data: Mission[] = [
        {
          mission_id: "lv1_1",
          mission: "I am trying to",
          meaning: "~ 해 보려고 하는 중이에요",
          complete: false
        },
        {
          mission_id: "lv1_2",
          mission: "I am ready to",
          meaning: "~ 할 준비가 되었어요",
          complete: false
        },
        {
          mission_id: "lv1_3",
          mission: "I am just about to",
          meaning: "지금 막 ~ 하려는 참이에요",
          complete: false
        }
      ];
    

	async function getMissions() {
		try {
			const response = await axios.get('https://43.203.227.36.sslip.io/server/missions');
			console.log(response.data);
			setMissions(response.data);
			/* setMissions([ // 더미
        {
          mission_id: "lv1_1",
          mission: "I am trying to",
          meaning: "~ 해 보려고 하는 중이에요",
          complete: false
        },
        {
          mission_id: "lv1_2",
          mission: "I am ready to",
          meaning: "~ 할 준비가 되었어요",
          complete: false
        },
        {
          mission_id: "lv1_3",
          mission: "I am just about to",
          meaning: "지금 막 ~ 하려는 참이에요",
          complete: false
        }
        ]); */
		} catch (error) {
			console.error('Fetch and play audio error:', error);
		}
	}

	useEffect(() => {
		async function auth() {
			const res = await axios.get('https://43.203.227.36.sslip.io/server/user/authuser');
			const result = res.data;
			setAuthUser(result);
		}
		auth();
		setMic(false);
		getMissions();
	}, []);

	// 뒤로가기 버튼
	const backHandler = (talkMessages) => {
		if (talkMessages.length !== 0 && !isFinish && !window.confirm('대화창을 나가면 내역은 저장되지 않습니다.')) return;
		window.history.back();
	};

	const fetchAndPlayAudio = async (inputText) => {
		try {
			const response = await axios.post(
				'https://43.203.227.36.sslip.io/server/chat/SendChat',
				{
					messages: [`user: ${inputText}`],
				},
				{ withCredentials: true }
			);
			const result = await response.data;
			setEmotion(result.emotion);
			setTalkMessages((prevData) => [...prevData, `pooh: ${result.aimsg}`]);
			setAiMsg((prevData) => ({ ...prevData, result: result }));
			setAudioLoad(false);
			const file = await fetch('/pooh.wav', { withCredentials: true });
			const blob = await file.blob();
			const objectURL = URL.createObjectURL(blob);
			return objectURL;
		} catch (error) {
			console.error('Fetch and play audio error:', error);
		}
	};

	function playAudio() {
		const player = audioRef.current;
		setPlayState(!playState);
		playState ? player.pause() : player.play();
		player.addEventListener('timeupdate', function () {
			const currentTime = player.currentTime;
			const end = player.duration;
			const percentage = Math.floor((currentTime / end) * 100);
			setDuration(percentage);
			if (percentage >= 100) {
				setPlayState(false); //오디오 재생 중인 상태 체크
				micRef.current.focus();
			}
		});
	}

	const checkMission = async (inputText) => {
        // const missionData = data.map(item => `mission_id: ${item.mission_id}\nmission: ${item.mission}\n`).join('\n')
        // const postData =`${missionData}\nchat:${inputText}`;
        // const postData = {
        //  missions: data.map(item => ({ mission_id: item.mission_id, mission: item.mission })),
        //  chat: inputText
        // };
        const reducedMissions = data.map(({ mission_id, mission }) => ({ mission_id, mission }));

        // console.log('postData',reducedMissions);
        try {  
            const response = await axios.post('http://localhost:8080/checkMission', 
            {
                missions: reducedMissions,
                chat: inputText

            })
            const checkData = response.data;
            console.log("중간 데이터", checkData);

            // if (Array.isArray(checkData)) {
            //  console.log('data는 배열입니다.');
            // } else {
            //  console.log('data는 배열이 아닙니다.');
            // }
            
            if (checkData != " none") {
                let dataArray: string[] = [];
                try {
                    dataArray = JSON.parse(checkData.replace(/'/g, '"'));
                    console.log("배열 변환 완료: ", dataArray);
                } catch (error) {
                    console.error("배열 변환 에러: ", error)
                }
            }
            
        } catch (error) {
            console.error("missionError: ",error)
        }
    }



	const sendMessage = async (e) => {
		e.preventDefault();
		const inputText = textareaRef.current.value;
		if (inputText.trim().length === 0) {
			alert('입력된 대화 내용이 없습니다.');
			return false;
		}
		try {
			await setAudioLoad(true);
			setTalkMessages((prevData) => [...prevData, `user: ${inputText}`]);
			const audioSrc = await fetchAndPlayAudio(inputText);
			if (audioRef.current) {
				audioRef.current.src = audioSrc;
			}
			playAudio();
      //미션 체크 할 AI 요청 부분
      //여기에 작성
			setFirstAudioMsg(true);
			setMissions((prevData) =>
				prevData.map((mission) => (mission.mission === inputText ? { ...mission, complete: true } : mission))
			);

			await checkMission(inputText);

			textareaRef.current.value = '';
			micRef.current.focus();
		} catch (error) {
			console.log(error);
		}
	};
	const finishChat = async () => {
		const todayMissionCount = missions.filter((data) => data.complete).length;
		if (todayMissionCount < 3 && !window.confirm('오늘의 학습 미션을 달성하지 못하였습니다. 그만하시겠습니까?')) return;
		try {
			const resCorrect = await axios.post(
				'https://43.203.227.36.sslip.io/server/chat/getCorrection',
				{ messages: talkMessages },
				{ withCredentials: true }
			);
			const correctedMsg = await resCorrect.data;
			setAllMsg((prevData) => [...prevData, correctedMsg]);// 서버에 전달할 내용

			// console.log('resCorrect: ', correctedMsg);
			// allMsg = correctedMsg;
			correctedMsg.forEach(function (msg) {
				if (msg.includes('->')) {
					setCorrectList((prevData) => [...prevData, msg]);
				}
			});

			if (correctedMsg.length === 0) {
				setCorrectList(['Perfect Grammar']);
			}
			setIsFinish(true);
			setIsFinishPop(true);
			setCorrectLoad(false);
			// if (isPop) {
			// 	if (!authuser.result && !window.confirm('학습된 기록은 로그인 후 이용 가능합니다. 로그인 하시겠습니까?')) {
			// 		return;
			// 	} else {
			// 		historySave(allMsg); //서버 저장
			// 		if (!authuser.result) navigate(`/login?ㅌrect=${pathname}`); //
			// 	}
			// }
		} catch (error) {
			console.error('에러 발생:', error);
		}

		await axios
			.post(
				'https://43.203.227.36.sslip.io/server/room/newRoom',
				{
					ai: 'pooh',
					messages: allMsg,
				},
				{ withCredentials: true }
			)
			.then(function (response) {
				console.log(response.data);
				// roomid = response.data;
			});

		setFirstAudioMsg(false);
	};
	const inputHandler = () => {
		return (textareaRef.current.parentNode.dataset.value = textareaRef.current.value);
	};

	// 마이크 캡처
	const mediaRecorderRef = useRef<MediaRecorder | null>(null);
	const chunksRef = useRef<Blob[]>([]);

	const handleStartRecording = async () => {
		micRef.current.focus();
		playState && playAudio();
		try {
			const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
			const mediaRecorder = new MediaRecorder(stream);
			mediaRecorderRef.current = mediaRecorder;

			mediaRecorder.ondataavailable = (e) => {
				if (e.data.size > 0) {
					chunksRef.current.push(e.data);
				}
			};

			mediaRecorder.onstop = () => {
				const recordedBlob = new Blob(chunksRef.current, {
					type: 'audio/AMR-WB',
				});
				chunksRef.current = [];

				sendAudioData(recordedBlob);
			};

			mediaRecorder.start();
			setMic(true);
			setIsTyped(true);
		} catch (error) {
			console.error('Error accessing microphone:', error);
		}
	};

	const handleStopRecording = () => {
		const mediaRecorder = mediaRecorderRef.current;
		if (mediaRecorder && mediaRecorder.state !== 'inactive') {
			mediaRecorder.stop();
			setMic(false);
		}
	};

	const sendAudioData = async (audioBlob: Blob) => {
		try {
			// Blob을 File 객체로 변환 (파일 이름은 recording.amr로 지정)
			const audioFile = new File([audioBlob], 'recording.amr', {
				type: 'audio/AMR-WB',
			});

			const formData = new FormData();

			formData.append('audio', audioFile);
			const response = await axios.post('https://43.203.227.36.sslip.io/server/speech', formData, {
				headers: {
					'Content-Type': 'multipart/form-data',
				},
				// ,withCredentials: true,
			});

			console.log('Audio data sent successfully:', response.data);
			textareaRef.current.value = response.data;
			setIsTyped(false);
			textareaRef.current.focus();
		} catch (error) {
			console.error('Error sending audio data:', error);
		}
	};

	const emoHandler = (idx) => {
		setBgNum(idx);
	};

	return (
		<>
			<div className="list-talk bg-cover bg-no-repeat bg-center ">
				<div className="head">
					<div className="btn-area flex justify-between w-full py-2">
						<button
							type="button"
							aria-label="뒤로가기"
							className="p-0 text-2xl"
							onClick={() => backHandler(talkMessages)}>
							<FaArrowLeft />
						</button>
						<button type="button" className="btn-mission btn-chat " onClick={() => setIsPop(!isPop)}>
							{/* <MdChecklist /> */}미션
						</button>
					</div>

					<Popup
						title={'오늘의 학습 미션'}
						datas={missions}
						isPop={isPop}
						setIsPop={setIsPop}
						allMsg={allMsg}
					/>
				</div>
				<div ref={innerRef} className="inner">
					<div className="bg-char" style={{ backgroundImage: `url(/bg_${bgNum}.jpg)` }}></div>
					<div className="bg-emo">
						<button onClick={() => emoHandler(0)}>
							<img src="/bg_0.jpg" alt="" />
						</button>
						<button onClick={() => emoHandler(1)}>
							<img src="/bg_1.jpg" alt="" />
						</button>
						<button onClick={() => emoHandler(2)}>
							<img src="/bg_2.jpg" alt="" />
						</button>
					</div>
					<div className={`profile ${emotion}`}>
						<img src={`/pooh_${emotion}.png`} alt="" />
					</div>
				</div>

				<div className={`history ${history ? '' : 'hidden'}`}>
					<ChatHistory talkMessages={talkMessages} userInfo={authuser} characterInfo={characterInfo} />
				</div>
				{/* foot */}
				<div className="foot-talking-wrap ">
					<div className="progress">
						<div className="bar" style={{ transform: `translateX(${duration}%)` }} />
					</div>
					<div className="talking">
						<dl>
							<dt className="flex justify-between">
								<button id="charName" className="btn-char" onClick={() => setCharacterDesc(!characterDesc)}>
									{characterDesc ? <PiUserListFill className="text-lg" /> : <PiUserListDuotone className="text-lg" />}{' '}
									{characterInfo[0].name}
									<div className={`voiceContainer ${playState ? 'on' : 'off'}`}>
										<div>
											<div className="voice voice1"></div>
											<div className="voice voice2"></div>
											<div className="voice voice3"></div>
											<div className="voice voice4"></div>
											<div className="voice voice5"></div>
										</div>
									</div>
								</button>
								<Popup title={'캐릭터 소개'} datas={characterInfo} isPop={characterDesc} setIsPop={setCharacterDesc} />

								<button className="btn-history" onClick={() => setHistory(!history)}>
									<PiListMagnifyingGlassDuotone
										className={`text-2xl ${talkMessages.length == 0 ? ' text-gray-400' : ''}`}
									/>
								</button>
							</dt>
							<dd className="message">{aiMsg.result ? aiMsg.result.aimsg : '대화를 시작 해보세요~'}</dd>
							<dd className="hidden">
								<audio id="myAudio" ref={audioRef}></audio>
							</dd>
						</dl>
					</div>
					<form className="form" onSubmit={(e) => sendMessage(e)}>
						<button
							type="button"
							ref={micRef}
							className="btn-mic"
							onClick={mic ? handleStopRecording : handleStartRecording}
							disabled={isFinish ? true : false}>
							{mic ? <PiMicrophoneFill /> : <PiMicrophoneSlash />}
						</button>
						<div className={`textarea-wrap ${isTyped ? 'mic-on' : ''}`}>
							<textarea
								id="talkInput"
								className="w-full"
								ref={textareaRef}
								onKeyPress={(e) => {
									if (e.nativeEvent.isComposing) return;
									const key = e.key || e.charCode;
									(key === 'Enter' || key === 13) && !e.shiftKey && sendMessage(e);
								}}
								onInput={inputHandler}
								placeholder="마이크 이용 또는 메시지를 입력해 주세요"
							/>
						</div>
						<div className="foot">
							<div className="btns">
								<button type="submit" className="btn-send" disabled={playState || isFinish ? true : false}>
									{audioLoad ? <RiLoader2Fill className="animate-spin" /> : <RiSendPlaneFill />}
								</button>
								<button
									type="button"
									className="btn-stop"
									onClick={playAudio}
									disabled={playState || firstAudioMsg ? false : true}>
									{playState ? <IoStop /> : <IoPlay />}
								</button>
							</div>

							<div className="shortcuts">
								<div className="shortcut hidden">
									* Send:{' '}
									<span>
										<MdOutlineKeyboardReturn />
									</span>{' '}
									/ New Line:{' '}
									<span>
										<BsShiftFill />
									</span>{' '}
									+{' '}
									<span>
										<MdOutlineKeyboardReturn />
									</span>
								</div>
								<button
									type="button"
									className="btn-finishchat"
									onClick={finishChat}
									disabled={firstAudioMsg || isFinishPop ? false : true}>
									대화 종료 {correctLoad && <RiLoader2Fill className="animate-spin" />}
								</button>
								<Popup title={'교정 목록'} datas={correctList} isPop={isFinishPop} setIsPop={setIsFinishPop} />
							</div>
						</div>
					</form>
				</div>
			</div>
		</>
	);
}

export default Talk;
