import mongoose from 'mongoose';
import slugify from 'slugify';
import geocoder from '../utils/geocoder.js';
const BootcampSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please add a name'],
      unique: true,
      trim: true,
      maxlength: [50, 'Name can not be more than 50 characters'],
    },
    slug: String,
    description: {
      type: String,
      required: [true, 'Please add a description'],
      maxlength: [500, 'Description can not be more than 500 characters'],
    },
    website: {
      type: String,
      match: [
        /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/,
        'Please use a valid URL with HTTP or HTTPS',
      ],
    },
    phone: {
      type: String,
      maxlength: [16, 'Phone number can not be longer than 16 characters'],
    },
    email: {
      type: String,
      lowercase: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        'Please add a valid email',
      ],
    },
    address: {
      type: String,
      required: [true, 'Please add an address'],
    },
    location: {
      // GeoJSON Point
      type: {
        type: String,
        enum: ['Point'],
        // required: true,
      },
      coordinates: {
        type: [Number],
        index: '2dsphere',
        // required: true,
      },
      formattedAddress: String,
      street: String,
      city: String,
      state: String,
      zipcode: String,
      country: String,
    },
    careers: {
      // Array of strings
      type: [String],
      required: true,
      enum: [
        'Web Development',
        'BlockChain Development',
        'System Design',
        'Mobile Development',
        'UI/UX',
        'Data Science',
        'Business',
        'Other',
      ],
    },
    averageRating: {
      type: Number,
      min: [1, 'Rating must be at least 1'],
      max: [10, 'Rating must can not be more than 10'],
    },
    averageCost: Number,
    photo: {
      type: String,
      default: 'no-photo.jpg',
    },
    housing: {
      type: Boolean,
      default: false,
    },
    jobAssistance: {
      type: Boolean,
      default: false,
    },
    jobGuarantee: {
      type: Boolean,
      default: false,
    },
    acceptGi: {
      type: Boolean,
      default: false,
    },
    createdAt: {
      type: Date,
      default: Date.now,
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
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
  {
    timestamp: true,
  }
);

// Create slug for URL
BootcampSchema.pre('save', function (next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});

// Geocode and create location field
BootcampSchema.pre('save', async function (next) {
  try {
    const loc = await geocoder.geocode(this.address);
    if (loc && loc.length > 0) {
      this.location = {
        type: 'Point',
        coordinates: [loc[0].longitude, loc[0].latitude],
        street: loc[0].streetName,
        city: loc[0].city,
        state: loc[0].state,
        zipcode: loc[0].zipcode,
        country: loc[0].country,
      };
    } else {
      // Handle the case where geocoder returned an empty result
      // or loc[0] is undefined
      console.error('Geocoder did not return valid location data.');
    }

    // Don't save address in the database
    this.address = undefined;
    next();
  } catch (error) {
    // Handle any errors that may occur during geocoding
    console.error('Error during geocoding:', error);
    next(error); // Pass the error to the next middleware
  }
});

// Cascade delete courses when a bootcamp is deleted
BootcampSchema.pre('remove', async function (next) {
  // removes all the courses related to the bootcamp which is being deleted by the admin
  await this.model('Course').deleteMany({ bootcamp: this._id });
  next();
});

// Reverse populate with virtuals
BootcampSchema.virtual('courses', {
  ref: 'Course',
  localField: '_id',
  foreignField: 'bootcamp',
  justOne: false,
});

export default mongoose.model('Bootcamp', BootcampSchema);
