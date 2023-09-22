import mongoose from 'mongoose';
import ErrorResponse from '../utils/errorResponse.js';

const ReviewSchema = new mongoose.Schema({
  title: {
    type: String,
    trim: true,
    required: [true, 'Please add a title'],
  },
  description: {
    type: String,
    trim: true,
    required: [true, 'Please add some text'],
  },
  rating: {
    type: Number,
    min: 1,
    max: 10,
    required: [true, 'Please give a rating between 1 and 10'],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  bootcamp: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Bootcamp',
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
});
// User can add only one review per bootcamp
ReviewSchema.index({ bootcamp: 1, user: 1 }, { unique: true });

ReviewSchema.pre('save', async function (next) {
  const existingReview = await this.constructor.findOne({
    user: this.user,
    bootcamp: this.bootcamp,
  });

  if (existingReview) {
    return next(
      new ErrorResponse(`You have already reviewed this bootcamp`, 403)
    );
  } else {
    next();
  }
});

export default mongoose.model('Review', ReviewSchema);
