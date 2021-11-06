const Publisher = require("./publisher");

const express = require("express");
const bodyParser = require("body-parser");
const MongoClient = require("mongodb").MongoClient;
const cors = require("cors");
const io = require("socket.io")(3007);

var io2 = require("socket.io-client");
var socket2 = io2.connect("http://broker1:3005/", {
  reconnection: true,
});

var io3 = require("socket.io-client");
var socket3 = io3.connect("http://broker2:3006/", {
  reconnection: true,
});

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
  // code to be executed

  app.locals.db
    .collection("userinfoB3")
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

// async function SnImplement(service) {
//   return new Promise(async (resolve, reject) => {
//     const result = await app.locals.db.collection("topicinfoB3").findOne({
//       "newDocument.servicenumber": service,
//     });
//     resolve(result);
//   }).then((res) => {
//     if (!res) return false;
//     return true;
//   });
// }

MongoClient.connect(url, options, (err, database) => {
  if (err) {
    console.log(`FATAL MONGODB CONNECTION ERROR: ${err}:${err.stack}`);
    process.exit(1);
  }
  app.locals.db = database.db("api");
  const listener = http.listen(7000, "0.0.0.0", () => {
    console.log(listener.address && listener.address());
    console.log("Listening on port 7000");
    app.emit("APP_STARTED");

    let counter = 1;
    io.on("connection", async (socket) => {
      console.log("CONNECTION EST. TO PUB", socket.client.id);
      socket.on("broker3", async (data, key) => {
        console.log("Inside server");
        console.log(data);

        console.log("updated key", key);
        counter++;

        // const result8 = await SnImplement("service8");
        // const result9 = await SnImplement("service9");
        // const result10 = await SnImplement("service10");
        // console.log("1", result1);
        // console.log("2", result2);
        // console.log("3", result3);
        // console.log(key);

        if (data && "casesactiveleast" in data[0]) {
          console.log("Inside sevice 8 pub");
          publishToMq("service8", ".casesactiveleast", data);
        } else if (data && "deathstotalDeathsleast" in data[0]) {
          console.log("Inside service 9 pub");
          publishToMq("service9", ".deathstotalDeathsleast", data);
        } else if (data && "casescriticalleast" in data[0]) {
          console.log("Inside service 10 pub");
          publishToMq("service10", ".casescriticalleast", data);
        } else {
          console.log("Rendezvous to broker 1");
          socket2.emit("broker1", data, key + 1);
          console.log("Rendezvous to broker 2");
          socket3.emit("broker2", data, key + 1);
        }
      });
    });
  });
});

module.exports = app;
