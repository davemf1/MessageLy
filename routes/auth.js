const jwt = require("jsonwebtoken");
const User = require("../models/user")
const { SECRET_KEY } = require("../config");
const router = require("./users");
const ExpressError = require("../expressError");

/** POST /login - login: {username, password} => {token}
 *
 * Make sure to update their last-login!
 *
 **/

router.post('/login', async (req, res, next) => {

    const { username, password } = req.body;
    const result = await User.authenticate(username, password);
    if (result) {
        const token = jwt.sign({ username }, SECRET_KEY);
        User.updateLoginTimestamp(username);
        return res.json({ token });
    }
    else {
        throw new ExpressError("Invalid username/password", 404);
    }
})
/** POST /register - register user: registers, logs in, and returns token.
 *
 * {username, password, first_name, last_name, phone} => {token}.
 *
 *  Make sure to update their last-login!
 */

router.post('/register', async (req, res, next) => {
    try {

        const { username, password, first_name, last_name, phone } = req.body;
        const result = await User.register({ username, password, first_name, last_name, phone });
        let payload = result.username;
        let token = jwt.sign(payload, SECRET_KEY);
        User.updateLoginTimestamp(username);
        return res.json({ token });

    } catch (error) {
        return next(error);
    }
})

module.exports = router;