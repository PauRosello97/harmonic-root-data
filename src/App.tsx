import {
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom";
import Survey from "./views/Survey/Survey";
import Results from "./views/Results/Results";
import styles from "./App.module.css";

function App() {
  return <div id={styles.App}>
    <Router basename={'/chords'}>
      <div className="app-container">
        <Routes>
          <Route path="/" element={<Results />} />
          <Route path="/survey" element={<Survey />} />
        </Routes>
      </div>
    </Router>
  </div>
}

export default App;
