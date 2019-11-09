import mongoose from 'mongoose';

import {Post, PostModel} from './model/posts';
import {Channel, ChannelModel} from './model/channel';
import {detailCSV, add, addToDB, extract, likes, res, userP, users} from './controller/detail';
import {addMain, mainCSV} from './controller/main';

const db = 'mongodb://localhost/instatoon';
console.log(db);


mongoose.connect(db, {
    useNewUrlParser: true, useUnifiedTopology: true
}).then(() => {
    console.log('Connected to MONGODB');
    return true;
}).catch((err:any) => {
    console.log('error on MongoDB');
})
.then(async () => {
    console.log("go")

    // Manually comment or use code!
    
    // detailCSV().then(addToDB).then(() => extract({}));
    // mainCSV().then(addMain)
    console.log(await ChannelModel.find({}).sort({"followers":-1}))
    // await extract({author: "belly.gom"})
    // users()
    // likes({author: "belly.gom"})
})
