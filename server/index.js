const CovidTallyPubSub = require("../models/CovidTallyPubSub");
const CasesSorted = require("../models/CasesSorted");
const tests = require("../models/tests");
const CasesSortedReverse = require("../models/CasesSortedReverse");
let cache = [];
let cache1 = [];
let cache2 = [];
var io = require("socket.io-client");
var socket = io.connect("http://localhost:3004/", {
  reconnection: true,
});

const express = require("express");
const bodyParser = require("body-parser");
const MongoClient = require("mongodb").MongoClient;
const fetch = (...args) =>
  import("node-fetch").then(({ default: fetch }) => fetch(...args));
const cors = require("cors");

const url = `mongodb://localhost:27017`;
const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};
const routes = require("../routes/routes.js");
const { response } = require("express");
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
/*
cron.schedule('/30 * * * *', checkUpdates());

function checkUpdates()
{
  fetchallAPI()
  console.log('Inside check updates ')
  router.post('/covidTally', (req, res, next) => {
    if(req.body.country == )
    const newDocument = new CovidTally(req.body.country, req.body.code, req.body.confirmed, req.body.recovered, req.body.critical,req.body.deaths,req.body.lastupdate)
    req.app.locals.db.collection('CovidTally').insertOne({
      newDocument
    }, (err, result) => {
      if (err) {
        res.status(400).send({'error': err})
      }
      res.status(200).send(result)
    })
  })
}
*/

MongoClient.connect(url, options, (err, database) => {
  if (err) {
    console.log(`FATAL MONGODB CONNECTION ERROR: ${err}:${err.stack}`);
    process.exit(1);
  }
  app.locals.db = database.db("api");
  const listener = http.listen(4000, "0.0.0.0", () => {
    console.log(listener.address && listener.address());
    console.log("Listening on port " + port);
    app.emit("APP_STARTED");

    // Scheduler : runs every 10 seconds
    setInterval(checkUpdates, 20000);
  });
});

const task = async (sortKey, sortIndex = -1, tableName, callback) => {
  let arrayOfPromises1 = [];
  console.log("inside task");
  await app.locals.db.collection(tableName).deleteMany({});
  let sortedTotalCases = {
    [`newDocument.${sortKey}`]: sortIndex,
  };
  await app.locals.db
    .collection("CovidTallyPubSub")
    .find({})
    .sort(sortedTotalCases)
    .toArray((err, res) => {
      if (err) throw err;
      let status = false;
      let status1 = false;
      let status2 = false;

      var serviceArray = [];
      if(cache.length !=0 && cache1.length !=0 && cache2.length !=0) {
        for (var k = 0; k < 10; k++) {
          if (tableName == "CasesSorted" && cache[k] != res[k].newDocument.country) {
            console.log('Abhinav 1', cache[k], JSON.stringify(res[k].newDocument.country))
            status = true;
            break;
          }
          if (tableName == "tests" && cache1[k] != res[k].newDocument.country) {
            console.log('Abhinav 2', cache1[k], JSON.stringify(res[k].newDocument.country))
            status1 = true;
            break;
          }
          if (tableName == "CasesSortedReverse" && cache2[k] != res[k].newDocument.country) {
            console.log('Abhinav 3', cache2[k], JSON.stringify(res[k].newDocument.country))
            status2 = true;
            break;
          }
        }
      }
      else{
        status1 = true
        status = true
        status2 = true
       }
      console.log(status,cache)
      console.log(status1,cache1)
      console.log(status2,cache2)

      console.log("----------------")
      for (var j = 0; j < 10; ++j) {
        let i = j;
        arrayOfPromises1.push(
          new Promise(async (resolve, reject) => {
            if (res) {
              let newServiceOne;
              switch (tableName) {
                case "CasesSorted":
                  if (status) {
                    cache[i] = res[i].newDocument.country;
                    newServiceOne = new tests(
                        res[i].newDocument.country,
                        res[i].newDocument.casestotal
                    );
                    serviceArray.push(newServiceOne);
                  }

                  break;

                case "tests":
                  if (status1) {
                    cache1[i] = res[i].newDocument.country;
                    newServiceOne = new tests(
                        res[i].newDocument.country,
                        res[i].newDocument.teststotalTests
                    );
                    serviceArray.push(newServiceOne);
                  }

                  break;

                case "CasesSortedReverse":
                  if (status2) {
                    cache2[i] = res[i].newDocument.country;
                    newServiceOne = new tests(
                        res[i].newDocument.country,
                        res[i].newDocument.casestotal
                    );
                    serviceArray.push(newServiceOne);
                  }

                  break;
              }

              await app.locals.db.collection(tableName).insertOne(
                {
                  newServiceOne,
                },
                (err, result) => {
                  if (err) {
                    console.log("Error ");
                  } else {
                    resolve({
                      message: sortKey + " table updated with new data",
                    });
                  }
                }
              );
            }
          })
        );
      }
      socket.on("connect", function () {
        console.log("connected to localhost:3004");
        if (Object.keys(serviceArray).length > 0) {
          socket.emit("pubToBroker", serviceArray);
        }
      });
      //
    });

  await Promise.all(arrayOfPromises1).then((res) => {
    // Task 1 Complete
    console.log(
      "============ TASK COMPLETE OF ========================",
      sortKey
    );
    // Table CasesSorted Filled Now
    callback();
  });
};

async function checkUpdates() {
  // Fetch live data
  const apiResponse = await fetch(
    "https://covid-193.p.rapidapi.com/statistics",
    {
      method: "GET",
      headers: {
        "x-rapidapi-host": "covid-193.p.rapidapi.com",
        "x-rapidapi-key": "fd51e69fc8msh9d43dafdb78de59p1df5dbjsnadba2b304e1b",
      },
    }
  ).then((apiResponse) => apiResponse.json());

  // Fetch statistics from our db
  const apilen = apiResponse.response.length;
  let arrayOfPromises = [];

  //// Putting API Data to DB
  for (let i = 0; i < apilen; i++) {
    arrayOfPromises.push(
      new Promise(async (resolve, reject) => {
        await app.locals.db.collection("CovidTallyPubSub").findOne(
          {
            "newDocument.country": apiResponse.response[i].country,
          },
          async (err, result) => {
            if (err) {
              reject("Error");
            }
            // if (!result) {
            await app.locals.db.collection("CovidTallyPubSub").deleteMany({});
             //if ( JSON.stringify( apiResponse.response[i].country) !=  JSON.stringify( apiResponse.response[i].continent)){
            const newDocument = new CovidTallyPubSub(
              apiResponse.response[i].country,
              apiResponse.response[i].cases.active,
              apiResponse.response[i].cases.total,
              apiResponse.response[i].deaths.total,
              apiResponse.response[i].tests.total,
              apiResponse.response[i].day,
              apiResponse.response[i].time
            );
            await app.locals.db.collection("CovidTallyPubSub").insertOne(
              {
                newDocument,
              },
              (err, result) => {
                if (err) {
                  reject("Error");
                } else {
                  resolve({
                    message: "Table updated",
                    newData: i,
                  });
                }
              }
            );
              //}
          }
        );
      })
    );
  }

  console.log(await app.locals.db.collection("CasesSorted").count());
  console.log(await app.locals.db.collection("tests").count());
  console.log(await app.locals.db.collection("CasesSortedReverse").count());
  if (app.locals.db.collection("CasesSorted").count() != 10) {
    Promise.all(arrayOfPromises)
      .then(async (res) => {
        console.log("Final Result", res);
        await task("casestotal", -1, "CasesSorted", () =>
          task("teststotalTests", -1, "tests", () =>
            task("casestotal", 1, "CasesSortedReverse", () => {})
          )
        );
      })
      .catch((err) => {
        console.log("Final errors", err);
      });
  }
}

module.exports = app;
