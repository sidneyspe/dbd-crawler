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
    const column_names = [];
    const list = [];

    const trs = $('.wikitable tbody > tr');
    trs.each((row, el) => {
      const children = $(el).children();
      const qtt_columns = children.length;
      const item = {};

      if (qtt_columns === 5) {
        if (row === FIRST_ROW) {
          children.each((i, child) => {
            column_name = $(child)
              .text()
              .toLowerCase();
            column_names.push(this.removeLineBreak(column_name));
            // console.log('Crawler -> getItems -> attr -> ', column_name);
          });
        } else {
          children.each((i, child) => {
            const text = $(child).text();
            column_name = column_names[i];

            if (column_name === 'icon') {
              const img_url = $(child)
                .find('img')
                .attr('src');
              item[column_name] = img_url || '';
            } else if (column_name === 'name') {
              item[column_name] = this.removeLineBreak(text);
            } else if (column_name === 'description') {
              const list_li = [];

              const desc = $(child).children()[0]
                ? $(child).children()[0].prev.data
                : '';
              const li = $(child).find('ul li');
              const quote = $(child)
                .find('p')
                .text();

              li.each((i, desc) => {
                const desc_text = this.removeLineBreak($(desc).text());
                list_li.push(desc_text);
              });
              item[column_name] = this.removeLineBreak(desc);
              item.quote = this.removeLineBreak(quote);
              item.advantages = list_li;
            } else if (column_name === 'durability') {
              item[column_name] = this.removeLineBreak(text);
            } else if (column_name === 'rarity') {
              item[column_name] = this.removeLineBreak(text);
            } else {
              item[column_name] = text;
            }
          });
          list.push(item);
        }
      }
    });
    // console.log('Crawler -> getItems -> column_names', column_names);
    // console.log('Crawler -> getItems -> list', list);
    const json = JSON.stringify(list);
    console.dir(list);
  }
}

export default new Crawler();
