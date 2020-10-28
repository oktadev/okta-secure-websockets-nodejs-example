module.exports = function (app, opts) {

  function ensureAuthenticated (request, response, next) {
    if (!request.userContext) {
      return response.status(401).redirect("/account/login");
    }

    next();
  }

  app.get("", (request, response, next) => {
    return response.render("home");
  });

  app.get("/dashboard", ensureAuthenticated, (request, response, next) => {
    return response.render("dashboard", {
      user: request.userContext.userinfo,
      rooms: opts.rooms
    });
  });

  app.get("/chat/:room", ensureAuthenticated, (request, response, next) => {
    return response.render("room", {
      jwt: opts.jwt.sign({ user: request.userContext.userinfo, room: request.params.room }, process.env.JWT_TOKEN_KEY),
      room: opts.rooms.filter((r) => r.name == request.params.room)[0]
    });
  });

  app.get("/account/logout", ensureAuthenticated, (request, response, next) => {
    request.logout();
    response.redirect("/");
  });

  app.get("/account/login", (request, response, next) => {
    return response.render("home");
  });
};
