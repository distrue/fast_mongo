import mongoose from 'mongoose';

export interface Channel extends mongoose.Document {
    thumbnail: string;
    followers: number;
    displayName: string;
    description: string;
    author: string;
  }
  
  const channelSchema = new mongoose.Schema({
  thumbnail: {
    type: String
  },
  author: {
    type: String
  },
  followers: {
    type: Number
  },
  displayName: {
    type: String
  },
  description: {
    type: String
  }
  });
  
  export const ChannelModel = mongoose.model<Channel>('Channels', channelSchema);