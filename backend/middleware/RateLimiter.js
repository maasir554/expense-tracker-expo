import ratelimiter from "../config/upstash.js";

const RateLimiter = async (req, res, next) => {
    console.log("Rate Limiter is checking... ")
    try{
        const { success } = await ratelimiter.limit("my-rate-limit");
        if(!success) return res.status(429).json({message:"Too many requests. Please try again after some time."});
        next();
    }
    catch(e){
        console.log("Error in rate limiter.");
        next(e)
    }
}

export default RateLimiter;
