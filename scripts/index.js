import { formUser } from './modules/form.js';
import { News } from './modules/news.js';

News();
formUser();

const promiseYakiyBereIds = fetch(
  'https://hacker-news.firebaseio.com/v0/topstories.json?print=pretty'
);
promiseYakiyBereIds
  .then((response) => response.json())
  .then((ids) => {
    const pershiPyatIds = ids.slice(0, 5);
    const calls = pershiPyatIds.map((id) =>
      fetch(
        `https://hacker-news.firebaseio.com/v0/item/${id}.json?print=pretty`
      )
    );
    return Promise.all(calls);
  })
  .then((responses) => Promise.all(responses.map((rsp) => rsp.json())))
  .then((moiyObjkectiZNovinami) => {
    const newsHtml = moiyObjkectiZNovinami.reduce((acc, obj) => {
      const {
        by,
        descendants,
        time,
        title: titleNews,
        score,
        url,
        ...rest
      } = obj;

      return `${acc}
      <li class="news-list__ item">
        <article class="news">
          <div class="title">
            <h2 class="ttle__content">${titleNews}</h2>
            <a>${url}</a>
          </div>
          <p id="details">
            <span>${descendants}</span> points by
            <span>${by}</span> 
            <span>${time}</span> |
            <span>${score}</span> comments
          </p>
        </article>
      </li>`;
    }, '');
    const ol = document.getElementById('list');
    ol.innerHTML = newsHtml;
  });
