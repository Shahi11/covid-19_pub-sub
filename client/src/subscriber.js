import Stomp from "stompjs";

export function subscribeToTopic(topicId) {
  var ws = new WebSocket("ws://localhost:15674/ws");
  let stompClient = Stomp.over(ws);
  stompClient.connect({}, function () {
    stompClient.subscribe("queue." + topicId, function ({ body }) {
      body = JSON.parse(body);
      if (body[0].safeCountriesToVisit) {
        localStorage.setItem("safeCountriesToVisit", JSON.stringify(body));
      } else if (body[0].casestotal) {
        localStorage.setItem("casestotal", JSON.stringify(body));
      } else if (body[0].totalTests) {
        localStorage.setItem("totalTests", JSON.stringify(body));
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
