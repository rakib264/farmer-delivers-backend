import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { APP_SECRET } from '../config/dummy.js';


//Generate Salt
export const generateSalt = async () => {
    return await bcrypt.genSalt();
}
//Generating hash
export const generateHash = async(password, salt) => {
    return await bcrypt.hash(password, salt);
}

//Validating password
export const validatePassword = async(password, existingPassword) => {
    return await bcrypt.compare(password, existingPassword);
}

//Generate Signature By JWT
export const generateSignature =  (payload) => {
    return jwt.sign(payload, APP_SECRET , { expiresIn: '1d'});
}

//Validate signature
export const ValidateSignature = async(req) => {
    const signature = req.get("Authorization");


    if(signature) {
        const payload = await jwt.verify(signature.split(' ')[1], APP_SECRET);
        req.user = payload;
        return true;
    }

    return false;
}



