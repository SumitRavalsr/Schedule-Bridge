
const isUser = (req, res, next)=>{
    if(req.userInfo.role !== 'user'){
        return res.status(403).json({
            success: false,
            message: 'Access denied!You are admin!'
        })
    }
    next()
}


module.exports = isUser