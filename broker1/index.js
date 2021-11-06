const Publisher = require("./publisher");

const express = require("express");
const bodyParser = require("body-parser");
const MongoClient = require("mongodb").MongoClient;
const cors = require("cors");
const io = require("socket.io")(3005);

var io2 = require("socket.io-client");
var socket2 = io2.connect("http://localhost:3006/", {
  reconnection: true,
});

var io3 = require("socket.io-client");
var socket3 = io3.connect("http://localhost:3007/", {
  reconnection: true,
});

const url = `mongodb://localhost:27017/api`;
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
  // code to be executed

  app.locals.db
    .collection("userinfoB1")
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
          Publisher.publishMessage(key, data);
        }
      }
    });
}

async function SnImplement(service) {
  return new Promise(async (resolve, reject) => {
    const result = await app.locals.db.collection("topicinfoB1").findOne({
      "newDocument.servicenumber": service,
    });
    resolve(result);
  }).then((res) => {
    if (!res) return false;
    return true;
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
    io.on("connection", async (socket) => {
      console.log("CONNECTION EST. TO PUB", socket.client.id);
      socket.on("broker1", async (data, key) => {
        console.log("Inside server");
        console.log("updated key", key);

        counter++;

        if (key < 4) {
          const result1 = await SnImplement("service1");
          const result2 = await SnImplement("service2");
          const result3 = await SnImplement("service3");
          const result4 = await SnImplement("service4");
          // console.log("1", result1);
          // console.log("2", result2);
          // console.log("3", result3);
          // console.log(key);

          if (result1 && data && data[0].casestotal) {
            console.log("Inside sevice 1 pub");
            publishToMq("service1", ".casestotal", data);
          } else if (result2 && data && data[0].totalTestsmost) {
            console.log("Inside service2 pub");
            publishToMq("service2", ".totalTestsmost", data);
          } else if (result3 && data && data[0].safeCountriesToVisit) {
            console.log("Inside service 3 pub");
            publishToMq("service3", ".safeCountriesToVisit", data);
          } else if (result4 && data && data[0].casesactivemost) {
            console.log("Inside service 4 pub");
            publishToMq("service4", ".casesactivemost", data);
          } else {
            console.log("Rendezvous to broker 2 ");
            socket2.emit("broker2", data, key + 1);
            console.log("Rendezvous to broker 3 ");
            socket3.emit("broker3", data, key + 1);
          }

          // console.log(counter % 5 == 0);
          if (counter % 25 == 0) {
            app.locals.db
              .collection("userinfoB1")
              .find({
                "newDocument.deadvertise": false,
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
        }
      });
    });
  });
});

module.exports = app;
