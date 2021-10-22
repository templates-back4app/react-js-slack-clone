import "./App.css";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { initializeParse } from "@parse/react";
import { Login } from "./Login";
import { Home } from "./Home";
const {
  REACT_APP_PARSE_APPLICATION_ID,
  REACT_APP_PARSE_LIVE_QUERY_URL,
  REACT_APP_PARSE_JAVASCRIPT_KEY,
} = process.env;

// Your Parse initialization configuration goes here
const PARSE_LIVE_QUERY_URL = REACT_APP_PARSE_LIVE_QUERY_URL;
const PARSE_APPLICATION_ID = REACT_APP_PARSE_APPLICATION_ID;
const PARSE_JAVASCRIPT_KEY = REACT_APP_PARSE_JAVASCRIPT_KEY;
// Initialize parse using @parse/react instead of regular parse JS SDK
initializeParse(
  PARSE_LIVE_QUERY_URL,
  PARSE_APPLICATION_ID,
  PARSE_JAVASCRIPT_KEY
);

function App() {
  return (
    // This app has two different screens, so we use react-router-dom
    // to manage basic routing
    <Router>
      <div className="App">
        <Switch>
          <Route path="/home">
            <Home />
          </Route>
          <Route path="/">
            <Login />
          </Route>
        </Switch>
      </div>
    </Router>
  );
}

export default App;
