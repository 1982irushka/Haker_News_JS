export default class APIService {
  #HOST;

  constructor(host) {
    this.#HOST = host;
    this.fetchOne = this.fetchOne.bind(this);
    this.fetchAll = this.fetchAll.bind(this);
  }

  get news() {
    return `${this.#HOST}/topstories.json?print=pretty`;
  }

  getItemUrl(id) {
    return `${this.#HOST}/item/${id}.json?print=pretty`;
  }

  // eslint-disable-next-line class-methods-use-this
  async fetchOne(url) {
    const response = await fetch(url);
    const { status, ok } = response;
    if (!ok) {
      const message = `An error has occured: ${status}`;
      throw new Error(message);
    }
    const result = await response.json();
    return result;
  }

  async fetchAll(urls) {
    const results = await Promise.all(urls.map((url) => this.fetchOne(url)));
    return results;
  }
}
