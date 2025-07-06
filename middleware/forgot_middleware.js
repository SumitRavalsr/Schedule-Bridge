const jwt = require('jsonwebtoken')

const forgotPassMiddleware = (req, res, next)=>{

    const token = req.cookies.passToken;
    console.log(token);
    
    if(!token){

        return res.redirect('/')

        // return res.status(401).json({
        //     success: false,
        //     message: 'Access Denied, No token provided please login to continue'
        // })
    }

    // decode the token
    try {
        const decodeTokenInfo = jwt.verify(token,process.env.JWT_SECRET_KEY)
        
        req.userDetails = decodeTokenInfo
        next()
        
    } catch (error) {
         return res.status(500).json({
            success: false,
            message: 'Access Denied, No token provided please login to continue'
        })
    }

    

}

module.exports = forgotPassMiddleware 