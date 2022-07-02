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

      const { hostname = null } = Boolean(url) ? new URL(url) : {};
      const heading = `<h2 class="generic-list__content">${titleNews}</h2>`;
      const headingWithLink = `<a href="${url}">${heading}</a>`;
      const source = url && hostname ? `<a href="${url}">${hostname}</a>` : '';

      return `${acc}
      <li class="generic-list__item">
        <article class="news">
          <div class="generic-list__title">
            ${hostname ? headingWithLink : heading}
            ${source}
          </div>
          <p>
            <span>${descendants}</span> points by
            <span>${by}</span>
            <span>${time}</span> | <!-- timestamp to readable date -->
            <button class="generic-list__show-comments">${score} comments</button>
          </p>
        </article>
        <ul class="generic-list generic-list--hidden comments-list">${commentsHtml}</ul>
           </li>`;
    }, '');
    const newsList = document.getElementById('news-list');
    newsList.innerHTML = newsHtml;
    const commentsList = document.getElementsByClassName('comments-list');
    const commentsButtons = document.getElementsByClassName(
      'generic-list__show-comments'
    );
    commentsButtons.forEach((button) => {
      button.addEventListener('click', (_) => {
        hideCommentsLists(commentsList);
        const li = button.closest('.generic-list__item');
        const [ul] = Array.from(li.getElementsByClassName('comments-list'));
        debugger;
        ul.classList.remove('generic-list--hidden');
      });
    });
  });

function hideCommentsLists(list) {
  Array.from(list)
    .filter((item) => !item.classList.contains('generic-list--hidden'))
    .forEach((item) => item.classList.add('generic-list--hidden'));
}

let submit = document.getElementById('submitBtn');
/* submit.addEventListener('click', validAge); */
/*submit.addEventListener('click', validFile); not work */
/* submit.addEventListener('click', validRadio); */

// input type number (age) validate/*
function validAge() {
  let ageField = document.getElementById('ageField').value;
  console.log(ageField);
  if (ageField <= 100 && ageField >= 18) {
    console.log('умничка,правильний вік');
  } else {
    console.log('Please enter a number between 18 - 100 ');
  }
}

function validRadio() {
  var gender = document.getElementsByName('gender');
  if (gender[0].checked == true) {
    console.log('Ура, ви чоловік');
  } else if (gender[1].checked == true) {
    console.log('Ура, ви жінка');
  } else {
    console.log('виберіть стать');
    return false;
  }
  return true;
} /* NOT WORK

/* input type file ( upload image) NOT WORK

var fileTypes = ['.jpeg', '.svg', '.png', 'gif'];

function validFile(file) {
  for (var i = 0; i < fileTypes.length; i++) {
    if (file.type === fileTypes[i]) {
      return true;
    }
  }
  return false;
}
 */

// valid input type radio (male/female) Not Working
/* 
let radioMale = document.getElementById('genderMale').checked;
let radioFemale = document.getElementById('genderFemale').checked; */
/* function validRadio() {
  if (radioMale == '' && radioFemale == '') {
    alert('not select radio');
    return false;
  } else {
    alert(' you select radio');
    return true;
  }
} */
/* not working 
function validRadio() {
  if (radioMale == true) {
    alert('yes');
  } else if (radioFemale == true) {
    alert('yes');
  } else {
    alert('no');
  }
} */
