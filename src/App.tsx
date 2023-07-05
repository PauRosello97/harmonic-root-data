import React, { useState, useEffect } from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link
} from "react-router-dom";
import Survey from "./views/Survey/Survey";
import Results from "./views/Results/Results";
import styles from "./App.module.css";

function App() {
  return <div id={styles.App}>
    <Router basename={'/chords'}>
      <div className="app-container">
        <Routes>
          <Route path="/" element={<Survey />} />
          <Route path="/results" element={<Results />} />
        </Routes>
      </div>
    </Router>
  </div>
}

export default App;
