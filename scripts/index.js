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
    //ids масив чисел з усіма  id новир
    const newsIds = ids.slice(0, 5); //масив чисел, 5 перших id новин
    const calls = newsIds.map(
      //calls масив 5 промісів
      (id) =>
        fetch(
          `https://hacker-news.firebaseio.com/v0/item/${id}.json?print=pretty`
        )
    );
    return Promise.all(calls); //резолвить масив з 5 промісів
  })
  .then((responses) => Promise.all(responses.map((rsp) => rsp.json())))
  .then((pyatNovin) => {
    //pyatNovyn масив 5 обємктів
    const promiseZNovinami = Promise.resolve(pyatNovin);
    return Promise.all([
      promiseZNovinami,
      ...pyatNovin.reduce(
        //...pyatNovin деструкція обєкту 5 новин
        // метод reduce приймає аргументом1 функцію. аргумент2 пустий масив в перші ітерації
        (acc, { kids }) => [
          //{kids} деструкція обєкту з проперті kids
          ...acc, // згорнутий масиву аккамулятор
          ...kids // згорнутий масив коментарів, число
            .slice(0, 4) // відсікання перших чотирьох коментарів,число
            .map(
              (
                idComment // кожне число передається в фетч
              ) =>
                fetch(
                  `https://hacker-news.firebaseio.com/v0/item/${idComment}.json?print=pretty`
                )
            ),
        ],
        [] // другий аргумент метода reduce
      ),
    ]);
  })
  .then(function (
    [news, ...commentsResponses] //news масив 5 обєктів новив ...commentsResponses - згорнутий масив решти респонсів(коментарів)
  ) {
    return Promise.all([
      Promise.resolve(news), //resolve масиву з 5 обєтів новин (скорочений запис без фунціоналу)
      ...commentsResponses.map((commentsRsp) => commentsRsp.json()), // почергово з кожного елементу масиву респонсів отримується масив проміс
    ]);
  })
  .then(([news, ...comments]) => {
    //функція з параметром з масивів news(5 обєктів новин) і
    // і згорнутого масиву обєктів коментарів comments
    //тіло функції складається з reduce з першим аргументов функцією і другим аргументов пустий рядок

    const newsHtml = news.reduce((acc, newsObj) => {
      const {
        //деструкці обєкту новин newsObj.
        //в змінні записуються дані з відповідних проперті обєкта
        by,
        descendants,
        time,
        title: titleNews,
        score,
        url,
        kids,
      } = newsObj;

      const commentsHtml = comments //до масиву коментів comments метод filter
        //параметер функції {id} - деструкція обєкту коментаря по проперті id
        .filter(({ id }) => kids.slice(0, 4).includes(id)) // з масиву чисел вибирається перші чотири. і в них шукає чи є проперті id.формується новий масив коментарів
        .reduce(
          //до отриманаго масив коментарів reduce. перший аргумент функція. другий пустий рядок
          // // { by, text, time } деструкція обєкту комментаря по відповідним проперті
          // тіло функції - формуєтся html з підставлянням змінних в наслідок деструції
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
