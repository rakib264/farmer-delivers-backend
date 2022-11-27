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
import { Vendor } from '../models/VendorModel.js';

//Signup
export const customerSignUp = async(req, res) => {
    // const errors = validationResult(req);
    // if (!errors.isEmpty()) {
    //   return res.json({
    //     data: req.body,
    //     errors: errors.mapped()
    //   });
    // }

    // const data = matchedData(req);
    // const { phone, password } = data;
    const {firstName, lastName, phone, password } = req.body;
    console.log(req.body)
    
    const phoneString = phone.toString();
    const passwordString = password.toString();
    
    const salt = await generateSalt();
    const userPassword = await generateHash(passwordString, salt);
    const { otp, expiry } = GenerateOTP();

    const existingCustomer = await Customer.findOne({ phone: phoneString});

    if(existingCustomer !==null){
        return res.json({
            "message": "A person already exists with this number"
        })
    }

    const result = await Customer.create({
        password: userPassword,
        salt: salt,
        firstName: firstName,
        lastName: lastName,
        address: '',
        verified: false,
        phone: phoneString,
        otp: otp,
        otp_verify: expiry,
        lat: 0,
        lang: 0,
        orders: [],
        cart: []
    })

    if(result){
        //Send the otp
        // await sendOTP(otp);

        console.log(otp)


        //Generate signature
        const signature = generateSignature({
            _id: result._id,
            phone: result.phone,
            verified: result.verified
        })

        //Send the result to client
        return res.json({
            signature: signature,
            verified: result.verified,
            phone: result.phone
        });
    }

    

}

//Signup
export const customerLogin = async(req, res) => {
    const {phone, password} = req.body;

        const existingCustomer = await Customer.findOne({phone: phone});
        if(existingCustomer){
            const validate = await validatePassword(password, existingCustomer.password);
            if(validate){
                 //Generate signature
               const signature = generateSignature({
                _id: existingCustomer._id,
                phone: existingCustomer.phone,
                verified: existingCustomer.verified
            })
    
            //Send the profile to client
            return res.json({
                signature: signature,
            });
            }
        }
    
    return res.json({
        message: "Customer Not Found",
    })
}

//Signup
export const customerVerify = async(req, res) => {
    const customer = req.user;
    const {OTP} = req.body;
    if(customer){
        const profile = await Customer.findById(customer._id);
        if(profile){
            if(profile.otp == parseInt(OTP) && profile.otp_verify >= new Date()){

                //Generate signature
               const signature = generateSignature({
                   _id: profile._id,
                   email: profile.email,
                   verified: profile.verified
               })
       
               //Verify Profile
               profile.verified = true;
               const updatedResult = await profile.save();
       
               //Send the profile to client
               return res.json({
                   signature: signature,
                   verified: updatedResult.verified,
                   phone: updatedResult.phone
               });
               }
        }
    }
    return res.json({
        message: "Customer Not Authenticated or OTP expired",
    })
}

//Signup
export const customerProfile = async(req, res) => {
    const customer = req.user;
    if(customer){
        const profile = await Customer.findById(customer._id);
        if(profile){
           return res.json(profile);
        }
    }
    return res.json({
        message: "Customer Not Authenticated",
    })
}

//Signup
export const editCustomerProfile = async(req, res) => {
    const customer = req.user;
    const { firstName, lastName, address, phone } = req.body;
    if(customer){
        const profile = await Customer.findById(customer._id);
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
        message: "Customer Not Authenticated",
    })
}


/**
|--------------------------------------------------
| Payment Section
|--------------------------------------------------
*/


export const CreatePayment = async(req, res) => {
    const customer = req.user;
    if(customer){
        const { amount, paymentMode, offerId} = req.body;
        let payableAmount = Number(amount);

        if(offerId){
            const appliedOffer = await Offer.findById(offerId);
            if(appliedOffer){
                if(appliedOffer.isActive) {
                    payableAmount = payableAmount - appliedOffer.offerAmount;
                }
            }
        }

        const transaction = await Transaction.create({
            customer: customer._id,
            orderId: "",
            vendorId: "",
            orderValue: payableAmount,
            offerUsed: offerId || "NA",
            status: "SUCCESS",
            paymentMode:paymentMode,
            paymentResponse: "The order is requested for cash on delivery."
        })

        return res.json(transaction)

    }
    return res.json({
        "message": "Unable to make payment"
    })
}


export const ValidateTransaction = async(txnId) => {
    const currentTransaction = await Transaction.findById(txnId);
    if(currentTransaction){
        if(currentTransaction.status.toLocaleLowerCase() === "success"){
            return { status: true, currentTransaction }
        }
    }
    return { status: false, currentTransaction }
}

/**
|--------------------------------------------------
| Assign Delivery Person Section
|--------------------------------------------------
*/

export const AssignDeliveryPerson = async(vendorId, orderId) => {
    const vendor = await Vendor.findById(vendorId);

    //Find the delivery person accrording to vendor location
    if(vendor){
        const areacode = vendor.pincode;
        const vendorLat = vendor.lat;
        const vendorLng = vendor.lng;
        // console.log(areacode)

        //find the available delivery persons
        const deliveryPersons = await Delivery.find({ pincode: areacode, verified: true, isAvailable: true });

        // console.log(deliveryPersons[0]._id)

        if(deliveryPersons ) {
            const  currentOrder = await Order.findById(orderId);
           if(currentOrder){
            currentOrder.deliveryId = deliveryPersons[0]._id;
            await currentOrder.save();
           }
        }

    }
}


/**
|--------------------------------------------------
| Order Section
|--------------------------------------------------
*/

export const CreateOrder = async(req, res) => {

    //Get the authenticated user
    const customer = req.user;
    
    if(customer){
    const { txnId, amount, items } = req.body;

    const { status, currentTransaction } = await ValidateTransaction(txnId);

  //  console.log(status, currentTransaction)

    if(!status) {
        return res.json({
            "message": "Failed to create order due to invalid transaction"
        })
    }

    //Create Order Id
    const orderId = Math.floor(Math.random() * 899999 + 100000);

    const profile = await Customer.findById(customer._id);

    let cartItems = [];
    let netAmount = 0.0;
    let vendorId;


   //Calculate the total amount of cart items
    const foods = await Food.find().where('_id').in(items.map(item => item._id)).exec();

    foods.map((food) => {
        items.map(({_id, unit}) => {
            if(food._id == _id){
                vendorId = food.vendorId;
                netAmount += (food.price * unit);
                cartItems.push({food, unit})
            }
        })
    })
    

    if(cartItems){
        //Create a new order
        const currentOrder = await Order.create({
            orderId: orderId,
            vendorId: vendorId,
            items: cartItems,
            totalAmount: netAmount,
            paidAmount: amount,
            orderDate: new Date(),
            orderStatus: 'Waiting',
            remarks: '',
            deliveryId: '',
            readyTime: 45
        })
        if(currentOrder){
            //Update the user order
            profile.cart = [];
            profile.orders.push(currentOrder);

            currentTransaction.orderId = orderId;
            currentTransaction.vendorId = vendorId;
            currentTransaction.status = "CONFIRMED";

            await currentTransaction.save();

            await AssignDeliveryPerson(vendorId, currentOrder._id);

            await profile.save();
            //Send it to client
            return res.json(currentOrder);
        }
    }

    }

    return res.json({
        "message": "Error while creating  order. Please try again."
    })

}

export const GetOrders = async(req, res) =>  {
  const customer = req.user;
  if(customer){
      const profile = await Customer.findById(customer._id).populate('orders');
      return res.json(profile.orders)
  }
  return res.json({
      "message": "Customer not  found. Please try again."
  })
}

export const GetOrderById = async(req, res) => {
    const customer = req.user;
    const orderId = req.params.id;
  if(customer){
      const order = await Order.findById(orderId).populate('items'); //here orderId = _id
      return res.json(order)
  }
  return res.json({
      "message": "Customer not  found. Please try again."
  })
}


/**
|--------------------------------------------------
| Cart Section
|--------------------------------------------------
*/

export const AddToCart = async(req,res) => {
    const customer = req.user;
    if(customer){
        const profile = await Customer.findById(customer._id).populate('cart.food');
        let cartItems = [];
        const { _id, unit } = req.body;

        const food = await Food.findById(_id);
        if(food){
            if(profile !==null ){
                cartItems = profile.cart;
                if(cartItems.length > 0){
                    //Update the existing cart items with the new unit
                    let existFoodItems = cartItems.filter(item => item.food._id.toString() === _id );
                    if(existFoodItems.length > 0){
                        const index = cartItems.indexOf(existFoodItems[0]);
                        if(unit>0){
                            cartItems[index] =  {food, unit};
                        } else{
                            cartItems.splice(index, 1);
                        }
                    } else{
                        cartItems.push({food, unit});
                    }
                } else{
                    cartItems.push({food, unit});
                }
                if(cartItems){
                    profile.cart = cartItems;
                    const cartResult = await profile.save();
                    return res.json(cartResult.cart);
                }
            }
        }
    }
    return res.json({
        "message": "Unable to create cart"
    })
}

export const GetCart = async(req,res) => {
    const customer = req.user;
    if(customer){
        const profile = await Customer.findById(customer._id).populate('cart.food');
        if(profile !==null ){
            return res.json(profile.cart);
        }
    }
    return res.json({
        "message": "Customer not found"
    })
}

export const DeleteCart = async(req,res) => {
    const customer = req.user;
    if(customer){
        const profile = await Customer.findById(customer._id).populate('cart.food');
        if(profile !==null ){
            profile.cart = [];
            const cartResult = await profile.save();
            return res.json(cartResult);
        }
    }
    return res.json({
        "message": "Customer not found"
    })
}


//Verify Offer
export const VerifyOffer = async(req, res) => {
    const customer = req.user;
    const offerId = req.params.id;
    if(customer) {
        const appliedOffer = await Offer.findById(offerId);
        if(appliedOffer) {
            if(appliedOffer.promoType === "USER"){
                //Only for once
            }
            else{
                if(appliedOffer.isActive){
                    return res.json({
                        "message": "Offer is valid",
                        offer: appliedOffer,
                    })
                }
            }
        }
    }
    return res.json({
        "message": "Customer not found"
    })
}



