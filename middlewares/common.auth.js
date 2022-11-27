import { ValidateSignature } from "../utility/utilityConfig.js"


export const Authenticate = async(req, res, next) => {
    const validate = await ValidateSignature(req);
    if(validate) {
        next();
    } else{
        return res.json({
            message: 'Not Authenticated'
        })
    }
}