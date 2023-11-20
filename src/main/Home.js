import React from 'react';
import { Link } from 'react-router-dom';
import './Home.css';

function Home() {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <button style={{ marginLeft: '20px', padding: '60px 120px', fontSize: '36px', borderRadius: '5px', backgroundColor: 'initial', color: 'initial', border: 'none' }}>
        <Link to="/imageviewer">Start</Link>
      </button>
    </div>
  );
}

export default Home;
