import * as mongoose from 'mongoose';

export interface Posts extends mongoose.Document {
    author: string;
    url: string;
    imageUrl: string;
    content: any[];
    likes: string;
    location: string;
}

const schema = new mongoose.Schema({
  author: {
    type: String
  },
  url: {
    type: String
  },
  imageUrl: {
    type: String
  },
  content: {
    default: [],
    type: Array
  },
  likes: {
    type: String
  },
  location: {
    type: String
  }
});

export const PostModel = mongoose.model<Posts>('Posts', schema);
