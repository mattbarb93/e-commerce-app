const {validationResult} = require('express-validator');

module.exports = {
    handleErrors(templateFunc, dataCallback) {
        return async (req, res, next) => {
            const errors = validationResult(req);

            console.log(errors);

            if(!errors.isEmpty()) {
                let data = {};

                if(dataCallback) {
                    data = await dataCallback(req);
                }

                return res.send(templateFunc( {errors, ...data} ))
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