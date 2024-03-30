import { Route, Routes } from 'react-router-dom';
import Layout from './Layout';
import Login from './components/Login';
import SignUp from './components/SignUp';
import NotFound from './components/NotFound';
import Home from './pages/Home';
import Mypage from './pages/MyLog';
import Talk from './pages/Talk';
import Talk2 from './pages/Talk2';
import Myroom from './pages/Myroom';
import About from './pages/About';
import PreviewContent from './components/PreviewContent';
import Chat from './pages/Chat';
import Learn from './pages/Learn';
import Auth from './components/Mypage';
import Spinner from './components/Spinner';
import ReviewContent from './components/ReviewContent';
import './App.css';

function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path='/' element={<Home />} />
        <Route path='/talk/:id' element={<Talk />} />
        <Route path='/talk2/:id' element={<Talk2 />} />
        <Route path='/myroom' element={<Myroom />} />
        <Route path='/about' element={<About />} />
        <Route path='/mylog' element={<Mypage />} />
        <Route path='/mylog/:id' element={<ReviewContent />} />
        <Route path='/chat' element={<Chat />} />
        <Route path='/learning' element={<Learn />} />
        <Route path='/learning/:id' element={<PreviewContent />} />
        <Route path='*' element={<NotFound />} />
      </Route>
      <Route path='/signup' element={<SignUp />} />
      <Route path='/login' element={<Login />} />
      <Route path='/mypage' element={<Auth />} />
      <Route path='/spinner' element={<Spinner />} />
    </Routes>
  );
}

export default App;
