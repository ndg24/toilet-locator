const mongoose = require('mongoose');

const toiletSchema = new mongoose.Schema({
  name: { type: String, required: true },
  address: { type: String, required: true },
  location: {
    type: {
      type: String,
      enum: ['Point'],
      required: true,
    },
    coordinates: {
      type: [Number],
      required: true,
    },
  },
  ratings: [{ type: Number }],
  reviews: [
    {
      reviewText: { type: String },
      rating: { type: Number },
      // You can add more fields to reviews as needed (e.g., userId, timestamp, etc.)
    },
  ],
  // You can add more fields as needed
});

// Index the 'location' field to enable geospatial queries
toiletSchema.index({ location: '2dsphere' });

const Toilet = mongoose.model('Toilet', toiletSchema);

module.exports = Toilet;