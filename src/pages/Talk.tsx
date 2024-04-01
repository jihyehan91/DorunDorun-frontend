import '../assets/css/talk.css';
import { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import datas from '../../datas.json'; //임시 데이터
import axios from 'axios';

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
import { RiLoader2Fill } from 'react-icons/ri';

import { Popup } from './(talk)/Popup';
import { ChatHistory } from './(talk)/ChatList';
import { firework } from '../utils/firework';

// 파비콘 출천 : http://si.serverzero.kr/main/pc/index.php#five
// 이미지 출처 : https://m.blog.naver.com/sinnam88/221375405075

export interface Mission {
	mission_id: string;
	mission: string;
	meaning: string;
	complete: boolean;
}

export interface AuthUser {
	result?: boolean;
	nickname?: string;
	userId?: string;
	newToken?: string | null;
}

interface AiMsg {
	nickname?: string | null;
	userMsg: string;
	result: boolean;
	emotion: string;
	aimsg: string;
}

export interface Character {
	id: string;
	name: string;
	img: string;
	desc: string;
}

function Talk() {
	const { id } = useParams();
	const [authuser, setAuthUser] = useState<AuthUser>({ result: false });

	const [mic, setMic] = useState<boolean>(false); //마이크 활성 체크
	const [history, setHistory] = useState<boolean>(false); //대화 내역

	const textareaRef = useRef<HTMLTextAreaElement>(null);
	const innerRef = useRef<HTMLDivElement>(null);
	const audioRef = useRef<HTMLAudioElement>(null);
	const micRef = useRef<HTMLButtonElement>(null);
	const [playState, setPlayState] = useState<boolean>(false); //오디오 재생 중인지 체크
	const [duration, setDuration] = useState<number>(0); //오디오 재생 중
	const [isPop, setIsPop] = useState<boolean>(false); //대화내역 활성 체크
	const [isTyped, setIsTyped] = useState<boolean>(false); //음성입력(텍스트입력) 완료 체크
	const [correctLoad, setCorrectLoad] = useState<boolean>(false); //교정 fetching 체크
	const [audioLoad, setAudioLoad] = useState<boolean>(false); //오디오 fetching 체크
	const [firstAudioMsg, setFirstAudioMsg] = useState<boolean>(false); //첫 대화시 오디오 파일 체크
	const [emotion, setEmotion] = useState<string>('happy'); //
	const [aiMsg, setAiMsg] = useState<AiMsg>({
		nickname: null,
		userMsg: '',
		result: false,
		emotion: '',
		aimsg: '',
	}); //
	const [talkMessages, setTalkMessages] = useState<string[]>([]); //전송의 응답 메세지([user: .., pooh: ..])
	const [correctList, setCorrectList] = useState<string[]>([]); //교정 할 리스트
	const [isFinishPop, setIsFinishPop] = useState<boolean>(false); //대화 종료 팝업 체크
	const [isFinish, setIsFinish] = useState<boolean>(false); //대화 종료

	const [characterInfo] = useState<Character[]>(datas.characters.filter((character: Character) => character.id === id)); //임시
	const [bgNum, setBgNum] = useState<number>(Math.floor(Math.random() * 3));
	const [characterDesc, setCharacterDesc] = useState<boolean>(false);
	const [missions, setMissions] = useState<Mission[]>([]);

	// 데이터
	const data: Mission[] = [
		{
			mission_id: 'lv1_1',
			mission: 'I am trying to',
			meaning: '~ 해 보려고 하는 중이에요',
			complete: false,
		},
		{
			mission_id: 'lv1_2',
			mission: 'I am ready to',
			meaning: '~ 할 준비가 되었어요',
			complete: false,
		},
		{
			mission_id: 'lv1_3',
			mission: 'I am just about to',
			meaning: '지금 막 ~ 하려는 참이에요',
			complete: false,
		},
	];

	const getMissions = async () => {
		try {
			const response = await axios.get('https://43.203.227.36.sslip.io/server/missions');
			console.log('미션 데이터:', response.data);
			setMissions(response.data);
			// setMissions(data); // 더미 데이터
		} catch (error) {
			console.error('Fetch and play audio error:', error);
		}
	};

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

	const fetchAndPlayAudio = async (inputText: string) => {
		try {
			setAudioLoad(true);

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
			setAiMsg((prevData: AiMsg) => ({ ...prevData, ...result }));

			setAudioLoad(false);
			const file = await fetch('/pooh.wav', { credentials: 'include' });
			const blob = await file.blob();
			const objectURL = URL.createObjectURL(blob);

			if (audioRef.current) {
				audioRef.current.src = objectURL;
			}
			playAudio();
			setFirstAudioMsg(true);
		} catch (error) {
			console.error('Fetch and play audio error:', error);
		}
	};

	function playAudio() {
		const player = audioRef.current;
		if (player) {
			setPlayState(!playState);
			playState ? player.pause() : player.play();

			player.addEventListener('timeupdate', function () {
				const currentTime = player.currentTime;
				const end = player.duration;
				const percentage = Math.floor((currentTime / end) * 100);
				setDuration(percentage);
				if (percentage >= 100) {
					setPlayState(false); //오디오 재생 중인 상태 체크
					micRef.current && micRef.current.focus();
				}
			});
		}
	}

	const checkMission = async (inputText: string) => {
		// const missionData = data.map(item => `mission_id: ${item.mission_id}\nmission: ${item.mission}\n`).join('\n')
		// const postData =`${missionData}\nchat:${inputText}`;
		// const postData = {
		//  missions: data.map(item => ({ mission_id: item.mission_id, mission: item.mission })),
		//  chat: inputText
		// };
		const reducedMissions = data.map(({ mission_id, mission }) => ({ mission_id, mission }));

		// console.log('postData',reducedMissions);
		try {
			const response = await axios.post('https://43.203.227.36.sslip.io/server/checkMission', {
				missions: reducedMissions,
				chat: inputText,
			});
			const checkData = response.data;
			console.log('중간 데이터', checkData);

			if (Array.isArray(checkData)) {
				console.log('data는 배열입니다.');
			} else {
				console.log('data는 배열이 아닙니다.');
				if (checkData != ' none') {
					let dataArray: string[] = [];
					try {
						dataArray = JSON.parse(checkData.replace(/'/g, '"'));
						console.log('배열 변환 완료: ', dataArray);
					} catch (error) {
						console.error('배열 변환 에러: ', error);
					}
				}
			}
		} catch (error) {
			console.error('missionError: ', error);
		}
	};

	const sendMessage = async (e: React.FormEvent) => {
		e.preventDefault();
		const inputText = textareaRef.current?.value || '';
		if (inputText.trim().length === 0) {
			alert('입력된 대화 내용이 없습니다.');
			return false;
		}
		try {
			setTalkMessages((prevData) => [...prevData, `user: ${inputText}`]);
			await fetchAndPlayAudio(inputText);

			setMissions((prevData) =>
				prevData.map((mission) => (mission.mission === inputText ? { ...mission, complete: true } : mission))
			);

			if (missions?.filter((item) => item.mission === inputText && !item.complete).length) firework();
			textareaRef.current!.value = '';
			micRef.current!.focus();

			await checkMission(inputText);
		} catch (error) {
			console.log(error);
		}
	};

	const finishChat = async () => {
		const todayMissionLength = missions.length;
		const todayMissionCount = missions.filter((data) => data.complete).length;
		if (
			authuser.result &&
			todayMissionLength > 0 &&
			todayMissionCount < todayMissionLength &&
			!window.confirm('오늘의 학습 미션을 달성하지 못하였습니다. 그만하시겠습니까?')
		)
			return;

		try {
			setCorrectLoad(true);

			const resCorrect = await axios.post(
				'https://43.203.227.36.sslip.io/server/chat/getCorrection',
				{ messages: talkMessages },
				{ withCredentials: true }
			);
			const correctedMsg = await resCorrect.data;
			correctedMsg.forEach(function (msg: string) {
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

			if (authuser.result) {

        const completedMissions = [];
        missions.forEach((mission) => {
          if (mission.complete) {
            completedMissions.push(mission.mission_id);
          }
        });
        console.log('개수',completedMissions);

				await axios
					.post(
						'https://43.203.227.36.sslip.io/server/room/newRoom',
						{
							ai: 'pooh',
							messages: correctedMsg,
						},
						{ withCredentials: true }
					)
					.then(function (response) {
						console.log(response.data);
						// roomid = response.data;
					})
					.catch((error) => {
						console.log('룸생성 에러:', error);
					});


          if (completedMissions.length > 0) {
            try {
              console.log('인:',completedMissions);
              const response = await axios.post(
                'https://43.203.227.36.sslip.io/server/missionComplete',
                {
                  mission_id: completedMissions,
                },
                {
                  headers: {
                    'Content-Type': 'application/json',
                  },
                }
              );
              console.log('POST 요청 성공:', response.data);
            } catch (error) {
              console.error('POST 요청 실패:', error);
            }
          }
			}
      const completedMissions = [];
				missions.forEach((mission) => {
					if (mission.complete) {
						completedMissions.push(mission.mission_id);
					}
				});
				console.log(completedMissions);

				if (completedMissions.length > 0) {
					try {
						const response = await axios.post(
							'https://43.203.227.36.sslip.io/server/missionComplete',
							{
								mission_id: completedMissions,
							},
							{
								headers: {
									'Content-Type': 'application/json',
								},
							}
						);
						console.log('POST 요청 성공:', response.data);
					} catch (error) {
						console.error('POST 요청 실패:', error);
					}
				}
		} catch (error) {
			console.error('에러 발생:', error);
		}
		setFirstAudioMsg(false);
	};
	const inputHandler = () => {
		const parentNode = textareaRef.current!.parentNode as HTMLElement;
		return (parentNode.dataset.value = textareaRef.current!.value);
	};

	// 마이크 캡처
	const mediaRecorderRef = useRef<MediaRecorder | null>(null);
	const chunksRef = useRef<Blob[]>([]);

	const handleStartRecording = async () => {
		micRef.current!.focus();
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
			textareaRef.current!.value = response.data;
			setIsTyped(false);
			textareaRef.current!.focus();
		} catch (error) {
			console.error('Error sending audio data:', error);
		}
	};

	const emoHandler = (idx: number) => {
		setBgNum(idx);
	};

	return (
		<>
			<div className="list-talk bg-cover bg-no-repeat bg-center ">
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

					<button type="button" className="btn-mission " onClick={() => setIsPop(!isPop)}>
						<img src={`/mission/pooh_mission_on.png`} alt="" />{' '}
						{missions?.length > 0 ? `${missions?.filter((data) => data.complete).length}/${missions.length}` : '미션'}
					</button>
					<Popup title={'오늘의 학습 미션'} mssDatas={missions} isPop={isPop} setIsPop={setIsPop} />

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
								<Popup
									title={'캐릭터 소개'}
									charDatas={characterInfo}
									isPop={characterDesc}
									setIsPop={setCharacterDesc}
								/>

								<button className="btn-history" onClick={() => setHistory(!history)}>
									<PiListMagnifyingGlassDuotone
										className={`text-2xl ${talkMessages.length == 0 ? ' text-gray-400' : ''}`}
									/>
								</button>
							</dt>
							<dd className="message">{aiMsg.result ? aiMsg.aimsg : '대화를 시작 해보세요~'}</dd>
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
								<Popup
									title={'교정 목록'}
									authUser={authuser}
									missions={missions}
									correctDatas={correctList}
									isPop={isFinishPop}
									setIsPop={setIsFinishPop}
								/>
							</div>
						</div>
					</form>
				</div>
			</div>
		</>
	);
}

export default Talk;
