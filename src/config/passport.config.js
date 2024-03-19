import passport from "passport";
import passportLocal from "passport-local";
import { createHash, isValidPassword } from "../utils.js";
import userModel from "../daos/mongo/models/user.model.js";

const LocalStrategy = passportLocal.Strategy;

const initializePassport = () => {
  // Register Strategy
  passport.use(
    "register",
    new LocalStrategy(
      {
        usernameField: "email",
        passwordField: "password",
        passReqToCallback: true,
      },
      async (req, email, password, done) => {
        try {
          const userExists = await userModel.findOne({ email: email });
          if (userExists) {
            return done(null, false, { message: "Email already in use." });
          }
          const newUser = new userModel({
            email,
            password: createHash(password),
            first_name: req.body.first_name,
            last_name: req.body.last_name,
            age: req.body.age,
          });
          const savedUser = await newUser.save();
          console.log(`Usuario creado con exito`);
          return done(null, savedUser);
        } catch (error) {
          return done(error);
        }
      }
    )
  );

  //Login Strategy
  passport.use(
    "login",
    new LocalStrategy(
      {
        usernameField: "email",
        passwordField: "password",
        passReqToCallback: true,
      },
      async (req, email, password, done) => {
        try {
          const user = await userModel.findOne({ email: email });
          if (!user) {
            return done(null, false, {
              message: "No user found with that email.",
            });
          }
          if (!isValidPassword(user, password)) {
            return done(null, false, { message: "Incorrect password." });
          }
          return done(null, user);
        } catch (error) {
          return done(error);
        }
      }
    )
  );

  // User serialization & deserialization
  passport.serializeUser((user, done) => {
    done(null, user._id);
  });
  
  passport.deserializeUser(async (id, done) => {
    try {
      const user = await userModel.findById(id);
      done(null, user);
    } catch (error) {
      done(error);
    }
  });
  
};

export default initializePassport;
