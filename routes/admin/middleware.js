const {validationResult} = require('express-validator');

module.exports = {
    handleErrors(templateFunc) {
        return (req, res, next) => {
            const errors = validationResult(req);

            console.log(errors);

            if(!errors.isEmpty()) {
                return res.send(templateFunc( {errors} ))
            }

            next()
        }
    },

    //If user isnt signed in, redirect to signin page. If he is, proceed to the next action

    requireAuth(req, res, next) {
        if(!req.session.userId) {
            return res.redirect('/signin')
        }

        next();

    }


};