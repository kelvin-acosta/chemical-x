const LocalStrategy = require('passport-local').Strategy;
const User = require('../models').User;

module.exports = passport => {
  passport.serializeUser(function(user, done) {
    console.log('serializing user: ' + user.id);
    done(null, user.id);
  });

  passport.deserializeUser(function(id, done) {
    console.log('deserializing user: ' + id);
    User.findById(id).then(function(user) {
      done(null, user);
    });
  });

  passport.use('local-login', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true,
  },
  function(req, email, password, done) {
    User.findOne({where: {'email': email}}).then(function(user) {
      if (!user) {
        return done(null, false, {message: 'No user found.'});
      }

      if (!user.validPassword(password)) {
        return done(null, false, {message: 'Oops! Wrong password.'});
      }

      return done(null, user, {message: 'Successfully logged in!'});
    }).then(function(err) {
      return done(err);
    });
  }));

  passport.use('local-signup', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true,
  },
  function(req, email, password, done) {
    process.nextTick(function() {
      User.findOne({where: {'email': email}}).then(function(user) {
        if (user) {
          console.log('email taken');
          return done(null, false, {message: 'That email is already taken.'});
        } else {
          console.log('creating new user');
          User.create({
            name: req.body.name,
            email: email,
            password: User.generateHash(password),
          }).then(function(newUser) {
            console.log('new user: ' + newUser.id);
            return done(null, newUser, {user: newUser});
          }).then(function(err) {
            return done(err);
          });
        }
      });
    });
  }));
};
