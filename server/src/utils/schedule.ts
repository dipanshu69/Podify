import Audio from "#/models/audio";
import AutoPlaylist from "#/models/autoGeneratedPlayList";
import { RequestHandler } from "express";
import cron from "node-cron";

export const geneRatePlayList = async () => {
  const result = await Audio.aggregate([
    { $sort: { likes: -1 } },
    {
        $sample: {size: 20},
      },
    {
      $group: {
        _id: "$category",
        audios: { $push: "$$ROOT._id" },
      },
    },
  ]);

  result.map(async (item) => {
    await AutoPlaylist.updateOne(
      { title: item._id },
      { $set: { items: item.audios } },
      { upsert: true }
    );
  });
};

cron.schedule("0 0 * * *", async () => {
  await geneRatePlayList();
});