import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link, useLocation } from 'react-router-dom';

import './App.css';
import Main from './main/Main';
import Home from './main/Home';
import 'bootstrap/dist/css/bootstrap.min.css';

const Navigation = () => {
  const location = useLocation();
  // if (location.pathname === "/imageviewer") {
  //   return null;
  // }

  // return (
  //   <nav>
  //     <ul>
  //       <li><button className="link-button"><Link to="/">Home</Link></button></li>
  //       <li><button className="link-button"><Link to="/imageviewer">Image Viewer</Link></button></li>
  //     </ul>
  //   </nav>
  // );
}

const App = () => (
  <Router>
    <div>
      <Navigation />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/main" element={<Main />} />
      </Routes>
    </div>
  </Router>
);

export default App;
