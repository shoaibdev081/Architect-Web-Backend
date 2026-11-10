const mongoose = require('mongoose');

// ClientReview fields:
// name: Client's name
// role: Client's role or designation
// feedback: Review text/feedback
// image: Client's image URL
// rating: Star rating (1-5, can be decimal)
// reviews: (optional) number of reviews
const ClientReviewSchema = new mongoose.Schema({
  name: { type: String, required: true },
  role: { type: String, default: '' },
  feedback: { type: String, default: '' },
  image: { type: String, default: '' },
  rating: { type: Number, default: 0 },
  // reviews field removed
}, { timestamps: true });

module.exports = mongoose.model('ClientReview', ClientReviewSchema);
