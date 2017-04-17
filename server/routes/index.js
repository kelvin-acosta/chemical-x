// Controllers
const userController = require('../controllers').users;

module.exports = (app, passport) => {
    // Setup a default catch-all route that sends back a welcome message
    app.get('/', (req, res) => {
        return res.status(200).send({
            message: 'CHEMICAL-X',
        });
    });

    app.get('/users', isLoggedIn, userController.list);

    app.post('/users', passport.authenticate('local-signup'),
        function(req, res) {
            res.json({message: 'Created new user', user: req.user});
        });

    app.post('/login', passport.authenticate('local-login'),
        function(req, res) {
            res.json({message: 'Logged in!', user: req.user});
        });

    app.get('/logout', function(req, res) {
        req.logout();
        res.redirect('/');
    });
};

/**
 * Checks if the user is authenticated
 *
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
function isLoggedIn(req, res, next) {
    // If user is authenticated, they shall pass
    if (req.isAuthenticated()) {
        return next();
    }

    res.redirect('/');
}
