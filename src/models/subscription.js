import mongoose, { Schema } from "mongoose";

const SubscriptionSchema = new mongoose.Schema(
  {
    subscriber: Schema.Types.ObjectId,
    ref: "User",
  },
  {
    channel: Schema.Types.ObjectId,
    ref: "User",
  },
  {
    timestamps: true,
  }
);

const Subscription = mongoose.model("Subscription", SubscriptionSchema);

export default Subscription;
