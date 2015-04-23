/*
A Tiny schema for checking what service a thread is going to use and then including the required,
service specific meta data and schema. The entries then know what data to expect from the specific service api calls.
*/
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var youtubeMeta = new Schema({
  channel_username: { type: String, required: true },
  playlist_id: { type: String, default: ''}
});

var youtube = new Schema({
  id: { type: String},
  videoId: { type: String },
  publishedAt: { type: String},
  channelId: { type: String},
  channelTitle: { type: String},
  playlistId: { type: String },
  title: { type: String },
  description: { type: String},
  thumbnails: {
    default: {
      url: {type: String},
      width: { type: Number},
      height: { type: Number}
      },
    medium: {
      url: {type: String},
      width: { type: Number},
      height: { type: Number}
      },
    high: {
      url: {type: String},
      width: { type: Number},
      height: { type: Number}
      },
    standard: {
      url: {type: String},
      width: { type: Number},
      height: { type: Number}
      },
    maxres: {
      url: {type: String},
      width: { type: Number},
      height: { type: Number}
      },
    }
  });

module.exports = {
  YoutubeMeta: mongoose.model('YoutubeMeta', youtubeMeta),
  YouTube: mongoose.model('YouTube', youtube)
}
