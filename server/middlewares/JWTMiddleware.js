const jwt = require('jsonwebtoken')

exports.authMiddleware = (req, res, next) => {
    // read the token from header or url 
    const token = req.headers['x-access-token'] || req.query.token

    // token does not exist
    if (!token) {
        return res.status(401).end();
    }

    // create a promise that decodes the token
    const p = new Promise(
        (resolve, reject) => {
            jwt.verify(token, req.app.get('jwt-secret'), (err, decoded) => {
                if (err) reject(err)
                resolve(decoded)
            })
        }
    )

    // if it has failed to verify, it will return an error message
    const onError = (error) => {
        res.status(403).json();
    }

    // process the promise
    p.then((decoded) => {
        req.decoded = decoded;
        next()
    }).catch(onError)
}

exports.onlyAdmin = (req, res, next) => {
    const token = req.decoded;
    if(token.isAdmin) return next();
    else return res.sendStatus(403);
}


exports.onlyUser = (req, res, next) => {
    const token = req.decoded;
    if(token.isAdmin === false) return next();
    else return res.sendStatus(403);
}

