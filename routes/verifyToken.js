const jwt = require("jsonwebtoken");

const verifyToken = (request, response, next) => {
    const authHeader = request.headers.token;
    if(authHeader){
        const token = authHeader.split(" ")[1];
        jwt.verify(token, process.env.JWT_SEC, (err, user)=>{
            if(err) response.status(401).json("Token not valid");
            request.user = user
            next();
        });
    }else{
        return response.status(401).json("You are not authenticated");
    }
};

const verifyTokenAndAuth = (request, response, next) => {
    verifyToken (request, response, ()=>{
        if(request.user.id === request.params.id || request.user.isAdmin){
            next();
        }else{
            return response.status(403).json("Not allowed");
        }
    });

};

const verifyTokenAndAdmin = (request, response, next) => {
    verifyToken (request, response, ()=>{
        if(request.user.isAdmin){
            next();
        }else{
            return response.status(403).json("Not allowed");
        }
    });

};

module.exports = {verifyToken, verifyTokenAndAuth, verifyTokenAndAdmin};