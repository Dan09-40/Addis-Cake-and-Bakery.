import mongoose, { Schema, Document } from 'mongoose';

export interface IOrder extends Document {
  user: mongoose.Types.ObjectId;
  orderItems: Array<{
    cake: mongoose.Types.ObjectId;
    quantity: number;
  }>;
  shippingAddr: {
    street: string;
    city: string;
    postalCode: string;
  };
  totalPrice: number;
  isPaid: boolean;
  deliveryDate: Date;
  createdAt: Date;
  updatedAt: Date;
}

const orderSchema: Schema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  orderItems: [{
    cake: {
      type: Schema.Types.ObjectId,
      ref: 'Cake',
      required: true
    },
    quantity: {
      type: Number,
      required: true,
      min: 1
    }
  }],
  shippingAddr: {
    street: {
      type: String,
      required: true
    },
    city: {
      type: String,
      required: true
    },
    postalCode: {
      type: String,
      required: true
    }
  },
  totalPrice: {
    type: Number,
    required: true,
    min: 0
  },
  isPaid: {
    type: Boolean,
    default: false
  },
  deliveryDate: {
    type: Date,
    required: true
  }
}, {
  timestamps: true
});

export const Order = mongoose.model<IOrder>('Order', orderSchema);
