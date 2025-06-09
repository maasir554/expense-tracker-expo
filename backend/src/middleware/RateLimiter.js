import ratelimiter from "../config/upstash.js";

const RateLimiter = async (req, res, next) => {
    try{
        const { success } = await ratelimiter.limit("my-rate-limit"); // we will use userId or IP address here later.
        if(!success) return res.status(429).json({message:"Too many requests. Please try again after some time."});
        next();
    }
    catch(e){
        console.log("Error in rate limiter.");
        next(e)
    }
}

export default RateLimiter;
