import mongoose from 'mongoose';

export interface Post extends mongoose.Document {
  author: string;
  url: string;
  imageUrl: string;
  content: any[];
  likes: number;
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
  type: Number
},
location: {
  type: String
}
});

export const PostModel = mongoose.model<Post>('Post', schema);