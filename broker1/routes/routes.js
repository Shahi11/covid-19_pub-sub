const express = require("express");
const CovidTally = require("../models/CovidTally");
const userinfoB1 = require("../models/userinfoB1");
const topicinfoB1 = require("../models/topicinfoB1");

const router = express.Router();
const fetch = (...args) =>
  import("node-fetch").then(({ default: fetch }) => fetch(...args));
const cors = require("cors");

router.get("/covidTally", (req, res, next) => {
  try {
    req.app.locals.db
      .collection("CovidTally")
      .find({})
      .toArray((err, result) => {
        if (err) {
          res.status(400).send({ error: err });
        }
        if (result === undefined || result.length === 0) {
          return res.status(400).send({ error: "No documents in database" });
        } else {
          return res.status(200).send(result);
        }
      });
  } catch (error) {
    console.log("ERRRRRRRoR", error);
  }
});

router.get("/covidTally/:id", (req, res, next) => {
  req.app.locals.db.collection("CovidTally").findOne(
    {
      "newDocument.country": req.params.id,
    },
    (err, result) => {
      if (err) {
        res.status(400).send({ error: err });
      }
      if (result === undefined) {
        res
          .status(400)
          .send({ error: "No document matching that id was found" });
      } else {
        res.status(200).send(result);
      }
    }
  );
});

router.post("/covidTally", (req, res, next) => {
  const newDocument = new CovidTally(
    req.body.country,
    req.body.code,
    req.body.confirmed,
    req.body.recovered,
    req.body.critical,
    req.body.deaths,
    req.body.lastupdate
  );
  req.app.locals.db.collection("CovidTally").insertOne(
    {
      newDocument,
    },
    (err, result) => {
      if (err) {
        res.status(400).send({ error: err });
      }
      res.status(200).send(result);
    }
  );
});

router.delete("/covidTally/:id", (req, res, next) => {
  req.app.locals.db.collection("CovidTally").deleteOne(
    {
      "newDocument.country": req.params.id,
    },
    (err, result) => {
      if (result == undefined) {
        res.status(400).send({ error: err });
      }
      res.status(200).send(result);
    }
  );
});

router.put("/covidTally/:id", (req, res, next) => {
  req.app.locals.db.collection("CovidTally").updateOne(
    {
      "newDocument.country": req.params.id,
    },
    {
      $set: {
        country: req.body.country,
        code: req.body.code,
        confirmed: req.body.confirmed,
        recovered: req.body.recovered,
        critical: req.body.critical,
        deaths: req.body.deaths,
        lastupdate: req.body.lastupdate,
      },
    },
    (err, result) => {
      if (err) {
        res.status(400).send({ error: err });
      }
      res.status(200).send(result);
    }
  );
});

router.post("/login/user", (req, res, next) => {
  console.log(req.body.email);
  req.app.locals.db.collection("userinfoB1").findOne(
    {
      "newDocument.email": req.body.email,
      "newDocument.password": req.body.password,
    },
    (err, result) => {
      if (result == undefined) {
        res.status(200).send(false);
      } else if (err) {
        res.status(400).send(false);
      } else {
        res.status(200).send(true);
      }
    }
  );
});

//-----------------------------------------------------------------
//SignUp user
router.post("/login/add", (req, res, next) => {
  fetch("http://broker2:6000/lsds/login/add", {
    method: "POST",
    mode: "cors",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      ...req.body,
    }),
  });

  fetch("http://broker3:7000/lsds/login/add", {
    method: "POST",
    mode: "cors",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      ...req.body,
    }),
  });

  const newDocument = new userinfoB1(
    req.body.username,
    req.body.email,
    req.body.password
  );
  req.app.locals.db.collection("userinfoB1").insertOne(
    {
      newDocument,
    },
    (err, result) => {
      if (err) {
        res.status(400).send({ error: err });
      }
      res.status(200).send(result);
    }
  );
});

//********************************************* */
// Rendevous of subcriptions

router.post("/subscribe/add", async (req, res, next) => {
  // const newDocument = new userinfo(req.body.username, req.body.password);

  let key =
    req.body.service1 !== undefined
      ? "service1"
      : req.body.service2 !== undefined
      ? "service2"
      : req.body.service3 !== undefined
      ? "service3"
      : req.body.service4 !== undefined
      ? "service4"
      : undefined;

  console.log(key);
  if (key == undefined) {
    key =
      req.body.service5 !== undefined
        ? "service5"
        : req.body.service6 !== undefined
        ? "service6"
        : req.body.service7 !== undefined
        ? "service7"
        : undefined;

    console.log("2nd", key);
    if (key != undefined) {
      const resp2 = await fetch("http://broker2:6000/lsds/subscribe/add", {
        method: "POST",
        mode: "cors",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...req.body,
        }),
      });
      console.log(resp2?.status);
      if (resp2?.status) {
        res.status(200).send(resp2);
      } else {
        res.status(400).send("No response");
      }
    } else {
      const resp3 = await fetch("http://broker3:7000/lsds/subscribe/add", {
        method: "POST",
        mode: "cors",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...req.body,
        }),
      });
      if (resp3?.status) {
        res.status(200).send(resp3);
      } else {
        res.status(400).send("No response");
      }
    }
  } else {
    req.app.locals.db.collection("userinfoB1").updateOne(
      {
        "newDocument.email": req.body.email,
      },
      {
        $set: {
          [`newDocument.${key}`]: req.body[key],
        },
      },
      (err, result) => {
        if (err) {
          res.status(400).send({ error: err });
        }
        res.status(200).send(result);
      }
    );
  }
});

//--------------------------------------------------------------------
// GET list of subscriptions for a user

router.get("/subscribe/list/:email", async (req, res, next) => {
  const resp2 = await fetch(
    "http://broker2:6000/lsds/subscribe/list/" + req.params.email,
    {
      method: "GET",
      mode: "cors",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    }
  ).then((res) => res.json());

  const resp3 = await fetch(
    "http://broker3:7000/lsds/subscribe/list/" + req.params.email,
    {
      method: "GET",
      mode: "cors",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    }
  ).then((res) => res.json());

  req.app.locals.db.collection("userinfoB1").findOne(
    {
      "newDocument.email": req.params.email,
    },
    (err, result) => {
      if (err) {
        res.status(400).send({ error: err });
      }
      if (result === undefined) {
        res
          .status(400)
          .send({ error: "No document matching that id was found" });
      } else {
        const finalresult = Object.assign(
          {},
          result.newDocument,
          resp2.newDocument,
          resp3.newDocument
        );
        res.status(200).send(finalresult);
      }
    }
  );
});

// ************************************************************************

router.post("/deadvertise", (req, res, next) => {
  // const newDocument = new userinfo(req.body.username, req.body.password);

  req.app.locals.db.collection("userinfoB1").updateOne(
    {
      "newDocument.email": req.body.email,
    },
    {
      $set: {
        "newDocument.deadvertise": req.body.deadvertise,
      },
    },
    (err, result) => {
      if (err) {
        res.status(400).send({ error: err });
      }
      res.status(200).send(result);
    }
  );
});

router.post("/topictable/add", (req, res, next) => {
  const newDocument = new topicinfoB1(req.body.servicenumber);
  req.app.locals.db.collection("topicinfoB1").insertOne(
    {
      newDocument,
    },
    (err, result) => {
      if (err) {
        res.status(400).send({ error: err });
      }
      res.status(200).send(result);
    }
  );
});

module.exports = router;
