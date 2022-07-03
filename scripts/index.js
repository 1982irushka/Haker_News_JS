/* eslint-disable */
import { formUser } from './modules/form.js';
import { News } from './modules/news.js';

News();
formUser();

function hideCommentsLists(list) {
  Array.from(list)
    .filter((item) => !item.classList.contains('generic-list--hidden'))
    .forEach((item) => item.classList.add('generic-list--hidden'));
}

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
          const { by: byComm, text: textComm, time: timeComm } = commObj;
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

      const { hostname = null } = url ? new URL(url) : {};
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
    Array.from(commentsButtons).forEach((button) => {
      button.addEventListener('click', () => {
        hideCommentsLists(commentsList);
        const li = button.closest('.generic-list__item');
        const [ul] = Array.from(li.getElementsByClassName('comments-list'));
        ul.classList.remove('generic-list--hidden');
      });
    });
  });

let userForm = document.forms.user;

userForm.onsubmit = function (event) {
  event.preventDefault();
  let countrySelect = userForm.elements.country;
  let countrySelectIndex = countrySelect.selectedIndex;

  if (countrySelectIndex === 0) {
    console.log('you dont choouse country');
  } else if (countrySelectIndex === 3) {
    alert('Русский корабль иди.. you are blocked ');
  } else {
    console.log('cool,you choose country');
  }

  let genderRadio = userForm.elements.gender;
  let genderRadioMaleChecked = genderRadio[0].checked;
  let genderRadioFemaleChecked = genderRadio[1].checked;

  if (genderRadioFemaleChecked === true) {
    console.log('female');
  } else if (genderRadioMaleChecked === true) {
    console.log('male');
  } else {
    console.log('you dont choose gender');
  }

  let userFormAgeValue = userForm.elements.age.value;
  /* console.log(typeof userFormAgeValue); */
  if (typeof userFormAgeValue === 'number') {
    console.log('nice age!');
  } else {
    console.log('please enter age');
  }
};
