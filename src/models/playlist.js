import mongoose from "mongoose";

const PlaylistSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    descriptiom: {
      type: String,
      required: true,
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    videos: [
      {
        type: Schema.Types.ObjectId,
        ref: "Video",
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Playlist = mongoose.model("Playlist", PlaylistSchema);
export default Playlist;
