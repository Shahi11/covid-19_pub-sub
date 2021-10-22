import React from "react";
import "./feed.css";

const Home = () => {
  const goToLogin = () => {
    window.location.href = "/login-page";
  };
  const goToRegister = () => {
    window.location.href = "/signup";
  };
  return (
    <div>
      <headerr>
        <h2>Welcome! {localStorage.getItem("USER_EMAIL")}</h2>
        <h4>Here are your subscribed data!</h4>
      </headerr>
    </div>
  );
};

export default Home;
