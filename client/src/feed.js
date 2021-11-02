import React, { useEffect, useState } from "react";
import "./feed.css";
import { subscribeToTopic } from "./subscriber";
import Swal from "sweetalert2";

const setStorages = () => {
  if (sessionStorage.getItem("service1") == "true") {
    subscribeToTopic("casestotal");
  }
  if (sessionStorage.getItem("service2") == "true") {
    subscribeToTopic("totalTestsmost");
  }
  if (sessionStorage.getItem("service3") == "true") {
    subscribeToTopic("safeCountriesToVisit");
  }
  if (sessionStorage.getItem("service4") == "true") {
    subscribeToTopic("casesactivemost");
  }
  if (sessionStorage.getItem("service5") == "true") {
    subscribeToTopic("deathstotalDeathsmost");
  }
  if (sessionStorage.getItem("service6") == "true") {
    subscribeToTopic("totalTestsleast");
  }
  if (sessionStorage.getItem("service7") == "true") {
    subscribeToTopic("casescriticalmost");
  }
  if (sessionStorage.getItem("service8") == "true") {
    subscribeToTopic("casesactiveleast");
  }
  if (sessionStorage.getItem("service9") == "true") {
    subscribeToTopic("deathstotalDeathsleast");
  }
  if (sessionStorage.getItem("service10") == "true") {
    subscribeToTopic("casescriticalleast");
  }
  if (sessionStorage.getItem("deadvertise") == "false") {
    subscribeToTopic("ad");
  }
};

const Home = () => {
  const [service1Data, setService1Data] = useState(null);
  const [service2Data, setService2Data] = useState(null);
  const [service3Data, setService3Data] = useState(null);

  const [service4Data, setService4Data] = useState(null);
  const [service5Data, setService5Data] = useState(null);
  const [service6Data, setService6Data] = useState(null);
  const [service7Data, setService7Data] = useState(null);
  const [service8Data, setService8Data] = useState(null);
  const [service9Data, setService9Data] = useState(null);
  const [service10Data, setService10Data] = useState(null);

  const [heading, setHeading] = useState(null);
  const [adData, setadData] = useState(null);
  const [deadvertise, setDeadvertise] = useState(null);

  const setDatas = () => {
    setService1Data(JSON.parse(sessionStorage.getItem("casestotal")));
    setService2Data(JSON.parse(sessionStorage.getItem("totalTestsmost")));
    setService3Data(JSON.parse(sessionStorage.getItem("safeCountriesToVisit")));

    setService4Data(JSON.parse(sessionStorage.getItem("casesactivemost")));
    setService5Data(
      JSON.parse(sessionStorage.getItem("deathstotalDeathsmost"))
    );
    setService6Data(JSON.parse(sessionStorage.getItem("totalTestsleast")));
    setService7Data(JSON.parse(sessionStorage.getItem("casescriticalmost")));
    setService8Data(JSON.parse(sessionStorage.getItem("casesactiveleast")));
    setService9Data(
      JSON.parse(sessionStorage.getItem("deathstotalDeathsleast"))
    );
    setService10Data(JSON.parse(sessionStorage.getItem("casescriticalleast")));

    setadData(JSON.parse(sessionStorage.getItem("ad")));
    setDeadvertise(sessionStorage.getItem("deadvertise"));
    if (sessionStorage.getItem("service1") == "true") {
      subscribeToTopic("casestotal");
    }

    if (sessionStorage.getItem("service2") == "true") {
      subscribeToTopic("totalTestsmost");
    }

    if (sessionStorage.getItem("service3") == "true") {
      subscribeToTopic("safeCountriesToVisit");
    }
    if (sessionStorage.getItem("deadvertise") == "false") {
      subscribeToTopic("ad");
    }

    if (sessionStorage.getItem("service4") == "true") {
      subscribeToTopic("casesactivemost");
    }
    if (sessionStorage.getItem("service5") == "true") {
      subscribeToTopic("deathstotalDeathsmost");
    }
    if (sessionStorage.getItem("service6") == "true") {
      subscribeToTopic("totalTestsleast");
    }
    if (sessionStorage.getItem("service7") == "true") {
      subscribeToTopic("casescriticalmost");
    }
    if (sessionStorage.getItem("service8") == "true") {
      subscribeToTopic("casesactiveleast");
    }
    if (sessionStorage.getItem("service9") == "true") {
      subscribeToTopic("deathstotalDeathsleast");
    }
    if (sessionStorage.getItem("service10") == "true") {
      subscribeToTopic("casescriticalleast");
    }
    if (sessionStorage.getItem("deadvertise") == "false") {
      subscribeToTopic("ad");
    }
  };

  const handledeadvertise = () => {
    const res = fetch("http://localhost:5000/lsds/deadvertise", {
      method: "POST",
      mode: "cors",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: sessionStorage.getItem("USER_EMAIL"),
        deadvertise: true,
      }),
    })
      .then((res) => res.json())
      .then((res) => {
        setDeadvertise(true);
        sessionStorage.setItem("deadvertise", true);
        if (true) {
          Swal.fire({
            title: "You won't receive advertisements anymore!",
            icon: "success",
            buttons: ["NO", "YES"],
          }).then(function (isConfirm) {
            if (isConfirm) {
            } else {
              //if no clicked => do something else
            }
          });
        }
      })
      .catch((err) => console.log("My error, ", err));
  };

  useEffect(() => {
    setStorages();
    setDatas();
    window.addEventListener("fetch-ls", setDatas);
    if (sessionStorage.getItem("service1") == "false") {
      setHeading(<h4>Top covid hit countries:</h4>);
    } else if (sessionStorage.getItem("service2") == "false") {
      setHeading(<h4>Top covid testing countries:</h4>);
    } else {
      setHeading(<h4>Safe to travel countries:</h4>);
    }
    return () => {
      window.removeEventListener("fetch-ls", setDatas);
    };
  }, []);

  const countryTab = ({ country }) => (
    <>
      <div className="countryTab">{country}</div>
    </>
  );

  return (
    <div>
      <header>
        <h2>Welcome! {sessionStorage.getItem("USER_EMAIL")}</h2>
        <h4>Here are your subscribed data!</h4>
      </header>
      <br />
      {sessionStorage.getItem("service1") == "false" &&
        sessionStorage.getItem("service2") == "false" &&
        sessionStorage.getItem("service3") == "false" &&
        sessionStorage.getItem("service4") == "false" &&
        sessionStorage.getItem("service5") == "false" &&
        sessionStorage.getItem("service6") == "false" &&
        sessionStorage.getItem("service7") == "false" &&
        sessionStorage.getItem("service8") == "false" &&
        sessionStorage.getItem("service9") == "false" &&
        sessionStorage.getItem("service10") == "false" && (
          <>
            <div>
              <h3>
                You are not subscribed to any topic! Please go to homepage and
                subscribe to some topics.
              </h3>
            </div>
          </>
        )}

      <br />
      {sessionStorage.getItem("service1") == "true" && service1Data && (
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
      {sessionStorage.getItem("service2") == "true" && service2Data && (
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
      {sessionStorage.getItem("service3") == "true" && service3Data && (
        <>
          <h2>SAFE COUNTRIES TO TRAVEL</h2>
          <div className="serviceContainer">
            {service3Data.map((x) => {
              return countryTab(x);
            })}
          </div>
        </>
      )}

      <br />
      {sessionStorage.getItem("service4") == "true" && service4Data && (
        <>
          <h2>COUNTRIES WITH MOST ACTIVE CASES</h2>
          <div className="serviceContainer">
            {service4Data.map((x) => {
              return countryTab(x);
            })}
          </div>
        </>
      )}

      <br />
      {sessionStorage.getItem("service5") == "true" && service5Data && (
        <>
          <h2>MOST DEATH SUFFERING COUNTRIES</h2>
          <div className="serviceContainer">
            {service5Data.map((x) => {
              return countryTab(x);
            })}
          </div>
        </>
      )}
      <br />
      {sessionStorage.getItem("service6") == "true" && service6Data && (
        <>
          <h2>COUNTIRES WITH LEAST TESTING RATIO</h2>
          <div className="serviceContainer">
            {service6Data.map((x) => {
              return countryTab(x);
            })}
          </div>
        </>
      )}
      <br />
      {sessionStorage.getItem("service7") == "true" && service7Data && (
        <>
          <h2>COUNTRIES WITH MOST CRITICAL CASES</h2>
          <div className="serviceContainer">
            {service7Data.map((x) => {
              return countryTab(x);
            })}
          </div>
        </>
      )}
      <br />
      {sessionStorage.getItem("service8") == "true" && service8Data && (
        <>
          <h2>LEAST ACTIVE CASES COUNTRIES</h2>
          <div className="serviceContainer">
            {service8Data.map((x) => {
              return countryTab(x);
            })}
          </div>
        </>
      )}
      <br />
      {sessionStorage.getItem("service9") == "true" && service9Data && (
        <>
          <h2>COUNTRIES WITH LEAST DEATHS</h2>
          <div className="serviceContainer">
            {service9Data.map((x) => {
              return countryTab(x);
            })}
          </div>
        </>
      )}
      <br />
      {sessionStorage.getItem("service10") == "true" && service10Data && (
        <>
          <h2>LEAST CRITICAL CASES COUNTRIES</h2>
          <div className="serviceContainer">
            {service10Data.map((x) => {
              return countryTab(x);
            })}
          </div>
        </>
      )}

      <br />
      {(sessionStorage.getItem("service1") == "false" ||
        sessionStorage.getItem("service2") == "false" ||
        sessionStorage.getItem("service3") == "false" ||
        sessionStorage.getItem("service4") == "false" ||
        sessionStorage.getItem("service5") == "false" ||
        sessionStorage.getItem("service6") == "false" ||
        sessionStorage.getItem("service7") == "false" ||
        sessionStorage.getItem("service8") == "false" ||
        sessionStorage.getItem("service9") == "false" ||
        sessionStorage.getItem("service10") == "false") &&
        deadvertise == "false" &&
        adData && (
          <>
            <div>
              <h5 class="ad">
                Advertisement:
                <button class="buttonn" onClick={handledeadvertise}>
                  <span>Not interested </span>
                </button>
              </h5>
              <h6>
                You can subsribe to this topic to stay updated with the latest
                covid related information like below:
              </h6>
              <h2>{!!heading && heading}</h2>

              <div className="serviceContainerad">
                {adData.map((x) => {
                  return countryTab(x);
                })}
              </div>
            </div>
          </>
        )}

      <br />
    </div>
  );
};

export default Home;
