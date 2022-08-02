import NewsFacade from './news-facade.js';
import Store from './store.js';
import APIService from './api-service.js';
import News from './news.js';
import compose from './compose.js';
import UserInfoForm from './user-info-form.js';

/**
 * News
 */
const HOST = 'https://hacker-news.firebaseio.com/v0';
const api = new APIService(HOST);
const store = new Store();
api
  .fetchOne(api.news)
  .then((ids) => {
    const urls = ids.slice(0, 5).map((id) => api.getItemUrl(id));
    return api.fetchAll(urls);
  })
  .then((data) => {
    store.set('news', data);
    const urls = data.reduce(
      (accumulator, { kids }) => [
        ...accumulator,
        ...(kids ?? []).slice(0, 4).map((id) => api.getItemUrl(id)),
      ],
      []
    );
    return api.fetchAll(urls);
  })
  .then((data) => {
    store.set('comments', data);
    document.getElementById('loader').style.display = 'none';

    const producer = new NewsFacade(
      store,
      new News('news-list', 'show-comments'),
      compose
    );
    producer.setup();
  })
  .catch((error) => {
    console.error(error);
  });

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
