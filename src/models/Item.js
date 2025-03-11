import mongoose from "mongoose";
const Schema = mongoose.Schema;

const itemsSchema = new Schema(
  {
    item: {
      type: String,
      required: true,
    },
    boughtAt: {
      type: Date,
    },
    boughtBy: {
      type: String,
    },
    cost: {
      type: Number,
    },
    pinnedBy: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.Items || mongoose.model("Items", itemsSchema);
