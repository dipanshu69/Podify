import { Model, ObjectId, model, models, Schema } from "mongoose";

interface FavoriteDocument {
  owner: ObjectId;
  items: ObjectId[];
}

const favoriteSchema = new Schema<FavoriteDocument>(
  {
    owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    items: [{ type: Schema.Types.ObjectId, ref: "Audio" }],
  },
  {
    timestamps: true,
  }
);

const Favorite = models.Favorite || model("favoriteSchema", favoriteSchema);

export default Favorite as Model<FavoriteDocument>;
