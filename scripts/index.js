import NewsFacade from './news-facade.js';
import Store from './store.js';
import APIService from './api-service.js';
import News from './news.js';
import compose from './compose.js';
import UserInfoForm from './user-info-form.js';
import hideLoader from './loader.js';

/**
 * News
 */
const HOST = 'https://hacker-news.firebaseio.com/v0';
const api = new APIService(HOST);
const store = new Store();
(async () => {
  try {
    const ids = await api.fetchOne(api.news);
    const urls = ids.slice(0, 5).map((id) => api.getItemUrl(id));
    const news = await api.fetchAll(urls);
    const commentsUrls = news.reduce(
      (accumulator, { kids }) => [
        ...accumulator,
        ...(kids ?? []).slice(0, 4).map((id) => api.getItemUrl(id)),
      ],
      []
    );
    const comments = await api.fetchAll(commentsUrls);
    store.set('news', news);
    store.set('comments', comments);
    const producer = new NewsFacade(
      store,
      new News('news-list', 'show-comments'),
      compose
    );
    producer.setup();
  } catch (e) {
    console.error(e);
  } finally {
    hideLoader();
  }
})();

/**
 * User Form
 */
const { user } = document.forms;
const userInfoForm = new UserInfoForm(user);

user.addEventListener(
  'submit',
  (e) => {
    e.preventDefault();
    userInfoForm.handleSubmit();
  },
  false
);
