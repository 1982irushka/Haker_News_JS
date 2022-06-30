/* eslint-disable */
import { formUser } from './modules/form.js';
import { News } from './modules/news.js';

News();
formUser();

const newsFetch = fetch(
  'https://hacker-news.firebaseio.com/v0/topstories.json?print=pretty'
);
newsFetch
  .then((response) => response.json())
  .then((ids) => {
    const newsIds = ids.slice(0, 5);
    const calls = newsIds.map((id) =>
      fetch(
        `https://hacker-news.firebaseio.com/v0/item/${id}.json?print=pretty`
      )
    );
    return Promise.all(calls);
  })
  .then((responses) => Promise.all(responses.map((rsp) => rsp.json())))
  .then((newsData) =>
    Promise.all([
      Promise.resolve(newsData),
      ...newsData.reduce(
        (acc, { kids }) => [
          ...acc,
          ...kids
            .slice(0, 4)
            .map((id) =>
              fetch(
                `https://hacker-news.firebaseio.com/v0/item/${id}.json?print=pretty`
              )
            ),
        ],
        []
      ),
    ])
  )
  .then(([news, ...commentsResponses]) =>
    Promise.all([
      Promise.resolve(news),
      ...commentsResponses.map((commentsRsp) => commentsRsp.json()),
    ])
  )
  .then(([news, ...comments]) => {
    const newsHtml = news.reduce((acc, newsObj) => {
      const {
        by,
        descendants,
        time,
        title: titleNews,
        score,
        url,
        kids,
      } = newsObj;
      const commentsHtml = comments
        .filter(({ id }) => kids.slice(0, 4).includes(id))
        .reduce((accom, commObj) => {
          const {
            by: byComm,
            text: textComm,
            time: timeComm,
            ...rest
          } = commObj;
          return `${accom}
      <li class="comments-list__item">
        <article class="comments">
          <p>
            <span>${byComm}</span>
            <span>${timeComm}</span>
          </p>
          <p class="comments__content">${textComm}</p>
          </article>
      </li>`;
        }, '');

      const { hostname } = new URL(url);

      return `${acc}
      <li class="generic-list__item">
        <article class="news">
          <div class="generic-list__title">
            <h2 class="generic-list__content">${titleNews}</h2>
            <a href="${url}">${hostname}</a>
                    </div>
          <p id="details">
            <span>${descendants}</span> points by
            <span>${by}</span>
            <span>${time}</span> | <!-- timestamp to readable date -->
            <button class="generic-list__show-comments">${score} comments</button>
          </p>
        </article>
  <ul id="comments-list" class="generic-list comments-list generic-list--hidden">${commentsHtml}</ul>
           </li>`;
    }, '');
    const newsList = document.getElementById('news-list');
    newsList.innerHTML = newsHtml;

    const commentsElRef = document.getElementsByClassName(
      'generic-list__show-comments'
    );

    for (let elem = 0; elem < commentsElRef.length; elem++) {
      commentsElRef[elem].addEventListener('click', (e) => {
        e.preventDefault();
        let elts = document.getElementsByClassName('comments-list');

        for (let e = 0; e < elts.length; e++) {
          var elt = elts[e];

          if (elt.classList.contains('generic-list--hidden')) {
            elt.classList.remove('generic-list--hidden');
          } else {
            elt.classList.add('generic-list--hidden');
          }
        }

        console.log(elem);
      });
    }
  });
