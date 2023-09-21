import { Schema, model } from 'mongoose';

const ReviewsSchema = new Schema({
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
    max: 5,
    required: [true, 'Please give a rating between 1 and 5'],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  bootcamp: {
    type: mongoose.Schema.ObjectId,
    ref: 'Bootcamp',
    required: true,
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true,
  },
  username: {
    type: String,
    ref: 'User',
    required: true,
  },
});

export default model('Review', ReviewsSchema);
