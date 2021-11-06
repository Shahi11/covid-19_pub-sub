import Stomp from "stompjs";

export function subscribeToTopic(topicId) {
  var ws = new WebSocket("ws://localhost:15674/ws");
  let stompClient = Stomp.over(ws);
  stompClient.connect({}, function () {
    stompClient.subscribe(
      "queue." + sessionStorage.getItem("USER_EMAIL") + "." + topicId,
      function ({ body }) {
        body = JSON.parse(body);

        if (topicId == "ad") {
          sessionStorage.setItem("ad", JSON.stringify(body));
        }
        if (topicId == "safeCountriesToVisit") {
          sessionStorage.setItem("safeCountriesToVisit", JSON.stringify(body));
        } else if (topicId == "casestotal") {
          sessionStorage.setItem("casestotal", JSON.stringify(body));
        } else if (topicId == "totalTestsmost") {
          sessionStorage.setItem("totalTestsmost", JSON.stringify(body));
        } else if (topicId == "casesactivemost") {
          sessionStorage.setItem("casesactivemost", JSON.stringify(body));
        } else if (topicId == "deathstotalDeathsmost") {
          sessionStorage.setItem("deathstotalDeathsmost", JSON.stringify(body));
        } else if (topicId == "totalTestsleast") {
          sessionStorage.setItem("totalTestsleast", JSON.stringify(body));
        } else if (topicId == "casescriticalmost") {
          sessionStorage.setItem("casescriticalmost", JSON.stringify(body));
        } else if (topicId == "casesactiveleast") {
          sessionStorage.setItem("casesactiveleast", JSON.stringify(body));
        } else if (topicId == "deathstotalDeathsleast") {
          sessionStorage.setItem(
            "deathstotalDeathsleast",
            JSON.stringify(body)
          );
        } else if (topicId == "casescriticalleast") {
          sessionStorage.setItem("casescriticalleast", JSON.stringify(body));
        }

        const customEvent = new CustomEvent("fetch-ls", {
          detail: {
            message: "Fetch local storage now",
          },
        });
        window.dispatchEvent(customEvent);
      }
    );
  });
}
