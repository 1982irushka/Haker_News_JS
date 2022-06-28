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
  .then((newsData) => {
    const newsHtml = newsData.reduce((acc, newsObj) => {
      const {
        by,
        descendants,
        time,
        title: titleNews,
        score,
        url,
        // eslint-disable-next-line no-unused-vars
        ...rest
      } = newsObj;

      return `${acc}
      <li class="news-list__item">
        <article class="news">
          <div class="news-title">
            <h2 class="news-title__content">${titleNews}</h2>
            <a>${url}</a>
          </div>
          <p id="details">
            <span>${descendants}</span> points by
            <span>${by}</span> 
            <span>${time}</span> |
            <button id="news__show-comments" class="news__show-comments">${score} comments</button> 
          </p>
        </article>
        <ul id="comments-list" class="comments-list"></ul>  
           </li>`;
    }, '');
    const newsList = document.getElementById('news-list');
    newsList.innerHTML = newsHtml;
  });
/* 
const commentsFetch = fetch(
  'https://hacker-news.firebaseio.com/v0/askstories.json?print=pretty'
);
commentsFetch
  .then((response) => response.json())
  .then((commentsArr) => {
    const commentsId = commentsArr.slice(0, 3);
    console.log(commentsId);
    const mapresult = commentsId.map((id) =>
      fetch(
        `https://hacker-news.firebaseio.com/v0/item/${id}.json?print=pretty`
      )
    );
    return Promise.all(mapresult);
  })
  .then((responses) => Promise.all(responses.map((resp) => resp.json())))
  .then((comentsData) => {
    const commentsHtml = comentsData.reduce((accom, commObj) => {
      const { by: byComm, text: textComm, time: timeComm, ...rest } = commObj;
      console.log(rest);
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

  }); */

const ira = function fetchSend() {
  const commentsFetch = fetch(
    'https://hacker-news.firebaseio.com/v0/askstories.json?print=pretty'
  );
  commentsFetch
    .then((response) => response.json())
    .then((commentsArr) => {
      const commentsId = commentsArr.slice(0, 3);
      console.log(commentsId);
      const mapresult = commentsId.map((id) =>
        fetch(
          `https://hacker-news.firebaseio.com/v0/item/${id}.json?print=pretty`
        )
      );
      return Promise.all(mapresult);
    })
    .then((responses) => Promise.all(responses.map((resp) => resp.json())))
    .then((comentsData) => {
      const commentsHtml = comentsData.reduce((accom, commObj) => {
        const { by: byComm, text: textComm, time: timeComm, ...rest } = commObj;
        console.log(rest);
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

      const listComments = document.getElementById('comments-list');
      listComments.innerHTML = commentsHtml;
    });
};
const comments = document.getElementsByClassName('news__show-comments');
for (let elem = 0; elem < comments.length; elem++) {
  comments[elem].addEventListener('click', ira);
  //this.addEventListener('click', ira );
}
