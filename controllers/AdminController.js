import express from 'express';
import { Delivery } from '../models/DeliveryModel.js';
import { Transaction } from '../models/TransactionModel.js';
import { Vendor } from '../models/VendorModel.js';
import { generateSalt, generateHash,  } from '../utility/utilityConfig.js';



export const CreateVendor = async (req, res) => {
    // const { name, ownerName, email, password, pincode, foodType, address, phone } = <CreateVendorInputs> req.body;
    const { name, ownerName, email, password, pincode, foodType, address, phone } =  req.body;

    const vendorExists = await Vendor.findOne({ phone: phone });

    if (vendorExists !==null ) {
        return res.json({
            message: 'Vendor already exists'
        }) 
    }

    //Salt
    const salt = await generateSalt();
    const vendorPassword = await generateHash(password, salt);

    const createVendor =  await Vendor.create({
        name: name, 
        ownerName: ownerName,
        email: email,
        password: vendorPassword,
        pincode: pincode,
        address: address,
        phone: phone,
        foodType: foodType,
        salt: salt,
        serviceAvailable: true,
        rating: 0,
        coverImages: [],
        foods: [],
        lat: 0,
        lng: 0
    })

    // console.log(createVendor)

    return res.json(createVendor);
    

}

// export const CreateCategory = async (req, res) => {
//     const {category, image} = req.body;
//     if( category && image ){
//         const createdCategory = await category.create({

//         })
//     }
// }

export const GetAllVendors = async (req, res) => {
    const vendors = await Vendor.find();
    if(vendors !==null){
       return res.json(vendors);
    }
   return res.json({
        message: 'No vendors found'
    })
    
}

export const GetVendorById = async (req, res,) => {

    const vendorId = req.params.id;

    const vendor =  await Vendor.findById(vendorId);
    // console.log(vendor);
    if(vendor !==null){
       return res.json(vendor);
    }
   return res.json({
        message: 'No vendor found with this is id'
    })
}

/**
|--------------------------------------------------
| Transaction Section
|--------------------------------------------------
*/

export const GetTransactions = async (req, res) => {
    const transactions = await Transaction.find();
    if(transactions.length > 0) {
        return res.json(transactions);
    }
    return res.json({
        "message": "No transactions found"
        });
}

export const GetTransactionById = async (req, res) => {
    const transactionId = req.params.id;

    const transaction = await Transaction.findById(transactionId);
    if(transaction) {
        return res.json(transaction);
    }
    return res.json({
        "message": "No transactions found"
        });
}

export const VerifyDeliveryPerson = async(req, res) => {
    const { _id, status } = req.body;
    const deliveryPerson = await Delivery.findById(_id);
    if(deliveryPerson) {
        deliveryPerson.verified = status;
        const result = await deliveryPerson.save();
        return res.json(result);
    }
    return res.json({
        "message": "No delivery person found"
        });
}

export const GetDeliveryPersons = async(req, res) => {

    const deliveryPersons = await Delivery.find();
    if(deliveryPersons) {
        
        return res.json(deliveryPersons);

    }
    return res.json({
        "message": "No delivery persons found"
        });
}

