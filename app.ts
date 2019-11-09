import * as mongoose from 'mongoose';
import * as fs from 'fs-extra';

const db = 'mongodb://localhost/local';
console.log(db);

import {PostModel, Posts} from './posts';


async function readCSV() {
  const file = fs.readFileSync('./src.csv', 'utf-8');
  const lines = file.split('\n');
  lines.shift();
  return lines.map((v) => {
    const vv = v.split('$');
    try{
    return {
      author: vv[0],
      url: vv[1],
      imageUrl: vv[2],
      content: vv[3].split('</a>').map(item => {
          // console.log(item.match(/#.*/gi)[0]);
          return item.match(/#.*/gi)
      }),
      likes: vv[4],
      location: vv[5].split('>')[1].split('<')[0]
    } as Posts;
    }catch(err) {
        return null;
    }
  })
}


async function add(item: Posts) {
  let valid:any[] = [];
  if(item.content !== null) {
    for(let cnt of item.content) {
        if(cnt === null) continue;
        let flag = false
        for(let ch of spamFilter) {
            if(cnt[0].match(ch)) flag = true
        }
        if(flag === false)  valid.push(cnt[0]); 
    }
  }
  console.log(valid)
  console.log(new PostModel({
      author: item.author,
      content: valid,
      imageUrl: item.imageUrl,
      likes: item.likes,
      url: item.url,
      location: item.location
  }).save());
}


async function addToDB(items: Posts[]) {
  for (const item of items) {
    if(item === null) continue
    await add(item);
  }
  console.log('[!] Complete');
}

let res = {};
async function extract() {
    let answer = [];
    PostModel.find({})
    .then(data => {
        data.forEach(item => {
            for(let tag of item.content) {
                if(String(tag) in res) {
                    res[String(tag)] += 1;
                }
                else {
                    res[String(tag)] = 1;
                }
            } 
        })
        let x = Object.keys(res)
        x.sort(function(a, b) { return res[a] - res[b]; })
        x.forEach(item => {
            //console.log(Number(res[item]));
            answer.push({item: item, value: res[item]});
        })
        console.log(answer)
    })
}

function work() {
  readCSV().then(addToDB).then(extract);
}

const spamFilter = [/셀카/, /좋반/, /셀기꾼/, /맞팔/, /좋아요/, /맛집/, /팔로우/, /lfl/, /follow/, /셀피/, /like/, "소통", "f4f", /ootd/]
const localFilter = [/가로수길/, /스타그램/, /Cheongdam-dong/, /Seoul, Korea/, /^가로수길맛집$/, /^신사역$/, /Busan/, /압구정/, /신사/, /Garosu/, /롯데백화점/, /South Korea/, /강남/]

function activeFilter() {
    PostModel.find({})
    .then(data => {
        data.forEach(post => {
            post.content.forEach((item, idx) => {
                for(let ch of localFilter) {
                    if(item.match(ch)) post.content.splice(idx, 1)
                }
            })
            post.save()
        })
    })
}

mongoose.connect(db, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(res => {
    console.log(res);
    console.log('Connected to MONGODB');
    return true;
}).catch((err:any) => {
    console.log('turn on MongoDB');
})
.then(async () => {
    console.log("go")
    work()
    // await extract()
    // activeFilter()
})