const mongoose = require('mongoose');

const movieSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    description: {
      type: String,
      required: true,
      trim: true
    },
    year: {
      type: Number,
      required: true,
      min: 1888
    },
    genres: {
      type: [String],
      required: true
    },
    rating: {
      type: Number,
      required: true,
      min: 0,
      max: 10
    },
    posterUrl: {
      type: String,
      trim: true
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Movie', movieSchema);
