const jwt =  require('jsonwebtoken')

const authMiddleware = (req, res, next) =>{
    // console.log('auth middleware is called')

    // const authHeader = req.headers["authorization"]
    // console.log(authHeader);


    // const token = authHeader && authHeader.split(" ")[1]

    const token = req.cookies.accessToken;
    // console.log(token)

    if(!token){

        return res.redirect('/')

        // return res.status(401).json({
        //     success: false,
        //     message: 'Access Denied, No token provided please login to continue'
        // })
    }

    // decode the token
    try{
        const decodeTokenInfo = jwt.verify(token, process.env.JWT_SECRET_KEY)
        // console.log(decodeTokenInfo)

        req.userInfo = decodeTokenInfo
        next()
    }catch(error){
        
        return res.redirect('/')
        return res.status(500).json({
            success: false,
            message: 'Access Denied, No token provided please login to continue'
        })
    }
    
}

module.exports = authMiddleware