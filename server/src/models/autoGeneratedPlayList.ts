import { Model, ObjectId, Schema, model, models } from "mongoose";

interface AutoPlaylistDocument {
  title: string;
  items: ObjectId[];
}

const AutoPlayListSchema = new Schema<AutoPlaylistDocument>(
  {
    title: {
      type: String,
      required: true,
    },
    items: [
      {
        type:Schema.Types.ObjectId,
        required: true,
        ref:"Audio"
      },
    ],
  },
  {
    timestamps: true,
  }
);

const AutoPlaylist = models.AutoPlaylist || model("AutoPlayList", AutoPlayListSchema);

export default AutoPlaylist as Model<AutoPlaylistDocument>;
