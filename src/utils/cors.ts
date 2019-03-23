export function CORS(req, res, next) {
    if (req.app.get('env').PRODUCTION === 'false') {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Max-Age", "86400");
    }
    next();
}
