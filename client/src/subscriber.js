import Stomp from "stompjs";

export function subscribeToTopic(topicId) {
  var ws = new WebSocket("ws://localhost:15674/ws");
  let stompClient = Stomp.over(ws);
  stompClient.connect({}, function () {
    stompClient.subscribe("queue." + topicId, function ({ body }) {
      body = JSON.parse(body);
      if (body[0].safeCountriesToVisit) {
        sessionStorage.setItem("safeCountriesToVisit", JSON.stringify(body));
      } else if (body[0].casestotal) {
        sessionStorage.setItem("casestotal", JSON.stringify(body));
      } else if (body[0].totalTests) {
        sessionStorage.setItem("totalTests", JSON.stringify(body));
      }
      if (topicId == "ad") {
        sessionStorage.setItem("ad", JSON.stringify(body));
      }
      const customEvent = new CustomEvent("fetch-ls", {
        detail: {
          message: "Fetch local storage now",
        },
      });
      window.dispatchEvent(customEvent);
    });
  });
}
