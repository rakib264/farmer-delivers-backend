import { validationResult, matchedData } from 'express-validator';
import { sendOTP } from '../utility/demo.js';
import { GenerateOTP } from '../utility/notificationUtility.js';
import { generateHash, generateSalt, generateSignature, validatePassword } from '../utility/utilityConfig.js';
import { Customer } from '../models/CustomerModel.js';
import { Food } from '../models/FoodModel.js';
import { Order } from '../models/OrderModel.js';
import { response } from 'express';
import { Offer } from '../models/offerModel.js';
import { Transaction } from '../models/TransactionModel.js';
import { Delivery } from '../models/DeliveryModel.js';

//Signup
export const deliveryPersonSignUp = async(req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.json({
        data: req.body,
        errors: errors.mapped()
      });
    }

    const data = matchedData(req);
    const { email, phone, password, address, firstName, lastName, pincode } = data;
    
    const salt = await generateSalt();
    const userPassword = await generateHash(password, salt);

    const existingDeliveryPerson = await Delivery.findOne({ email: email});

    if(existingDeliveryPerson !==null){
        return res.json({
            "message": "A Delivery Person already exists with this email"
        })
    }

    const result = await Delivery.create({
        email: email,
        password: userPassword,
        salt: salt,
        firstName: firstName,
        lastName: lastName,
        address: address,
        verified: false,
        phone: phone,
        lat: 0,
        lng: 0,
        pincode: pincode,
        isAvailable: false,
    })

    if(result){
        //Generate signature
        const signature = generateSignature({
            _id: result._id,
            email: result.email,
            verified: result.verified
        })

        //Send the result to client
        return res.json({
            signature: signature,
            verified: result.verified,
            email: result.email
        });
    }

    

}

//Login
export const deliveryPersonLogin = async(req, res) => {
    const {email, password} = req.body;

        const existingDeliveryPerson = await Delivery.findOne({email: email});
        if(existingDeliveryPerson){
            const validate = await validatePassword(password, existingDeliveryPerson.password);
            if(validate){
                 //Generate signature
               const signature = generateSignature({
                _id: existingDeliveryPerson._id,
                email: existingDeliveryPerson.email,
                verified: existingDeliveryPerson.verified
            })
    
            //Send the profile to client
            return res.json({
                signature: signature,
            });
            }
        }
    
    return res.json({
        message: "Delivery Person Not Found",
    })
}



//Signup
export const deliveryPersonProfile = async(req, res) => {
    const deliveryPerson = req.user;
    if(deliveryPerson){
        const profile = await Delivery.findById(deliveryPerson._id);
        if(profile){
           return res.json(profile);
        }
    }
    return res.json({
        message: "Delivery Person Not Authenticated",
    })
}

//Signup
export const editDeliveryPersonProfile = async(req, res) => {
    const deliveryPerson = req.user;
    const { firstName, lastName, address, phone } = req.body;
    if(deliveryPerson){
        const profile = await Delivery.findById(deliveryPerson._id);
        if(profile){
            profile.firstName = firstName;
            profile.lastName = lastName;
            profile.address = address;
            profile.phone = phone;

            const updatedProfile = await profile.save();

           return res.json(updatedProfile);
        }
    }
    return res.json({
        message: "Delivery Person Not Authenticated",
    })
}

//Update status of deliveryPerson
export const updateDeliveryPersonStatus = async(req, res) => {
    const deliveryPerson = req.user;
    const { lat, lng } = req.body;
    if(deliveryPerson){
        const profile = await Delivery.findById(deliveryPerson._id);
        if(profile){
            profile.lat = lat;
            profile.lng = lng;
            profile.isAvailable = !profile.isAvailable;


            const result = await profile.save();

           return res.json(result);
        }
    }
    return res.json({
        message: "Delivery Person Not Authenticated",
    })
}




