const mongoose = require('mongoose');
const Comment = require('./comment');

// Schema Setup
const campgroundSchema = new mongoose.Schema({
  name: String,
  image: String,
  description: String,
  author: {
    id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    username: String
  },
  comments: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Comment'
    }
  ]
});

// Colt Steele's solution to remove all comments when campground is deleted.

// campgroundSchema.pre('remove', async function() {
//   await Comment.remove({
//     _id: {
//       $in: this.comments
//     }
//   });
// });

module.exports = mongoose.model('Campground', campgroundSchema);
