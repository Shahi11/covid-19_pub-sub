import React, { useEffect, useState } from "react";
import "./subscribe.css";
import Swal from "sweetalert2";

const INIT_SUBSCRIPTIONS = {
  service1: false,
  service2: false,
  service3: false,
  service4: false,
  service5: false,
  service6: false,
  service7: false,
  service8: false,
  service9: false,
  service10: false,
};

const Home = () => {
  const [subscriptionStatuses, setSubscriptionStatuses] =
    useState(INIT_SUBSCRIPTIONS);

  useEffect(() => {
    const email = sessionStorage.getItem("USER_EMAIL");
    const res = fetch("http://localhost:5000/lsds/subscribe/list/" + email, {
      method: "GET",
      mode: "cors",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);

        sessionStorage.setItem("service1", data.service1 || false);
        sessionStorage.setItem("service2", data.service2 || false);
        sessionStorage.setItem("service3", data.service3 || false);
        sessionStorage.setItem("service4", data.service4 || false);
        sessionStorage.setItem("service5", data.service5 || false);
        sessionStorage.setItem("service6", data.service6 || false);
        sessionStorage.setItem("service7", data.service7 || false);
        sessionStorage.setItem("service8", data.service8 || false);
        sessionStorage.setItem("service9", data.service9 || false);
        sessionStorage.setItem("service10", data.service10 || false);
        sessionStorage.setItem("deadvertise", data.deadvertise || false);

        setSubscriptionStatuses({
          service1: data.service1 || false,
          service2: data.service2 || false,
          service3: data.service3 || false,
          service4: data.service4 || false,
          service5: data.service5 || false,
          service6: data.service6 || false,
          service7: data.service7 || false,
          service8: data.service8 || false,
          service9: data.service9 || false,
          service10: data.service10 || false,
        });
      });
    // setSubscriptionStatuses here
  }, []);

  const goToLogin = () => {
    window.location.href = "/login-page";
  };
  const goToRegister = () => {
    window.location.href = "/signup";
  };

  const handleSubmit = (serviceName) => {
    console.log("Here");
    let finalStatuses = {
      ...subscriptionStatuses,
    };
    finalStatuses[serviceName] = !finalStatuses[serviceName];
    setSubscriptionStatuses(finalStatuses);
    console.log(finalStatuses);

    const res = fetch("http://localhost:5000/lsds/subscribe/add", {
      method: "POST",
      mode: "cors",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: sessionStorage.getItem("USER_EMAIL"),
        [serviceName]: finalStatuses[serviceName],
      }),
    })
      .then((res) => res.json())
      .then((res) => {
        sessionStorage.setItem(serviceName, finalStatuses[serviceName]);
        if (finalStatuses[serviceName]) {
          Swal.fire({
            title: "Successfully Subscribed",
            icon: "success",
            buttons: ["NO", "YES"],
          }).then(function (isConfirm) {
            if (isConfirm) {
            } else {
              //if no clicked => do something else
            }
          });
        } else {
          Swal.fire({
            title: "Successfully Unsubscribed! Sad to see you go",
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

  const goHome = () => {
    window.location.href = "/login";
  };

  return (
    <div>
      <divs>
        <h1>COVID-19 TRACKER</h1>
        <h6>
          click on subscribe buttons to stay updated with latest covid related
          feed!
        </h6>
        <div class="logger">
          <link
            rel="stylesheet"
            href="https://maxcdn.bootstrapcdn.com/font-awesome/4.4.0/css/font-awesome.min.css"
          />

          <p>
            <i class="fa fa-user"></i> : {sessionStorage.getItem("USER_EMAIL")}
          </p>
        </div>
      </divs>

      {/* TOPIC 1 */}
      <div class="user js-user-1">
        <div class="head">
          <h3>Covid Hotspot Countries</h3>
        </div>
        <butt
          id="demo"
          onClick={() => handleSubmit("service1")}
          style={{
            backgroundColor: !subscriptionStatuses.service1
              ? "rgb(230, 108, 108)"
              : "rgb(4, 190, 60)",
          }}
        >
          {!subscriptionStatuses.service1
            ? "UNSUBSCRIBED!  Click me to subscribe"
            : "SUBSCRIBED! Click me to unsubscribe"}
        </butt>
      </div>

      {/* TOPIC 2 */}
      <div class="user js-user-1">
        <div class="head">
          <h3>Top 10 Testing Countries</h3>
        </div>
        <butt
          id="demo"
          onClick={() => handleSubmit("service2")}
          style={{
            backgroundColor: !subscriptionStatuses.service2
              ? "rgb(230, 108, 108)"
              : "rgb(4, 190, 60)",
          }}
        >
          {!subscriptionStatuses.service2
            ? "UNSUBSCRIBED!  Click me to subscribe"
            : "SUBSCRIBED! Click me to unsubscribe"}
        </butt>
      </div>

      {/* TOPIC 3 */}
      <div class="user js-user-1">
        <div class="head">
          <h3>Safe Countries to Travel</h3>
        </div>
        <butt
          id="demo"
          onClick={() => handleSubmit("service3")}
          style={{
            backgroundColor: !subscriptionStatuses.service3
              ? "rgb(230, 108, 108)"
              : "rgb(4, 190, 60)",
          }}
        >
          {!subscriptionStatuses.service3
            ? "UNSUBSCRIBED!  Click me to subscribe"
            : "SUBSCRIBED! Click me to unsubscribe"}
        </butt>
      </div>

      {/* TOPIC 4 */}
      <div class="user js-user-1">
        <div class="head">
          <h3>Countries with Most Active Cases</h3>
        </div>
        <butt
          id="demo"
          onClick={() => handleSubmit("service4")}
          style={{
            backgroundColor: !subscriptionStatuses.service4
              ? "rgb(230, 108, 108)"
              : "rgb(4, 190, 60)",
          }}
        >
          {!subscriptionStatuses.service4
            ? "UNSUBSCRIBED!  Click me to subscribe"
            : "SUBSCRIBED! Click me to unsubscribe"}
        </butt>
      </div>

      {/* TOPIC 5 */}
      <div class="user js-user-1">
        <div class="head">
          <h3>Most Death Suffering Countries</h3>
        </div>
        <butt
          id="demo"
          onClick={() => handleSubmit("service5")}
          style={{
            backgroundColor: !subscriptionStatuses.service5
              ? "rgb(230, 108, 108)"
              : "rgb(4, 190, 60)",
          }}
        >
          {!subscriptionStatuses.service5
            ? "UNSUBSCRIBED!  Click me to subscribe"
            : "SUBSCRIBED! Click me to unsubscribe"}
        </butt>
      </div>

      {/* TOPIC 6 */}
      <div class="user js-user-1">
        <div class="head">
          <h3>Countries with Least Testing ratio</h3>
        </div>
        <butt
          id="demo"
          onClick={() => handleSubmit("service6")}
          style={{
            backgroundColor: !subscriptionStatuses.service6
              ? "rgb(230, 108, 108)"
              : "rgb(4, 190, 60)",
          }}
        >
          {!subscriptionStatuses.service6
            ? "UNSUBSCRIBED!  Click me to subscribe"
            : "SUBSCRIBED! Click me to unsubscribe"}
        </butt>
      </div>

      {/* TOPIC 7 */}
      <div class="user js-user-1">
        <div class="head">
          <h3>Countries with Most Critical Cases</h3>
        </div>
        <butt
          id="demo"
          onClick={() => handleSubmit("service7")}
          style={{
            backgroundColor: !subscriptionStatuses.service7
              ? "rgb(230, 108, 108)"
              : "rgb(4, 190, 60)",
          }}
        >
          {!subscriptionStatuses.service7
            ? "UNSUBSCRIBED!  Click me to subscribe"
            : "SUBSCRIBED! Click me to unsubscribe"}
        </butt>
      </div>

      {/* TOPIC 8 */}
      <div class="user js-user-1">
        <div class="head">
          <h3>Least Active Cases Countires</h3>
        </div>
        <butt
          id="demo"
          onClick={() => handleSubmit("service8")}
          style={{
            backgroundColor: !subscriptionStatuses.service8
              ? "rgb(230, 108, 108)"
              : "rgb(4, 190, 60)",
          }}
        >
          {!subscriptionStatuses.service8
            ? "UNSUBSCRIBED!  Click me to subscribe"
            : "SUBSCRIBED! Click me to unsubscribe"}
        </butt>
      </div>

      {/* TOPIC 9 */}
      <div class="user js-user-1">
        <div class="head">
          <h3>Countries with Least Deaths</h3>
        </div>
        <butt
          id="demo"
          onClick={() => handleSubmit("service9")}
          style={{
            backgroundColor: !subscriptionStatuses.service9
              ? "rgb(230, 108, 108)"
              : "rgb(4, 190, 60)",
          }}
        >
          {!subscriptionStatuses.service9
            ? "UNSUBSCRIBED!  Click me to subscribe"
            : "SUBSCRIBED! Click me to unsubscribe"}
        </butt>
      </div>

      {/* TOPIC 10 */}
      <div class="user js-user-1">
        <div class="head">
          <h3>Least Critical Cases Countries</h3>
        </div>
        <butt
          id="demo"
          onClick={() => handleSubmit("service10")}
          style={{
            backgroundColor: !subscriptionStatuses.service10
              ? "rgb(230, 108, 108)"
              : "rgb(4, 190, 60)",
          }}
        >
          {!subscriptionStatuses.service10
            ? "UNSUBSCRIBED!  Click me to subscribe"
            : "SUBSCRIBED! Click me to unsubscribe"}
        </butt>
      </div>

      <div class="box-1">
        <div class="btnn btn-one" onClick={goHome}>
          <span>BACK</span>
        </div>
      </div>
    </div>
  );
};

export default Home;
