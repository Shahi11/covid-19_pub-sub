const Publisher = require("./server/publisher");

const express = require("express");
const bodyParser = require("body-parser");
const MongoClient = require("mongodb").MongoClient;
const cors = require("cors");
const io = require("socket.io")(3004);

const url = `mongodb://localhost:27017/api`;
const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};
const routes = require("./routes/routes.js");
const port = process.env.PORT || 80;
const app = express();
app.use(cors({}));
const http = require("http").Server(app);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use("/lsds", routes);
app.use((req, res) => {
  res.status(404);
});

MongoClient.connect(url, options, (err, database) => {
  if (err) {
    console.log(`FATAL MONGODB CONNECTION ERROR: ${err}:${err.stack}`);
    process.exit(1);
  }
  app.locals.db = database.db("api");
  const listener = http.listen(5000, "0.0.0.0", () => {
    console.log(listener.address && listener.address());
    console.log("Listening on port " + port);
    app.emit("APP_STARTED");
  });
});

io.on("connection", function (socket) {
  console.log("CONNECTION EST. TO PUB", socket.client.id);
  socket.on("pubToBroker", (data) => {
    console.log("Inside server");
    console.log(data);
    if (data && data[0].safeCountriesToVisit) {
      Publisher.publishMessage("safeCountriesToVisit", data);
    } else if (data && data[0].totalTests) {
      Publisher.publishMessage("totalTests", data);
    } else if (data && data[0].casestotal) {
      Publisher.publishMessage("casestotal", data);
    }
  });
});

module.exports = app;
