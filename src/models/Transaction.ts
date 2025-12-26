import mongoose, { Schema, Model } from 'mongoose';

export interface ITransaction {
  userId: string;
  type: 'purchase' | 'earn' | 'spend';
  amount: number;
  description: string;
  stripeSessionId?: string;
  createdAt: Date;
}

const TransactionSchema = new Schema<ITransaction>({
  userId: {
    type: String,
    required: true,
    index: true,
  },
  type: {
    type: String,
    enum: ['purchase', 'earn', 'spend'],
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  stripeSessionId: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export const Transaction: Model<ITransaction> = 
  mongoose.models.Transaction || mongoose.model<ITransaction>('Transaction', TransactionSchema);
