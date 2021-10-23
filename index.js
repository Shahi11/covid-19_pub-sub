const Publisher = require("./publisher");

const express = require("express");
const bodyParser = require("body-parser");
const MongoClient = require("mongodb").MongoClient;
const cors = require("cors");
const io = require("socket.io")(3004);

const url = `mongodb://mongo:27017/api`;
const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};
const routes = require("./routes/routes.js");
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
    console.log("Listening on port 5000");
    app.emit("APP_STARTED");

    let counter = 1;
    io.on("connection", function (socket) {
      console.log("CONNECTION EST. TO PUB", socket.client.id);
      socket.on("pubToBroker", (data) => {
        console.log("Inside server");
        console.log(data);
        counter++;
        if (data && data[0].safeCountriesToVisit) {
          console.log("Inside pub");
          Publisher.publishMessage("safeCountriesToVisit", data);
        } else if (data && data[0].totalTests) {
          console.log("Inside pub");
          Publisher.publishMessage("totalTests", data);
        } else if (data && data[0].casestotal) {
          console.log("Inside pub");
          Publisher.publishMessage("casestotal", data);
        }
        console.log(counter % 5 == 0);

        if (counter % 5 == 0) {
          Publisher.publishMessage("ad", data);
        }
      });
    });
  });
});

module.exports = app;
