const express = require("express");
const CovidTally = require("../models/CovidTally");
const userinfoB2 = require("../models/userinfoB2");
const topicinfoB2 = require("../models/topicinfoB2");

const router = express.Router();

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
  req.app.locals.db.collection("userinfoB2").findOne(
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

router.post("/login/add", (req, res, next) => {
  const newDocument = new userinfoB2(
    req.body.username,
    req.body.email,
    req.body.password
  );
  req.app.locals.db.collection("userinfoB2").insertOne(
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

router.post("/subscribe/add", (req, res, next) => {
  // const newDocument = new userinfo(req.body.username, req.body.password);
  let key =
    req.body.service5 !== undefined
      ? "service5"
      : req.body.service6 !== undefined
      ? "service6"
      : req.body.service7 !== undefined
      ? "service7"
      : undefined;
  req.app.locals.db.collection("userinfoB2").updateOne(
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
});

router.get("/subscribe/list/:email", (req, res, next) => {
  req.app.locals.db.collection("userinfoB2").findOne(
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
        res.status(200).send(result);
      }
    }
  );
});

router.post("/deadvertise", (req, res, next) => {
  // const newDocument = new userinfo(req.body.username, req.body.password);

  req.app.locals.db.collection("userinfoB2").updateOne(
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
  const newDocument = new topicinfoB2(req.body.servicenumber);
  req.app.locals.db.collection("topicinfoB2").insertOne(
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
