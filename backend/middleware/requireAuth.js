const jwt = require("jsonwebtoken")

const requireAuth = async (req, res, next) =>{
    const { authorization } = req.headers

    if (!authorization) {
        return res.status(401).json({error: 'Authorization token required'})
    }

    const token = authorization.split(' ')[1]
    if (!token) {
        return res.status(401).json({ error: 'Token not found' });
    }
    try {    
        const verified = jwt.verify(token, process.env.JWT_SECRET)
        req.user = verified
        next()
    } catch (error) {
        console.error('Authentication error:', error.message);
        res.status(401).json({error: 'Request is not authorized'})
    }
}

module.exports = requireAuth