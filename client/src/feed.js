import React, { useEffect, useState } from "react";
import "./feed.css";
import { subscribeToTopic } from "./subscriber";

const setStorages = () => {
  if (localStorage.getItem("service1") == "true") {
    subscribeToTopic("casestotal");
  }

  if (localStorage.getItem("service2") == "true") {
    subscribeToTopic("totalTests");
  }

  if (localStorage.getItem("service3") == "true") {
    subscribeToTopic("safeCountriesToVisit");
  }
};

const Home = () => {
  const [service1Data, setService1Data] = useState(null);
  const [service2Data, setService2Data] = useState(null);
  const [service3Data, setService3Data] = useState(null);
  const goToLogin = () => {
    window.location.href = "/login-page";
  };

  const setDatas = () => {
    setService1Data(JSON.parse(localStorage.getItem("casestotal")));
    setService2Data(JSON.parse(localStorage.getItem("totalTests")));
    setService3Data(JSON.parse(localStorage.getItem("safeCountriesToVisit")));
  };

  useEffect(() => {
    setStorages();
    setDatas();
    window.addEventListener("fetch-ls", setDatas);
    return () => {
      window.removeEventListener("fetch-ls", setDatas);
    };
  }, []);

  const goToRegister = () => {
    window.location.href = "/signup";
  };

  const countryTab = ({ country }) => (
    <div className="countryTab">{country}</div>
  );

  return (
    <div>
      <headerr>
        <h2>Welcome! {localStorage.getItem("USER_EMAIL")}</h2>
        <h4>Here are your subscribed data!</h4>
      </headerr>

      <br />
      {localStorage.getItem("service1") == "true" && service1Data && (
        <>
          <h2>COVID HOTSPOTS</h2>
          <div className="serviceContainer">
            {service1Data.map((x) => {
              return countryTab(x);
            })}
          </div>
        </>
      )}
      <br />
      {localStorage.getItem("service2") == "true" && service2Data && (
        <>
          <h2>TOP TESTING SITES</h2>
          <div className="serviceContainer">
            {service2Data.map((x) => {
              return countryTab(x);
            })}
          </div>
        </>
      )}
      <br />
      {localStorage.getItem("service3") == "true" && service3Data && (
        <>
          <h2>SAFE COUNTRIES TO TRAVEL</h2>
          <div className="serviceContainer">
            {service3Data.map((x) => {
              return countryTab(x);
            })}
          </div>
        </>
      )}
    </div>
  );
};

export default Home;
