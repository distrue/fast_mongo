import mongoose from 'mongoose';
import * as fs from 'fs-extra';
import {Post, PostModel} from '../model/posts';

export async function detailCSV() {
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
          content: vv[3]?vv[3].split('</a>').map(item => {
              return item.match(/#.*/gi)
          }):[],
          likes: vv[4]?Number(vv[4].split('>')[1].split("<")[0].replace(/,/gi,'')):0,
          location: vv[5]?vv[5].split('>')[1].split('<')[0]:''
        } as Post;
      } catch(err) {
        return null;
      }
    })
}

export async function add(item: Post) {
    let valid:any[] = [];
    if(item.content !== null && item.content.length >= 1) {
      for(let cnt of item.content) {
          if(cnt === null) continue;
          let flag = false
          if(flag === false)  valid.push(cnt[0]); 
      }
    }
    await new PostModel({
      author: item.author,
      content: valid,
      imageUrl: item.imageUrl,
      likes: item.likes?item.likes:0,
      url: item.url,
      location: item.location
    }).save()
  }
  

export async function addToDB(items: (Post|null)[]) {
    console.log(items);
    for (const item of items) {
      if(item === null) continue
      await add(item);
    }
    console.log('[!] Complete');
  }
  
export  let res:any = {};

export  async function extract(filter: Object) {
      let answer:any = [];
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

export function likes(filter: Object) {
  PostModel.find(filter).sort({likes:-1})
  .then(data => {
    data.forEach(item => {
      console.log(`{'likes':${ item.likes }, 'image':${item.imageUrl }}, `)
    })
  })
}

export const userP:any = {}
export function users() {
    PostModel.find({})
    .then(data => {
        data.forEach(post => {
            if(String(post.author) in Object.keys(userP)) {                
            }
            else {
                userP[post.author] = 1
            }
        })
        console.log(Object.keys(userP))
    })
}