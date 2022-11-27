// import mongoose, { Schema, Document } from 'mongoose';
import mongoose, { Schema } from 'mongoose';


const CustomerSchema = new Schema({
    salt: { type: String, required: true},
    password: { type: String, required: true},
    firstName: { type: String },
    lastName: { type: String},
    address: { type: String},
    phone: { type: String, required: true},
    verified: { type: Boolean, required: true},
    otp: { type: Number, required: true },
    otp_verify: { type: Date, required: true},
    lat: { type: Number, required: true },
    lang: { type: Number, required: true },
    cart: [
        {
            food: {type: Schema.Types.ObjectId, ref: 'food', required: true},
            unit: { type: Number, required: true}
        }
    ],
    orders: [
        {
            type: Schema.Types.ObjectId,
            ref:"order"
        }
    ]
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

const Customer = mongoose.model('customer', CustomerSchema);
export { Customer };