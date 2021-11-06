const CovidTallyPubSub = require("./models/CovidTallyPubSub");
const CasesSorted = require("./models/CasesSorted");
const tests = require("./models/tests");
const testsRev = require("./models/testsRev");
const CasesSortedReverse = require("./models/CasesSortedReverse");
const deathsSorted = require("./models/deathsSorted");
const deathsSortedReverse = require("./models/deathsSortedReverse");
const CasesActiveSorted = require("./models/CasesActiveSorted");
const CasesActiveSortedReverse = require("./models/CasesActiveSortedReverse");
const CriticalCasesSorted = require("./models/CriticalCasesSorted");
const CriticalCasesSortedReverse = require("./models/CriticalCasesSortedReverse");



let cache = [];
let cache1 = [];
let cache2 = [];
let cache3 = [];
let cache4 = [];
let cache5 = [];
let cache6 = [];
let cache7 = [];
let cache8 = [];
let cache9 = [];

var io = require("socket.io-client");
var socket = io.connect("http://localhost:3005/", {
  reconnection: true,
});

const express = require("express");
const bodyParser = require("body-parser");
const MongoClient = require("mongodb").MongoClient;
const fetch = (...args) =>
  import("node-fetch").then(({ default: fetch }) => fetch(...args));
const cors = require("cors");

const url = `mongodb://localhost:27017`
const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

const app = express();

app.use(cors({}));

const http = require("http").Server(app);

MongoClient.connect(url, options, (err, database) => {
  if (err) {
    console.log(`FATAL MONGODB CONNECTION ERROR: ${err}:${err.stack}`);
    process.exit(1);
  }
  app.locals.db = database.db("api");
  const listener = http.listen(4000, "0.0.0.0", () => {
    console.log(listener.address && listener.address());
    console.log("App started on port 4000");

    socket.on("connect", function () {
      console.log("connected to server:3005");
      // Scheduler : runs every 3 seconds
      setInterval(checkUpdates, 3000);
    });
  });
});

const task = async (sortKey, sortIndex = -1, tableName, callback) => {
  //Adding the updated topic/event to the respective tables.
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
      let status3 = false;
      let status4 = false;
      let status5 = false;
      let status6 = false;
      let status7 = false;
      let status8 = false;
      let status9 = false;

      var serviceArray = [];
      console.log(typeof tableName);
      if (tableName == "CasesSorted" && cache.length != 0) {//topic 1
        for (var k = 0; k < 10; k++) {
          if (cache[k] != res[k].newDocument.country) {
            console.log(
              "Abhinav 1",
              cache[k],
              JSON.stringify(res[k].newDocument.country)
            );
            status = true;
            break;
          }
        }
      } else if (tableName == "tests" && cache1.length != 0) {//topic 2
        for (var k = 0; k < 10; k++) {
          if (cache1[k] != res[k].newDocument.country) {
            console.log(
              "Abhinav 1",
              cache1[k],
              JSON.stringify(res[k].newDocument.country)
            );
            status1 = true;
            break;
          }
        }
      } else if (tableName == "CasesSortedReverse" && cache2.length != 0) {//topic 3
        for (var k = 0; k < 10; k++) {
          if (cache2[k] != res[k].newDocument.country) {
            console.log(
              "Abhinav 1",
              cache2[k],
              JSON.stringify(res[k].newDocument.country)
            );
            status2 = true;
            break;
          }
        }
      } else if (tableName == "testsRev" && cache3.length != 0) {//topic 4
        for (var k = 0; k < 10; k++) {
          if (cache3[k] != res[k].newDocument.country) {
            console.log(
                "Abhinav 1",
                cache3[k],
                JSON.stringify(res[k].newDocument.country)
            );
            status3 = true;
            break;
          }
        }
      } else if (tableName == "deathsSorted" && cache4.length != 0) {//topic 5
        for (var k = 0; k < 10; k++) {
          if (cache4[k] != res[k].newDocument.country) {
            console.log(
                "Abhinav 4 ",
                cache4[k],
                JSON.stringify(res[k].newDocument.country)
            );
            status4 = true;
            break;
          }
        }
      }else if (tableName == "deathsSortedReverse" && cache5.length != 0) {//topic 6
        for (var k = 0; k < 10; k++) {
          if (cache5[k] != res[k].newDocument.country) {
            console.log(
                "Abhinav 4 ",
                cache5[k],
                JSON.stringify(res[k].newDocument.country)
            );
            status5 = true;
            break;
          }
        }
      }else if (tableName == "CasesActiveSorted" && cache6.length != 0) {//topic 7
        for (var k = 0; k < 10; k++) {
          if (cache6[k] != res[k].newDocument.country) {
            console.log(
                "Abhinav 4 ",
                cache6[k],
                JSON.stringify(res[k].newDocument.country)
            );
            status6 = true;
            break;
          }
        }
      }else if (tableName == "CasesActiveSortedReverse" && cache7.length != 0) {//topic 8
        for (var k = 0; k < 10; k++) {
          if (cache7[k] != res[k].newDocument.country) {
            console.log(
                "Abhinav 4 ",
                cache7[k],
                JSON.stringify(res[k].newDocument.country)
            );
            status7 = true;
            break;
          }
        }
      }else if (tableName == "CriticalCasesSorted" && cache8.length != 0) {//topic 9
        for (var k = 0; k < 10; k++) {
          if (cache8[k] != res[k].newDocument.country) {
            console.log(
                "Abhinav 4 ",
                cache8[k],
                JSON.stringify(res[k].newDocument.country)
            );
            status8 = true;
            break;
          }
        }
      }else if (tableName == "CriticalCasesSortedReverse" && cache9.length != 0) {//topic 10
        for (var k = 0; k < 10; k++) {
          if (cache9[k] != res[k].newDocument.country) {
            console.log(
                "Abhinav 4 ",
                cache9[k],
                JSON.stringify(res[k].newDocument.country)
            );
            status9 = true;
            break;
          }
        }
      }else {
        status1 = true;
        status = true;
        status2 = true;
        status3 = true;
        status4 = true;
        status5 = true;
        status6 = true;
        status7 = true;
        status8 = true;
        status9 = true;
      }
      // console.log(status,cache)
      // console.log(status1,cache1)
      // console.log(status2,cache2)

      console.log("----------------");
      for (var j = 0; j < 10; ++j) {
        let i = j;
        arrayOfPromises1.push(
          new Promise(async (resolve, reject) => {
            if (res) {
              let newServiceOne;
              switch (tableName) {
                case "CasesSorted"://topic 1
                  if (status) {
                    console.log("helloo insidfe one");
                    cache[i] = res[i].newDocument.country;
                    newServiceOne = new CasesSorted(
                      res[i].newDocument.country,
                      res[i].newDocument.casestotal
                    );
                    serviceArray.push(newServiceOne);
                    console.log(serviceArray);
                  }

                  break;

                case "tests"://topic 2
                  if (status1) {
                    cache1[i] = res[i].newDocument.country;
                    newServiceOne = new tests(
                      res[i].newDocument.country,
                      res[i].newDocument.teststotalTests
                    );
                    serviceArray.push(newServiceOne);
                    console.log(serviceArray);
                  }

                  break;

                case "CasesSortedReverse"://topic 3
                  if (status2) {
                    cache2[i] = res[i].newDocument.country;
                    newServiceOne = new CasesSortedReverse(
                      res[i].newDocument.country,
                      res[i].newDocument.casestotal
                    );
                    serviceArray.push(newServiceOne);
                    console.log(serviceArray);
                  }

                  break;

                case "testsRev"://topic 4
                  if(status3){
                    cache3[i] = res[i].newDocument.country;
                    newServiceOne = new testsRev(
                        res[i].newDocument.country,
                        res[i].newDocument.teststotalTests
                    );
                    serviceArray.push(newServiceOne);
                    console.log(serviceArray);
                  }

                  break;

                case "deathsSorted"://topic 5
                  if(status4){
                    cache4[i] = res[i].newDocument.country;
                    newServiceOne = new deathsSorted(
                        res[i].newDocument.country,
                        res[i].newDocument.deathstotalDeaths
                    );
                    serviceArray.push(newServiceOne);
                    console.log(serviceArray);
                  }
                  break;

                case "deathsSortedReverse"://topic 6
                  if(status5){
                    cache5[i] = res[i].newDocument.country;
                    newServiceOne = new deathsSortedReverse(
                        res[i].newDocument.country,
                        res[i].newDocument.deathstotalDeaths
                    );
                    serviceArray.push(newServiceOne);
                    console.log(serviceArray);
                  }
                  break;

                case "CasesActiveSorted"://topic 7
                  if(status6){
                    cache6[i] = res[i].newDocument.country;
                    newServiceOne = new CasesActiveSorted(
                        res[i].newDocument.country,
                        res[i].newDocument.casesactive
                    );
                    serviceArray.push(newServiceOne);
                    console.log(serviceArray);
                  }
                  break;

                case "CasesActiveSortedReverse"://topic 8
                  if(status7){
                    cache7[i] = res[i].newDocument.country;
                    newServiceOne = new CasesActiveSortedReverse(
                        res[i].newDocument.country,
                        res[i].newDocument.casesactive
                    );
                    serviceArray.push(newServiceOne);
                    console.log(serviceArray);
                  }
                  break;


                case "CriticalCasesSorted"://topic 9
                  if(status8){
                    cache8[i] = res[i].newDocument.country;
                    newServiceOne = new CriticalCasesSorted(
                        res[i].newDocument.country,
                        res[i].newDocument.casescritical
                    );
                    serviceArray.push(newServiceOne);
                    console.log(serviceArray);
                  }
                  break;

                case "CriticalCasesSortedReverse"://topic 10
                  if(status9){
                    cache9[i] = res[i].newDocument.country;
                    newServiceOne = new CriticalCasesSortedReverse(
                        res[i].newDocument.country,
                        res[i].newDocument.casescritical
                    );
                    serviceArray.push(newServiceOne);
                    console.log(serviceArray);
                  }
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

      if (Object.keys(serviceArray).length > 0 && Object.keys(serviceArray).length % 10 == 0) {
        console.log("inside sending fiorward", serviceArray);
        socket.emit("broker1", serviceArray, 0);
      }
      cache = [];
      cache1 = [];
      cache2 = [];
      cache3 = [];
      cache4 = [];
      cache5 = [];
      cache6 = [];
      cache7 = [];
      cache8 = [];
      cache9 = [];
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
  console.log("Inside checkupdates ");
  //Getting data from the live API
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
  // console.log("API LENGTH ", apilen);

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
            await app.locals.db.collection("CovidTallyPubSub").deleteMany({});
            const newDocument = new CovidTallyPubSub(
              apiResponse.response[i].country,
              apiResponse.response[i].cases.active,
              apiResponse.response[i].cases.critical,
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
  console.log(await app.locals.db.collection("testsRev").count());


  // updating/adding data into specific tables
  if (app.locals.db.collection("CasesSorted").count() != 10) {
    Promise.all(arrayOfPromises)
      .then(async (res) => {
        await task("casestotal", -1, "CasesSorted", () =>
          task("teststotalTests", -1, "tests", () =>
            task("casestotal", 1, "CasesSortedReverse", () =>
              task("teststotalTests", 1, "testsRev", () =>
                  task("deathstotalDeaths", 1, "deathsSorted", () =>
                      task("deathstotalDeaths", -1, "deathsSortedReverse", () =>
                          task("casesactive", 1, "CasesActiveSorted", () =>
                              task("casesactive", -1, "CasesActiveSortedReverse", () =>
                                  task("casescritical", -1, "CriticalCasesSorted", () =>
                                      task("casescritical", 1, "CriticalCasesSortedReverse", () => {})
            )
          )
            )))))));
      })
      .catch((err) => {
        console.log("Final errors", err);
      });
  }
}

module.exports = app;
