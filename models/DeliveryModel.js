// import mongoose, { Schema, Document } from 'mongoose';
import mongoose, { Schema } from 'mongoose';


const DeliverySchema = new Schema({
    email: { type: String, required: true},
    salt: { type: String, required: true},
    password: { type: String, required: true},
    firstName: { type: String },
    lastName: { type: String},
    address: { type: String},
    phone: { type: String, required: true},
    verified: { type: Boolean, required: true},
    lat: { type: Number },
    lng: { type: Number },
    pincode: { type: Number },
    isAvailable : { type: Boolean }
},{
    toJSON: {
        transform(doc, ret){
            delete ret.salt,
            delete ret.password,
            delete ret.__v;
            delete ret.createdAt;
            delete ret.updatedAt;
        }
    },
    timestamps: true
});

const Delivery = mongoose.model('delivery', DeliverySchema);
export { Delivery };