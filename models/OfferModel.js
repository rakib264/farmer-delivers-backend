// import mongoose, { Schema, Document } from 'mongoose';
import mongoose, { Schema } from 'mongoose';


const OfferSchema = new Schema({
    offerType: { type: String, required: true }, // Vendor || Generic
    vendors : [{
        type:  Schema.Types.ObjectId, ref: 'vendor' ,
    }],
    title: { type: String, required: true },
    description: { type: String },
    minValue: { type: Number, required: true},
    offerAmount: { type: Number, required: true, required: true },
    startValidity: { type: Date }, 
    endValidity: { type: Date },
    promocode: { type: String, required: true },
    promoType: { type: String, required: true }, // User || Banks || Card
    banks: [
        {
            type: String
        }
    ],
    bins: [
        {
            type: String
        }
    ],
    pincode: { type: String, required: true }, //Area
    isActive: { type: Boolean }
},{
    toJSON: {
        transform(doc, ret){
            delete ret.__v;
        }
    },
    timestamps: true
});

const Offer = mongoose.model('offer', OfferSchema);
export { Offer };