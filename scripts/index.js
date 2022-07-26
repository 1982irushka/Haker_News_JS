import NewsFacade from './news-facade.js';
import Store from './store.js';
import APIService from './api-service.js';
import News from './news.js';
import UserValidation from './user-validation.js';
import ValidityChecks from './validity-checks.js';
import extractFormElements from './extract-form-elements.js';
import compose from './compose.js';

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
extractFormElements(user).forEach((el) => {
  el.UserValidation = new UserValidation(el);
  el.UserValidation.validityChecks = ValidityChecks.get(el.name);
});

user.addEventListener(
  'submit',
  (e) => {
    e.preventDefault();
    extractFormElements(e.target).forEach((el) =>
      el.UserValidation.checkInput()
    );
  },
  false
);
