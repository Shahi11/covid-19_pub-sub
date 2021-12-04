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

function publishToMq(service, serviceName, data) {
  //Get all users subscribed to this topic
  app.locals.db
    .collection("userinfo")
    .find({
      ["newDocument." + service]: true,
    })
    .toArray((err, result) => {
      if (err) {
        res.status(400).send({ error: err });
      }
      if (result === undefined || result.length === 0) {
        console.log("No documents in database");
      } else {
        for (var k = 0; k < result.length; k++) {
          var key = result[k].newDocument.email + serviceName;
          //Publish event to all the users subscribed
          Publisher.publishMessage(key, data);
        }
      }
    });
}

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
        if (data && "safeCountriesToVisit" in data[0]) {
          console.log("Inside pub");
          //Publisher.publishMessage("safeCountriesToVisit", data);
          publishToMq("service3", ".safeCountriesToVisit", data);
        } else if (data && "totalTests" in data[0]) {
          console.log("Inside pub");
          // Publisher.publishMessage("totalTests", data);
          publishToMq("service2", ".totalTests", data);
        } else if (data && "casestotal" in data[0]) {
          console.log("Inside pub");
          //Publisher.publishMessage("casestotal", data);
          publishToMq("service1", ".casestotal", data);
        }
        console.log(counter % 5 == 0);

        if (counter % 5 == 0) {
          app.locals.db
            .collection("userinfo")
            .find({
              "newDocument.deadvertise": false || null,
            })
            .toArray((err, result) => {
              if (err) {
                res.status(400).send({ error: err });
              }
              if (result === undefined || result.length === 0) {
                console.log("No documents in database");
              } else {
                for (var k = 0; k < result.length; k++) {
                  console.log("Got the data", result[k].newDocument.email);
                  var key = result[k].newDocument.email + ".ad";
                  Publisher.publishMessage(key, data);
                }
              }
            });
        }
      });
    });
  });
});

module.exports = app;
