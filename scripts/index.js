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

function getAgeValidity(value) {
  const isNumber = !Number.isNaN(value) && typeof value === 'number';
  return isNumber && Number(value) > 0;
}

const newsFetch = fetch(
  'https://hacker-news.firebaseio.com/v0/topstories.json?print=pretty'
);

newsFetch // Promise
  .then((response) => {
    const promiseZDanimi = response.json();
    return promiseZDanimi;
  })
  .then((ids) => {
    const newsIds = ids.slice(0, 5); //повертає масив з перших 5 id
    const calls = newsIds.map(
      //з масиву newsIds*(перші 5 id) беруться значення id, кожен підставляється в посилання до якого застосовується fetch. Результат методу - масив з 5 промісів записані в змінну calls
      (id) =>
        fetch(
          `https://hacker-news.firebaseio.com/v0/item/${id}.json?print=pretty`
        )
    );
    return Promise.all(calls); //повертає masiv responsiv z виконнання 5 фетчів
  })
  .then((responses) => Promise.all(responses.map((rsp) => rsp.json())))
  .then((pyatNovin) => {
    const promiseZNovinami = Promise.resolve(pyatNovin);
    return Promise.all([
      promiseZNovinami,
      ...pyatNovin.reduce(
        //reduce метод що повертає з масиву одне значення де acc попереднє значення а kids поточне значення
        (acc, { kids }) => [
          ...acc,
          ...kids
            .slice(0, 4) //у кожного kids(поточне значення) метод slice вибирає 4 перші елементти і повертає масив елементів.
            .map(
              (
                idComment // map до кожного елементу масиву зі значенням ключа id застосовує фетч
              ) =>
                fetch(
                  `https://hacker-news.firebaseio.com/v0/item/${idComment}.json?print=pretty`
                )
            ),
        ],
        []
      ),
    ]);
  })
  .then(function (
    [news, ...commentsResponses] //commResp masyv obj response z masyvu promisiv
  ) {
    return Promise.all([
      //maryv promisiv
      Promise.resolve(news), //promis yakya resolvytsya masyvom novyn
      ...commentsResponses.map((commentsRsp) => commentsRsp.json()),
    ]);
  })
  .then(([news, ...comments]) => {
    //news це масив і comments це масив
    const newsHtml = news.reduce((acc, newsObj) => {
      // до масиву news застосвується метод reduce де асс попереднэ значення а newsObj поточне. Результат (одне значення) записано в змінну newsHtml
      const {
        //деструкція поточного значення newsObj(5 обєктів). результат 7 змінних зі значеннями
        by,
        descendants,
        time,
        title: titleNews,
        score,
        url,
        kids,
      } = newsObj;

      const commentsHtml = comments //масив comments.filter повертає масив з id
        .filter(({ id }) => kids.slice(0, 4).includes(id)) //kids.slice повертає масив з перших 4 елементів kids в яких є ключ id
        .reduce(
          (accom, { by, text, time }) => `
            ${accom}
            <li class="comments-list__item">
              <article class="comments">
                <p>
                  <span>${by}</span>
                  <span>${time}</span>
                </p>
                <p class="comments__content">${text}</p>
                </article>
            </li>
          `,
          ''
        );

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
//////////////////////////////////////////
let userForm = document.forms.user;

userForm.onsubmit = function (event) {
  event.preventDefault();

  const errors = new Map();

  //let mistakeText;

  let countrySelect = userForm.elements.country;

  let countrySelectValue = countrySelect.value;

  if (countrySelectValue === '') {
    //  mistakeText = 'Please choose country';
    errors.set('country', 'Please choose country');
  } else {
    let infoUserCountry = document.getElementById('userInfoCountry');
    //   infoUserCountry.textContent = `country ${countrySelectValue}`;
    infoUserCountry.innerHTML = `<p>Country</p><span class="user-info__value">${countrySelectValue}</span>`;

    if (errors.has('country')) {
      errors.delete('country');
    }
  }

  let genderRadio = userForm.elements.gender;
  let genderRadioMaleChecked = genderRadio[0].checked;
  let genderRadioFemaleChecked = genderRadio[1].checked;
  let genderRadioValue;
  let infoUserGender = document.getElementById('userInfoGender');

  if (genderRadioFemaleChecked === true) {
    genderRadioValue = genderRadio[1].value;
    //infoUserGender.textContent = `Gender ${genderRadioValue}`;
    infoUserGender.innerHTML = `<p>Gender</p><span class="user-info__value">${genderRadioValue}</span>`;

    if (errors.has('gender')) {
      errors.delete('gender');
    }
  } else if (genderRadioMaleChecked === true) {
    genderRadioValue = genderRadio[0].value;
    // infoUserGender.textContent = `Gender ${genderRadioValue}`;
    infoUserGender.innerHTML = `<p>Gender</p><span class="user-info__value">${genderRadioValue}</span>`;

    if (errors.has('gender')) {
      errors.delete('gender');
    }
  } else {
    //   mistakeText = 'Please choose gender';
    errors.set('gender', 'Please choose gender');
  }

  let userFormAgeValue = userForm.elements.age.value;
  const isValidAge = getAgeValidity(Number(userFormAgeValue));
  if (isValidAge) {
    let infoUserAge = document.getElementById('userInfoAge');
    //    infoUserAge.textContent = `Age ${userFormAgeValue}`;
    infoUserAge.innerHTML = `<p>Age</p><span class="user-info__value">${userFormAgeValue}</span>`;
    if (errors.has('age')) {
      errors.delete('age');
    }
  } else {
    //  mistakeText = 'please enter number to age field';
    errors.set('age', 'please enter number to age field');
  }

  let nameText = userForm.elements.name;
  let nameTextValue = nameText.value;
  const isValidName = nameTextValue && /^[a-z]+$/.test(nameTextValue);

  if (isValidName) {
    if (errors.has('name')) {
      errors.delete('name');
    }
    let infoUserName = document.getElementById('userInfoName');
    // infoUserName.textContent = `${nameTextValue}`;
    infoUserName.innerHTML = `<p>Name</p><span class="user-info__value">${nameTextValue}</span>`;
  } else {
    errors.set('name', 'Please fill name input');
  }

  invalidMessage(errors);
  if (errors.size === 0) {
    validField(errors);
  }

  function invalidMessage(mapOfErrors) {
    let formMistake = document.getElementById('formMistake');
    let errorMgs = '';
    mapOfErrors.forEach((value) => {
      errorMgs = `${errorMgs}<li class="form__mistake">${value}</li>`;
    });
    formMistake.innerHTML = errorMgs;
  }

  function validField() {
    let userInformation = document.getElementById('userInfo');
    userForm.style.display = 'none';
    userInformation.style.display = 'block';
  }
};
