import mongoose, { Schema, Document } from 'mongoose';

export interface ICake extends Document {
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  ingredients: string[];
  weight: number;
  available: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const cakeSchema: Schema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  image: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true,
    enum: ['birthday', 'wedding', 'anniversary', 'custom', 'seasonal', 'pastry', 'dessert', 'savory', 'bread', 'snack']
  },
  ingredients: [{
    type: String,
    required: true
  }],
  weight: {
    type: Number,
    required: true,
    min: 0.1
  },
  available: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

export const Cake = mongoose.model<ICake>('Cake', cakeSchema);
