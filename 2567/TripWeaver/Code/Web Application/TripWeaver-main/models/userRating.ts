import mongoose, { Schema } from "mongoose";

const UserRatingSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  rating: [
    {
      attractionId: { type: String, required: true },
      rating_score: { type: Number, required: true },
    },
  ],
});

const UserRating =
  mongoose.models.UserRating || mongoose.model("UserRating", UserRatingSchema);

export default UserRating;
