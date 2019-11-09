import {Channel, ChannelModel} from '../model/channel';
import * as fs from 'fs-extra';


export async function addMain(items: (Channel|null)[]) {
    // console.log(items);
    for (const item of items) {
      if(item === null) continue
      try{
        console.log(item.followers);
      console.log(await new ChannelModel({
        thumbnail: item.thumbnail,
        followers: item.followers,
        displayName: item.displayName,
        description: item.description
      }).save());
    }catch(err) {
      continue;
    }
    }
    console.log('[!] Complete');
  }
  
export  async function mainCSV() {
    const file = fs.readFileSync('./src.csv', 'utf-8');
    const lines = file.split('\n');
    lines.shift();
    return lines.map((v) => {
      const vv = v.split('$');
      let ans = vv[1]; let multi = 1;
      if(vv[1].match(/천/gi)) {
        vv[1].replace(/천/gi, ''); multi *= 1000;
      }
      if(vv[1].match(/만/gi)) {
        vv[1].replace(/만/gi, ''); multi *= 10000;
      }
      multi *= Number(vv[2]);
      console.log(multi, vv[2]);
      try{
        return {
          thumbnail: vv[0],
          author: vv[1],
          followers: multi,
          displayName: vv[3],
          description: vv[4]
        } as Channel;
      } catch(err) {
        return null;
      }
    })
  }
  