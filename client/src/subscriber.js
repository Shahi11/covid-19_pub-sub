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
        if (body[0].safeCountriesToVisit) {
          sessionStorage.setItem("safeCountriesToVisit", JSON.stringify(body));
        } else if (body[0].casestotal) {
          sessionStorage.setItem("casestotal", JSON.stringify(body));
        } else if (body[0].totalTestsmost) {
          sessionStorage.setItem("totalTestsmost", JSON.stringify(body));
        } else if (body[0].casesactivemost) {
          sessionStorage.setItem("casesactivemost", JSON.stringify(body));
        } else if (body[0].deathstotalDeathsmost) {
          sessionStorage.setItem("deathstotalDeathsmost", JSON.stringify(body));
        } else if (body[0].totalTestsleast) {
          sessionStorage.setItem("totalTestsleast", JSON.stringify(body));
        } else if (body[0].casescriticalmost) {
          sessionStorage.setItem("casescriticalmost", JSON.stringify(body));
        } else if (body[0].casesactiveleast) {
          sessionStorage.setItem("casesactiveleast", JSON.stringify(body));
        } else if (body[0].deathstotalDeathsleast) {
          sessionStorage.setItem(
            "deathstotalDeathsleast",
            JSON.stringify(body)
          );
        } else if (body[0].casescriticalleast) {
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
