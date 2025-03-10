import mongoose from "mongoose";
const Schema = mongoose.Schema;

const itemToBuySchema = new Schema(
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

export default mongoose.models.ItemToBuy ||
  mongoose.model("ItemToBuy", itemToBuySchema);
