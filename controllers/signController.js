const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const db = require("../models/index");
const User = require("../models").User;
const Op = db.Sequelize.Op;

const config = require("../config/authConfig");

module.exports = {
  signUp(req, res) {
    return User.create({
      email: req.body.email,
      password: bcrypt.hashSync(req.body.password, 8),
    })
      .then((user) => {
        User.findAll({
          where: {
            email: {[Op.ne]: req.body.email},
          },
        })
          .then((user) =>
            res.status(200).send({
              email: req.body.email,
              message: "Register user success!",
              error: null,
            })
          )
          .catch((err) =>
            res.status(500).send({
              message: "error",
              error: err,
            })
          );
      })
      .catch((err) =>
        res.status(500).rend({
          message: "error",
          error: err,
        })
      );
  },

  signIn(req, res) {
    return User.findOne({
      where: {
        email: req.body.email,
      },
    })
    .then((user) => {
        if (!user) {
          return res.status(404).send({
            auth: false,
            email: req.body.email,
            accessToken: null,
            message: "error",
            errors: "User not found!",
          });
        }

        var isPassValid = bcrypt.compareSync(req.body.password, user.password);

        if (!isPassValid) {
          return res.status(401).send({
            auth: false,
            email: req.body.email,
            accessToken: null,
            message: "error",
            errors: "Invalid Password",
          });
        }

        var token = jwt.sign({email: user.email}, config.jwtKey, {
          expiresIn: 86400,
        });

        return res.status(200).send({
          auth: true,
          email: req.body.email,
          accessToken: token,
          message: "Success",
          error: null,
        });
      })
      .catch((err) => {
        // console.log(err);
        res.status(500).send({
          auth: false,
          id: req.body.id,
          accessToken: null,
          message: "Error",
          errors: err,
        });
      });
  },

  verifyJwt(req, res, next) {
    let tokenHeader = req.headers.authorization;

    if(!tokenHeader){
        return res.status(500).send({
            message: "Error",
            error: "No Auth header request."
        });
    }

    if (tokenHeader.split(" ")[0] !== "Bearer") {
      return res.status(500).send({
        auth: false,
        message: "Error",
        errors: "Incorrect token format",
      });
    }

    // console.log(tokenHeader);

    let token = tokenHeader.split(' ')[1];

    if(!token){
        return res.status(403).send({
            auth: false,
            message: "Error",
            errors: "No token provided"
        });
    }

    jwt.verify(token, config.jwtKey, (err, decode) => {
        if(err){
            return res.status(500).send({
                auth: false,
                message: "Error",
                errors: err
            });
        }

        req.email = decode.email;
        next();
    });
  },
};
