const passport = require('passport');

class Auth {
    static authenticate(req, res, next) {
        passport.authenticate('jwt',
            (err, user, authenticateError) =>
                Auth.processAuthenticate(req, res, next, err, user, authenticateError))(req, res, next);
    }

    static processAuthenticate(req, res, next, err, user, authenticateError) {
        if (authenticateError) {
            const error = new Error(authenticateError.message);
            error.status = 401;
            return next(error);
        }
        if (err) {
            // Если ошибка уже имеет статус, оставляем его, иначе ставим 401
            if (!err.status && !err.statusCode) {
                err.status = 401;
            }
            return next(err);
        }
        // Check User
        if (!user) {
            const error = new Error('User unauthorized');
            error.status = 401;
            return next(error);
        }

        req.user = user;

        return next();
    }

}

module.exports = Auth;