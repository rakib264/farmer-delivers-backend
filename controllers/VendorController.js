import { generateSignature, validatePassword } from '../utility/utilityConfig.js';
import { Vendor } from '../models/VendorModel.js';
import { Food } from '../models/FoodModel.js';
import { Order } from '../models/OrderModel.js';
import { Offer } from '../models/offerModel.js';

export const VendorLogin = async(req, res) => {
    const {phone, password} = req.body;

    const existingVendor = await Vendor.findOne({phone: phone})
    if(existingVendor) {
        //Check Password
        const validate = await validatePassword(password, existingVendor.password);   
        if(validate){
            //Generate new signature using jwt token
            const signature = generateSignature({
                _id: existingVendor._id,
                phone: existingVendor.phone,
                name: existingVendor.name,
                foodType: existingVendor.foodType,
            })
           return res.json(signature);
        } else {
           return res.json({
                message: 'Invalid Password'
            })
        }
    } 

   return res.json({
        message: 'Credential does not match'
    })

}

//Vendor Profile
export const VendorProfile = async(req, res) => {
    const user = req.user;
    
    if(user) {
        const existingVendor = await Vendor.findById(user._id);
        return res.json(existingVendor);
    }
    return res.json({
        message: 'Vendor Profile not found'
    })
}

//Update Vendor Profile
export const UpdateVendorProfile = async(req, res) => {
    const { firstName, lastName, address, phone, foodType} = req.body;
    const user = req.user;
    let name;

    if(firstName && lastName){
        name = firstName + ' ' + lastName
    }
    
    if(user) {
        const existingVendor = await Vendor.findById(user._id);
        if(existingVendor) {
            existingVendor.name = name;
            existingVendor.address = address;
            existingVendor.phone = phone;
            existingVendor.foodType = foodType;

            const saveResults = await existingVendor.save();
           return res.json(saveResults);
        }
        return res.json(existingVendor);
    }
    return res.json({
        message: 'Vendor Profile not found'
    })
}

//Update cover image
export const UpdateVendorCover = async(req, res) => {

    const user = req.user;
    if(user){
        const vendor = await Vendor.findById(user._id);
        if(vendor) {
            
            const files = req.files;
            console.log(files)
            const images = files.map(file => file.filename);

            vendor.coverImages.push(...images);
            const result = await vendor.save();
            return res.json(result);
        }
    }

    return res.json({
        message: 'Vendor is not found'
    })

}  

//Update Vendor Serviceabilities
export const UpdateVendorService = async(req, res) => {
   
    const user = req.user;
    const { lat, lng } = req.body;
    
    if(user) {
        const existingVendor = await Vendor.findById(user._id);
        if(existingVendor) {
            existingVendor.serviceAvailable = !existingVendor.serviceAvailable;

            if(lat && lng) {
                existingVendor.lat = lat;
                existingVendor.lng = lng;
            }

            const saveResults = await existingVendor.save();
            return res.json(saveResults);
        }
        return res.json(existingVendor);
    }
    return res.json({
        message: 'Vendor is not found'
    })
}


//Add Foods 
export const AddFood = async(req, res) => {

    const user = req.user;
    if(user){
        const vendor = await Vendor.findById(user._id);
        if(vendor) {
            const { name, description, category, quantity, readyTime, price, foodType, image } = req.body;
            // const files = req.files;
            // const images = files.map(file => file.filename);
            const createdFood = await Food.create({
                vendorId: vendor._id,
                name: name,
                description: description,
                category: category,
                quantity: quantity,
                readyTime: readyTime,
                price: price,
                rating: 0,
                foodType: foodType,
                images: image //images is an array of images
            })

            vendor.foods.push(createdFood);
            const result = await vendor.save();
            return res.json(result);
        }
    }

    return res.json({
        message: 'Vendor is not found'
    })

}    

//Get Foods 
export const GetFoods = async(req, res) => {

    const user = req.user;
    if(user){
        const vendor = await Vendor.findById(user._id);
        if(vendor) {
            const foods = await Food.find({ vendorId: vendor._id});
            return res.json(foods);
        }
    }

    return res.json({
        message: 'Vendor is not found'
    })

}    

/**
|--------------------------------------------------
| Managing the orders by the vendor.
|--------------------------------------------------
*/

export const GetCurrentOrder = async(req, res) => {
    const user = req.user;
    if(user){
        const orders = await Order.find({ vendorId: user._id }).populate('items.food');
        if(orders.length >0 ){
            return res.json(orders);
        }
    }
    return res.json({
        message: 'Vendor is not found'
    })
}

export const GetOrderDetails = async(req, res) => {
    const user = req.user;
    const orderId = req.params.id;
    if(user){
        const order = await Order.findById(orderId).populate('items.food');
        if(order !== null ){
            return res.json(order);
        }
    }
    return res.json({
        message: 'Vendor is not found'
    })
}

export const ProcessOrder = async(req, res) => {
    const user = req.user;
    const orderId = req.params.id;
    if(user){
        const order = await Order.findById(orderId).populate('items.food');
        if(order !== null ){
            const { status, remarks, time } = req.body;
            order.orderStatus = status;  //For vendor it can be either ACCEPT || REJECT || UNDER_PROCESS || READY
            order.remarks = remarks;
            if(time){
                order.readyTime = time;
            }
            const orderResult = await order.save();
            return res.json(orderResult);
        }
    }
    return res.json({
        message: 'Vendor is not found'
    })
}

// Offer 

export const GetOffers = async(req,res) => {
    const user = req.user;
    let currentOffers = [];

    if(user){
        const offers = await Offer.find().populate('vendors');
        if(offers){
            offers.map(item => {
                if(item.vendors){
                    item.vendors.map(vendor => {
                        if(vendor._id.toString() === user._id){
                            currentOffers.push(item);
                        }
                    })
                }
                if(item.offerType === "GENERIC"){
                    currentOffers.push(item);
                }
            })
        }
        return res.json(currentOffers);
    }
    return res.json({
        message: 'Vendor is not found'
    })
}

export const AddOffer = async(req,res) => {
    const user = req.user;
    if(user) {
        const { offerType, title, description, minValue, offerAmount, 
            startValidity, endValidity, promocode, promoType, banks, bins, isActive, pincode } = req.body;
            const vendor = await Vendor.findById(user._id);
            if(vendor) {
                const offer = await Offer.create({
                    title,
                    description,
                    vendors: [vendor],
                    offerType,
                    minValue,
                    offerAmount,
                    startValidity,
                    endValidity,
                    promocode,
                    promoType,
                    banks,
                    bins,
                    pincode,
                    isActive
                })
                return res.json(offer);
            }
    }
    return res.json({
        message: 'Vendor is not found'
    })
}

export const EditOffer = async(req,res) => {
    const user = req.user;
    const offerId = req.params.id;
    console.log(offerId)
    if(user) {
        const { offerType, title, description, minValue, offerAmount, 
            startValidity, endValidity, promocode, promoType, banks, bins, isActive, pincode } = req.body;

            const currentOffer =await Offer.findById(offerId);

            if(currentOffer){
                const vendor = await Vendor.findById(user._id);
            if(vendor) {
                currentOffer.title = title,
                currentOffer.description = description,
                currentOffer.vendors = [vendor],
                currentOffer.offerType = offerType,
                currentOffer.minValue = minValue,
                currentOffer.offerAmount = offerAmount,
                currentOffer.startValidity = startValidity,
                currentOffer.endValidity = endValidity,
                currentOffer.promocode = promocode,
                currentOffer.promoType = promoType,
                currentOffer.banks = banks,
                currentOffer.bins = bins,
                currentOffer.pincode = pincode,
                currentOffer.isActive = isActive

                const offer = await currentOffer.save();

                console.log(offer)

                return res.json(offer);
            }
            }
    }
    return res.json({
        message: 'Vendor is not found'
    })
}