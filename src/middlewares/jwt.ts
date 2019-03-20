import UserModel from "../model/user.model";

const jwt = require('jsonwebtoken');

export function jwtMiddleware(req, res, next) {
    const env = req.app.get('env');
    const {JWT_SECRET} = env;
    let token;
    if (req.headers.authorization && typeof req.headers.authorization === 'string') {
        token = req.headers.authorization.replace('Bearer ', '');
    } else {
        res.status(403).send('invalid token');
        return;
    }
    let jwtBody;
    try {
        jwtBody = jwt.verify(token, JWT_SECRET, {expiresIn: '7d'});
    } catch (e) {
        console.log(e);
        res.status(403).send('invalid token');
        return;
    }
    UserModel.findOne({_id: jwtBody.id}).then(user => {
        if (!user) {
            res.status(403).send('invalid token');
            return;
        }
        req.app.set('jwt', jwtBody);
        next();
    }).catch((error) => {
        console.error(error);
        res.status(403).send('invalid token');
        return;
    });
}
