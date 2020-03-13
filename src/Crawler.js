import axios from 'axios';
import cheerio from 'cheerio';

const BASE_URL = 'https://deadbydaylight.gamepedia.com';

class Crawler {
  constructor() {
    this.init();
  }

  init() {
    this.getItems();
  }

  async getItems() {
    const { data } = await axios.get(`${BASE_URL}/items`);
    const $ = cheerio.load(data);

    const trs = $('.wikitable tbody > tr');
    let count = 0;
    let column_names = [];
    let list = []

    trs.each((i, el) => {
      count += 1;

      const children = $(el).children();
      const qtt_columns = children.length;
      let attr = {}
      if (qtt_columns === 5) {
        if (count === 1) {
          children.each((i, el) => {
            const column_name = $(el).text().toLowerCase();
            column_names.push(column_name);
            console.log('Crawler -> getItems -> ', column_name);
          });
        }else {
          children.each((i, el) => {
            const value = $(el).text();
             attr[column_names[i]] = value;
          });
          list.push(attr);
        }
      }
    });
    console.log('Crawler -> getItems -> column_names', column_names);
    console.log('Crawler -> getItems -> list', list);
  }
}

export default new Crawler();
