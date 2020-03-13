import axios from 'axios';
import cheerio from 'cheerio';

const BASE_URL = 'https://deadbydaylight.gamepedia.com';
const FIRST_ROW = 0;

class Crawler {
  constructor() {
    this.init();
  }

  init() {
    this.getItems();
  }

  removeLineBreak(string) {
    return string.replace(/(\r\n|\n|\r)/gm, '');
  }

  getImgURL(el) {}

  async getItems() {
    const { data } = await axios.get(`${BASE_URL}/items`);
    const $ = cheerio.load(data);

    let column_name = '';
    let column_names = [];
    let list = [];

    const trs = $('.wikitable tbody > tr');
    trs.each((row, el) => {
      const children = $(el).children();
      const qtt_columns = children.length;
      let attr = {};

      if (qtt_columns === 5) {
        if (row === FIRST_ROW) {
          children.each((i, child) => {
            column_name = $(child)
              .text()
              .toLowerCase();
            column_names.push(column_name);
            console.log('Crawler -> getItems -> attr -> ', column_name);
          });
        } else {
          children.each((i, child) => {
            const text = $(child).text();
            column_name = column_names[i];

            if (column_name === 'icon') {
              const img_url = $(child)
                .find('img')
                .attr('src');
              attr[column_name] = img_url ? img_url : '';
            } else if (column_name === 'name') {
              attr[column_name] = this.removeLineBreak(text);
            } else {
              attr[column_name] = text;
            }
          });
          list.push(attr);
        }
      }
    });
    // console.log('Crawler -> getItems -> column_names', column_names);
    // console.log('Crawler -> getItems -> list', list);
  }
}

export default new Crawler();
