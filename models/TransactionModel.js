// import mongoose, { Schema, Document } from 'mongoose';
import mongoose, { Schema } from 'mongoose';


const TransactionSchema = new Schema({
    customer: { type: String},
    vendorId: { type: String},
    orderId: { type: String},
    orderValue: { type: Number },
    offerUsed: { type: String },
    status: { type: String },
    paymentMode: { type: String },
    paymentResponse: { type: String },

},{
    toJSON: {
        transform(doc, ret){
            delete ret.__v;
            delete ret.createdAt;
            delete ret.updatedAt;
        }
    },
    timestamps: true
});

const Transaction = mongoose.model('transaction', TransactionSchema);
export { Transaction };