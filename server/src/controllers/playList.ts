import {
  CreatePlayListRequest,
  PopulatedFavList,
  UpdatePlayListRequest,
} from "#/@types/audio";
import Audio from "#/models/audio";
import PlayList from "#/models/playList";
import { RequestHandler } from "express";
import { isValidObjectId } from "mongoose";

export const createPlayList: RequestHandler = async (
  req: CreatePlayListRequest,
  res
) => {
  const { title, audioId, visibility } = req.body;
  const ownerId = req.user.id;

  if (audioId) {
    const audio = await Audio.findById(audioId);
    if (!audio)
      return res.status(404).json({ error: "Could not found the audio" });
  }

  const newPlayList = new PlayList({
    title,
    owner: ownerId,
    visibility,
  });

  if (audioId) newPlayList.items = [audioId as any];

  await newPlayList.save();
  res.status(201).json({
    PlayList: {
      id: newPlayList._id,
      title: newPlayList.title,
      visibility: newPlayList.visibility,
    },
  });
};

export const updatePlayList: RequestHandler = async (
  req: UpdatePlayListRequest,
  res
) => {
  const { title, audio, id, visibility } = req.body;

  const playList = await PlayList.findOneAndUpdate(
    { _id: id, owner: req.user.id },
    { title, visibility },
    { new: true }
  );
  if (!playList) res.status(404).json({ error: "Could Not Find PlayList" });

  if (audio) {
    const found_Audio = await Audio.findById(audio);
    if (!found_Audio)
      return res.status(404).json({ error: "Audio Not Found!" });
    await PlayList.findByIdAndUpdate(playList?._id, {
      $addToSet: { items: found_Audio },
    });
  }

  res.status(201).json({
    PlayList: {
      id: playList?._id,
      title: playList?.title,
      visibility: playList?.visibility,
    },
  });
};

export const removePlayList: RequestHandler = async (req, res) => {
  const { playListId, audioId, all } = req.query;

  if (!isValidObjectId(playListId))
    return res.status(404).json({ error: "Invalid PlayList Id" });

  if (all === "yes") {
    const playList = await PlayList.findOneAndDelete({
      _id: playListId,
      owner: req.user.id,
    });

    if (!playList)
      return res.status(404).json({ error: "PlayList Not Found!" });
  }

  if (audioId) {
    if (!isValidObjectId(audioId))
      return res.status(404).json({ error: "Invalid audio Id" });

    const playList = await PlayList.findOneAndUpdate(
      {
        _id: playListId,
        owner: req.user.id,
      },
      {
        $pull: { items: audioId },
      }
    );

    if (!playList)
      return res.status(404).json({ error: "PlayList Not Found!" });
  }
  res.json({ success: true });
};

export const getPlayListByProfile: RequestHandler = async (req, res) => {
  const { pageNo = "0", limit = "20" } = req.query as {
    pageNo: string;
    limit: string;
  };

  const playListData = await PlayList.find({
    owner: req.user.id,
    visibility: { $ne: "auto" },
  })
    .skip(parseInt(pageNo) * parseInt(limit))
    .limit(parseInt(limit))
    .sort("-createdAt");

  const playList = playListData.map((item) => {
    return {
      id: item._id,
      title: item.title,
      itemsCount: item.items.length,
      visibility: item.visibility,
    };
  });

  res.json({ playList });
};

export const getAudios: RequestHandler = async (req, res) => {
  const { playlistId } = req.params;

  if (!isValidObjectId(playlistId))
    return res.status(404).json({ error: "Invalid Audio Id" });

  const playList = await PlayList.findOne({
    owner: req.user.id,
    _id: playlistId,
  }).populate<{ items: PopulatedFavList[] }>({
    path: "items",
    populate: {
      path: "owner",
      select: "name",
    },
  });

  if (!playList) return res.json({ list: [] });

  const audios = playList.items.map((item) => {
    return {
      id: item._id,
      title: item.title,
      category: item.category,
      file: item.file.url,
      poster: item.poster?.url,
      owner: { name: item.owner.name, id: item.owner._id },
    };
  });

  res.json({
    list: {
      id: playList._id,
      title: playList.title,
      audios,
    },
  });
};
