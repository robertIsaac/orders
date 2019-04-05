import UserModel from "../model/user.model";

const jwt = require('jsonwebtoken');

export function jwtMiddleware(req, res, next) {
    const env = req.app.get('env');
    const {JWT_SECRET, JWT_EXP} = env;
    let token;
    if (req.headers.authorization) {
        token = req.headers.authorization.replace('Bearer ', '');
    } else {
        res.status(403).send({message: 'invalid token'});
        return;
    }
    let jwtBody;
    try {
        jwtBody = jwt.verify(token, JWT_SECRET, {expiresIn: JWT_EXP});
    } catch (e) {
        console.error(e);
        res.status(403).send({message: 'invalid token'});
        return;
    }
    UserModel.findById(jwtBody.id).then(user => {
        if (!user) {
            res.status(403).send({message: 'invalid token'});
            return;
        }
        req.app.set('jwt', jwtBody);
        next();
    }).catch((error) => {
        console.error(error);
        res.status(403).send({message: 'invalid token'});
        return;
    });
}
