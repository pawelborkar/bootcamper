import mongoose from 'mongoose';

const CourseSchema = new mongoose.Schema({
  title: {
    type: String,
    trim: true,
    required: [true, 'Please add a course title'],
  },
  description: {
    type: String,
    trim: true,
    required: [true, 'Please add a description for the bootcamp'],
  },
  weeks: {
    type: String,
    required: [true, 'Please add number of weeks'],
  },
  tuition: {
    type: Number,
    required: [true, 'Please add tuition cost'],
  },
  level: {
    type: String,
    required: [true, 'Please add a level.'],
    enum: ['beginner', 'intermediate', 'advanced'],
  },
  scholarshipAvailable: {
    type: Boolean,
    default: false,
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
    default: 'pawel',
  },
});

// Static method for calculating average cost for tuition in a bootcamp
CourseSchema.statics.getAverageCost = async function (bootcampId) {
  const obj = await this.aggregate([
    {
      $match: { bootcamp: bootcampId },
    },
    {
      $group: {
        _id: '$bootcamp',
        averageCost: { $avg: '$tuition' },
      },
    },
  ]);

  try {
    await this.model('Bootcamp').findByIdAndUpdate(bootcampId, {
      averageCost: Math.ceil(obj[0].averageCost / 10) * 10,
    });
  } catch (error) {
    console.error(error);
  }
};

// calculate the averageCost after saving
CourseSchema.post('save', function () {
  this.constructor.getAverageCost(this.bootcamp);
});

// calculate the averageCost before removing
CourseSchema.pre('remove', function () {
  this.constructor.getAverageCost(this.bootcamp);
});

export default mongoose.model('Course', CourseSchema);
