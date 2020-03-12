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
    const row = $('.wikitable tbody > tr');

    const count = 0;
    $('.wikitable tbody > tr').each(() => {
      console.log(
        $(this)
          .text()
          .trim()
      );
    });
  }
}

export default new Crawler();
