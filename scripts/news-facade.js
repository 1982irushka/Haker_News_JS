export default class NewsFacade {
  constructor(store, news, compose) {
    this.store = store;
    this.news = news;
    this.compose = compose;
  }

  setup() {
    const news = this.store.get('news');
    const comments = this.store.get('comments');
    const setup = this.compose(
      this.news.produceNewsHtml,
      this.news.setInnerHtml,
      this.news.listenCommentBtnClick
    );
    setup({ news, comments });
  }
}
