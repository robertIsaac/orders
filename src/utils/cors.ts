export function CORS(req, res, next) {
    if (req.app.get('env').PRODUCTION === 'false') {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS,PATCH");
        res.header("Access-Control-Allow-Headers", "Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
        res.header("Access-Control-Max-Age", "86400");
    }
    next();
}
