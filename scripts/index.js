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

  let mistakeText;

  let countrySelect = userForm.elements.country;
  let countrySelectIndex = countrySelect.selectedIndex;
  if (countrySelectIndex === 0) {
    mistakeText = 'you dont choose contry';
    invalidMessage();
  } else if (countrySelectIndex === 3) {
    alert('Русский корабль иди .. you are blocked ');
  } else {
    console.log('cool,you choose country');
    validField();
  }

  let genderRadio = userForm.elements.gender;
  let genderRadioMaleChecked = genderRadio[0].checked;
  let genderRadioFemaleChecked = genderRadio[1].checked;
  let genderRadioValue;
  let infoUserGender = document.getElementById('userInfoGender');
  /* 
  if (genderRadioFemaleChecked || genderRadioMaleChecked) {
    console.log('yes');
  } else {
    console.log('no');
  } */
  if (genderRadioFemaleChecked === true) {
    console.log('female');
    validField();

    genderRadioValue = genderRadio[1].value;
    infoUserGender.textContent = `Name ${genderRadioValue}`;
  } else if (genderRadioMaleChecked === true) {
    validField();
    genderRadioValue = genderRadio[0].value;
    infoUserGender.textContent = `Name ${genderRadioValue}`;
  } else {
    mistakeText = 'Please choose gender';
    invalidMessage();
  }

  let userFormAgeValue = userForm.elements.age.value;

  if (typeof userFormAgeValue === 'string') {
    let convert = Number(userFormAgeValue);
    validField();
    let infoUserAge = document.getElementById('userInfoAge');
    infoUserAge.textContent = `Age ${userFormAgeValue}`;
  } else {
  /* else if (userFormAgeValue === ' ') {
    console.log('empty string for number');
   }*/
    mistakeText = 'please enter only number to age field';
    invalidMessage();
  }

  /* let nameText = userForm.elements.name;
  let nameTextValue = nameText.value;
  
  if (nameTextValue === 'string') {
    console.log('ви надрукували літери');
  } else {
    console.log('введіть літери');

    mistakeText = 'please enter only letter to name field';
    invalidMessage();
  } */
  function invalidMessage() {
    let formMistake = document.getElementById('formMistake');
    let mistakeDescription = document.createElement('p');
    mistakeDescription.setAttribute('class', 'form__mistake');
    formMistake.appendChild(mistakeDescription).textContent = mistakeText;
  }
  function validField() {
    let userInformation = document.getElementById('userInfo');
    /*     userForm.style.display = 'none';
    userInformation.style.display = 'block';
   */
  }
};
