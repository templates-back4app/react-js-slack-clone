import React, { useEffect, useState } from "react";
import "./App.css";
import { useHistory } from "react-router-dom";
import Parse from "parse";

export const Login = () => {
  // Use react-router-dom history to manually change screens
  const history = useHistory();

  // State variables holding input values and flags
  const [currentUser, setCurrentUser] = useState(null);
  const [emailInput, setEmailInput] = useState("");
  const [passwordInput, setPasswordInput] = useState("");
  const [showSignUp, setShowSignUp] = useState(false);

  // This effect hook runs at every render and checks if there is a
  // logged in user, redirecting to Home screen if needed
  useEffect(() => {
    const checkCurrentUser = async () => {
      try {
        const user = await Parse.User.currentAsync();
        if (user !== null || currentUser !== null) {
          history.push("/home");
          return true;
        }
      } catch (_error) {}
      return false;
    };

    checkCurrentUser();
  });

  // Login using existing credentials
  const doLogin = async () => {
    // Create static copies of the input values
    // to ensure consistency
    const username = emailInput;
    const password = passwordInput;

    // Check if user informed required fields
    if (username === "" || password === "") {
      alert("Please inform your username and password!");
      return false;
    }

    // Try to login
    try {
      let user = await Parse.User.logIn(username, password);
      if (user === undefined) {
        alert("Something went wrong when trying to login, please try again!");
        return false;
      }
      // Set current user state variable to force useEffect execution
      setCurrentUser(user);
      return true;
    } catch (error) {
      alert(error);
      return false;
    }
  };

  // Signup and login with new user
  const doSignup = async () => {
    const email = emailInput;
    const password = passwordInput;

    // Check if user informed required fields
    if (email === "" || password === "") {
      alert("Please inform your email and password!");
      return false;
    }

    // Try to signup
    try {
      let user = await Parse.User.signUp(email, password, { email: email });
      if (user === undefined) {
        alert("Something went wrong when trying to sign up, please try again!");
        return false;
      }
      // Set current user state variable to force useEffect execution
      setCurrentUser(user);
      return true;
    } catch (error) {
      alert(error);
      return false;
    }
  };

  return (
    <div>
      <div className="header">
        <img
          className="header_logo"
          alt="Back4App Logo"
          src={
            "https://blog.back4app.com/wp-content/uploads/2019/05/back4app-white-logo-500px.png"
          }
        />
      </div>
      <div className="container">
        <div className="form-header">
          <h1 className="">{"React on Back4App"}</h1>
          <p className="">{"Slack clone"}</p>
        </div>
        <div className="form">
          <input
            className="form__input"
            type={"email"}
            value={emailInput}
            placeholder={"Email"}
            onChange={(event) => setEmailInput(event.target.value)}
          ></input>
          <input
            className="form__input"
            type={"password"}
            value={passwordInput}
            placeholder={"Password"}
            onChange={(event) => setPasswordInput(event.target.value)}
          ></input>
          {showSignUp === false ? (
            <>
              <button className="button" onClick={doLogin}>
                {"Log in"}
              </button>
              <button
                className="button-secondary"
                onClick={() => setShowSignUp(true)}
              >
                {"Create a new account"}
              </button>
            </>
          ) : (
            <>
              <button className="button" onClick={doSignup}>
                {"Sign up"}
              </button>
              <button
                className="button-secondary"
                onClick={() => setShowSignUp(false)}
              >
                {"Log in with existing account"}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
