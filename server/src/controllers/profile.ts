import { paginationQuery } from "#/@types/misc";
import Audio, { AudioDocument } from "#/models/audio";
import AutoPlaylist from "#/models/autoGeneratedPlayList";
import History from "#/models/history";
import PlayList from "#/models/playList";
import User from "#/models/user";
import { getUserPreviousHistory } from "#/utils/helper";
import { RequestHandler } from "express";
import { request } from "http";
import { waitForDebugger } from "inspector";
import moment from "moment";
import { ObjectId, isValidObjectId } from "mongoose";
import { PipelineStage } from "mongoose";

export const updateFollower: RequestHandler = async (req, res) => {
  const { profiledId } = req.params;

  let status: "added" | "removed";

  if (!isValidObjectId(profiledId))
    return res.status(422).json({ error: "Invalid Profile Id" });

  const user = await User.findById(profiledId);
  console.log(user, "user");

  if (!user) return res.status(404).json({ error: "Profile Not Found" });

  const alreadyFollower = await User.findOne({
    _id: profiledId,
    followers: req.user.id,
  });

  console.log(alreadyFollower, "alreadyFollower");

  if (alreadyFollower) {
    await User.updateOne(
      {
        _id: profiledId,
      },
      {
        $pull: { followers: req.user.id },
      }
    );

    status = "removed";
  } else {
    await User.updateOne(
      {
        _id: profiledId,
      },
      {
        $addToSet: {
          followers: req.user.id,
        },
      }
    );

    status = "added";
  }

  if (status === "added") {
    await User.updateOne(
      { _id: req.user.id },
      { $addToSet: { followings: profiledId } }
    );
  }

  if (status === "removed") {
    await User.updateOne(
      {
        _id: req.user.id,
      },
      {
        $pull: {
          followings: profiledId,
        },
      }
    );
  }

  res.json({ status });
};

export const getUploads: RequestHandler = async (req, res) => {
  const { pageNo = "0", limit = "20" } = req.query as paginationQuery;

  const data = await Audio.find({ owner: req.user.id })
    .skip(parseInt(pageNo) * parseInt(limit))
    .limit(parseInt(limit))
    .sort("-createdAt");

  const audios = data.map((item) => {
    return {
      id: item._id,
      title: item.title,
      about: item.about,
      file: item.file,
      poster: item.poster?.url,
      date: item.createdAt,
      owner: { name: req.user.name, id: req.user.id },
    };
  });

  res.json({ audios });
};

export const getPublicUploads: RequestHandler = async (req, res) => {
  const { pageNo = "0", limit = "20" } = req.query as paginationQuery;
  const { profileId } = req.params;

  if (!isValidObjectId(profileId))
    return res.status(422).json({ error: "Invalid Profile Id" });

  const data = await Audio.find({ owner: profileId })
    .skip(parseInt(pageNo) * parseInt(limit))
    .limit(parseInt(limit))
    .sort("-createdAt")
    .populate<AudioDocument<{ name: string; _id: ObjectId }>>("owner");

  const audios = data.map((item) => {
    return {
      id: item._id,
      title: item.title,
      about: item.about,
      file: item.file,
      poster: item.poster?.url,
      date: item.createdAt,
      owner: { name: item.owner.name, id: item.owner._id },
    };
  });

  res.json({ audios });
};

export const getPublicProfile: RequestHandler = async (req, res) => {
  const { profileId } = req.params;

  if (!isValidObjectId(profileId))
    return res.status(422).json({ error: "Invalid Profile Id" });

  const user = await User.findById(profileId);
  if (!user) res.status(404).json({ error: "User Not Found" });

  res.json({
    profile: {
      id: user?._id,
      name: user?.name,
      followers: user?.followers.length,
      avatar: user?.avatar?.url,
    },
  });
};

export const getPublicPlayList: RequestHandler = async (req, res) => {
  const { profileId } = req.params;
  const { pageNo = "0", limit = "20" } = req.query as paginationQuery;

  if (!isValidObjectId(profileId))
    return res.status(422).json({ error: "Invalid Profile Id" });

  const playList = await PlayList.find({
    owner: profileId,
    visibility: "public",
  })
    .skip(parseInt(pageNo) * parseInt(limit))
    .limit(parseInt(limit))
    .sort("-createdAt");

  if (!playList) return res.status(404).json({ error: "PlayList Not Found" });

  res.json({
    playList: playList.map((item) => {
      return {
        id: item._id,
        title: item.title,
        itemCount: item.items.length,
        visibility: item.visibility,
      };
    }),
  });
};

export const getRecommendedByProfile: RequestHandler = async (req, res) => {
  const user = req.user;

  let matchOptions: PipelineStage.Match = {
    $match: { _id: { $exists: true } },
  };

  if (user) {
    const histories = await getUserPreviousHistory(req);

    const categories = histories.category;
    if (categories.length) {
      matchOptions = { $match: { category: { $in: categories } } };
    }
  }

  const audios = await Audio.aggregate([
    matchOptions,
    {
      $sort: {
        "likes.count": -1,
      },
    },
    {
      $limit: 10,
    },
    {
      $lookup: {
        from: "users",
        localField: "owner",
        foreignField: "_id",
        as: "owner",
      },
    },
    {
      $unwind: "$owner",
    },
    {
      $project: {
        _id: 0,
        id: "$_id",
        title: "$title",
        category: "$category",
        about: "$about",
        file: "$file.url",
        poster: "$poster.url",
        owner: { name: "$owner.name", id: "$owner._id" },
      },
    },
  ]);

  res.json({ audios });
};

export const getAutoGeneratedPlayList: RequestHandler = async (req, res) => {
  const histories = await getUserPreviousHistory(req);

  let matchOptions: PipelineStage.Match = {
    $match: { _id: { $exists: true } },
  };

  if (histories.length) {
    matchOptions = { $match: { $title: { $in: histories.category } } };
  }

  const autoGeneratedPlayList = await AutoPlaylist.aggregate([
    matchOptions,
    {
      $sample: { size: 4 },
    },
    {
      $project: {
        _id: "0",
        id: "$_id",
        title: "$title",
        itemsCount: { $size: "$items" },
      },
    },
  ]);

  res.json(autoGeneratedPlayList);
};
