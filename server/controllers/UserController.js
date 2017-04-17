const User = require('../models').User;

module.exports = {
  create(req, res) {
    return User
      .create({
        name: req.body.name,
        email: req.body.email,
        password: User.generateHash(req.body.password),
      })
      .then(user => res.status(201).send(user))
      .catch(error => res.status(400).send(error));
  },

  list(req, res) {
    return User
      .all()
      .then(user => res.status(201).send(user))
      .catch(error => res.status(400).send(error));
  },
};
