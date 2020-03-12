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
    const rows = $('.wikitable tbody > tr');

    let count = 0;
    const tds = $('.wikitable tbody > tr td');
    tds.each((i, el) => {
      count += 1;
      const td_info = el;

      if (td_info.attribs.col_span !== '5') {
        if (count === 1)
          console.log('Crawler -> getItems -> td_info', td_info.children.text);
      }
    });

    // console.log(td_info);
  }
}

export default new Crawler();
