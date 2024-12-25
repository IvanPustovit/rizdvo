import { BrowserRouter as Router, Route, Routes, Link, useParams } from 'react-router-dom';

import './App.css';
import UserVideoUpload from './Rizdvo';
import VideoList from './VideoList';
import VideoPlayer from './Videoplaer';

const App = () => {
  return (
    <Router>
      <Routes>
       <Route path="/" element={<UserVideoUpload />} />
        <Route path="/list" element={<VideoList />} />
        {/* <Route path="/video/:id" element={<VideoPlayer />} /> */}
      </Routes>
    </Router>
  );
};

export default App;
