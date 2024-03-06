import './App.css';
import { Route, Routes } from 'react-router-dom';
import Layout from './Layout';
import Home from './pages/Home';
import Mypage from './pages/Mypage';
import Guide from './components/Guide';
import NotFound from './components/NotFound';
import SignUp from './components/SignUp';
import Login from './components/Login'

function App() {
	return (
		<>
			<Routes>
				<Route element={<Layout />}>
					<Route path="/" element={<Home />} />
					<Route path="/mypage" element={<Mypage />} />
					<Route path="/guide" element={<Guide />} />
					<Route path="*" element={<NotFound />} />
					<Route path='/signup' element= {<SignUp/>}/>
					<Route path='/login' element= {<Login/>}/>
				</Route>
			</Routes>
		</>
	);
}

export default App;
