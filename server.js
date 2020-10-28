"use strict";

const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");

const ExpressOIDC = require("@okta/oidc-middleware").ExpressOIDC;
const session = require("express-session");
var jwt = require('jsonwebtoken');

const routes = require("./routes");
const sockets = require("./socket");

const start = function (options) {
  return new Promise(function (resolve, reject) {
    process.on("unhandledRejection", (reason, p) => {
      console.log("Unhandled Rejection at: Promise", p, "reason:", reason);
    });

    if (!options.port) {
      reject(new Error("no port specificed"));
    }

    const app = express();
    const http = require("http").createServer(app);
    const io = require("socket.io")(http);

    var rooms = [];

    app.use(express.static("public"));
    app.set("views", path.join(__dirname, "/public/views"));
    app.set("view engine", "pug");

    app.use(bodyParser.urlencoded({ extended: false }));

    app.use(function (error, request, response, next) {
      console.log(error);
      reject(new Error("something went wrong" + error));
      response.status(500).send("something went wrong");
    });

    const oidc = new ExpressOIDC({
      issuer: process.env.OKTA_BASE_URL + "/oauth2/default",
      client_id: process.env.OKTA_CLIENT_ID,
      client_secret: process.env.OKTA_CLIENT_SECRET,
      appBaseUrl: process.env.APP_BASE_URL,
      scope: "openid profile",
      routes: {
        login: {
          path: "/users/login",
        },
        callback: {
          path: "/authorization-code/callback",
        },
        loginCallback: {
          afterCallback: "/dashboard",
        },
      },
    });

    app.use(
      session({
        secret:
          "asd;skdvmfebvoswmvlkmes';lvmsdlfbvmsbvoibvms'dplvmdmaspviresmpvmrae';vm'psdemr",
        resave: true,
        saveUninitialized: false,
      })
    );

    app.use(oidc.router);

    var rooms = require("./rooms")();

    routes(app, {
      rooms: rooms,
      jwt: jwt
    });

    sockets(io, {
      rooms: rooms
    });

    const server = http.listen(options.port, function () {
      resolve(server);
    });
  });
};

module.exports = Object.assign({}, { start });
