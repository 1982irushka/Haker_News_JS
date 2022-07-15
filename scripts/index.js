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
/* 
async function getNews() {
  const ids = await fetch(
    'https://hacker-news.firebaseio.com/v0/topstories.json?print=pretty'
  );
  const allNewsIds = await ids.json();
  console.log('ids', ids);
  console.log('allNewsIds', allNewsIds);

  const newsFiveIds = allNewsIds.slice(0, 5);
  console.log('newsFiveIds', newsFiveIds);
  const fivePromises = newsFiveIds.map((id) =>
    fetch(`https://hacker-news.firebaseio.com/v0/item/${id}.json?print=pretty`)
  );
  console.log('fivePromises', fivePromises);

  const newsFiveData = await fivePromises.map((response) => response.json());

  console.log('newsFiveData', newsFiveData);
  
}

getNews(); */

///////asynk await ver
/* 
inet ver
async function getNewsComments() {
  const ids = await (
    await fetch(
      'https://hacker-news.firebaseio.com/v0/topstories.json?print=pretty'
    )
  ).json();
  const newsIdsFour = ids.slice(0, 5);
  const newsDataFivePromises = //newsDataFour маси 5промісів
    newsIdsFour.map(
      async (id) =>
        await (
          await fetch(
            `https://hacker-news.firebaseio.com/v0/item/${id}.json?print=pretty`
          )
        ).json()
    );
  const pyatNovin = await Promise.all(newsDataFivePromises); // 5 новин
  console.log('pyatNovin', pyatNovin);

}
getNewsComments(); */
/////////////////////////////////////////////THEN ver

const newsAllPromise = fetch(
  'https://hacker-news.firebaseio.com/v0/topstories.json?print=pretty'
);
newsAllPromise
  .then((responses) => responses.json())
  .then((newsAllIds) => {
    const newsIdsFour = newsAllIds.slice(0, 4);
    const newsPromisesFour = newsIdsFour.map((id) =>
      fetch(
        `https://hacker-news.firebaseio.com/v0/item/${id}.json?print=pretty`
      )
    );
    return Promise.all(newsPromisesFour);
  })
  .then((responses) => {
    return Promise.all(responses.map((response) => response.json()));
  })
  .then((newsFourData) => {
    return Promise.all([
      Promise.resolve(newsFourData),
      ...newsFourData.reduce(
        (accomulator, { kids }) => [
          ...accomulator,
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
    ]);
  })
  .then(([newsFourData, ...commentsResp]) => {
    return Promise.all([
      Promise.resolve(newsFourData),
      ...commentsResp.map((responses) => responses.json()),
    ]);
  })
  .then(([newsFourData, ...comments]) => {
    const newsHtml = newsFourData.reduce((accom, newsOne) => {
      const {
        by,
        descendants,
        time,
        title: titleNews,
        score,
        url,
        kids,
      } = newsOne;

      const commentsHtml = comments
        .filter(({ id }) => kids.slice(0, 4).includes(id))
        .reduce(
          (acc, { id, text, time }) => ` ${acc} 
        <li class="generic-list__item">
           <article class="generic-list__content">
             <p class="generic-list__detail">
               <span>${by}</span>
               <span>${time}</span>
             </p>
             <p>${text}</p>
             </article>
         </li>`,
          ''
        );
      // const { hostname = null } = url ? new URL(url) : {};
      const newsUrl = url ? new URL(url) : {};
      //      якщо  url (змінна з деструкції newsOne) true то повертається url
      //а якщо ні то пустий об'єкт
      const { hostname = null } = newsUrl;

      //деструкція обєкта.якщлв обєкті newsUrl для проперті hostname значення немає
      // то виводиться null
      const heading = `<h2 class="generic-list__title">${titleNews}</h2>`;
      const headingWithLink = `<a href="${url}">${heading}</a>`;
      const source = url && hostname ? `<a href="${url}">${hostname}</a>` : '';
      // якщо url і hostname true тоді повертається <a> а якщо faulse тоді пустий рядок.
      return `${accom}
        <li class="generic-list__item">
          <article class="news">
            <div class="generic-list__news-header">
              <h2 class="generic-list__news-title">${
                hostname ? headingWithLink : heading
              }</h2>
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

////////////

let userForm = document.forms.user;

userForm.onsubmit = function (event) {
  event.preventDefault();

  const errors = new Map();

  let countrySelect = userForm.elements.country;

  let countrySelectValue = countrySelect.value;

  if (countrySelectValue === '') {
    errors.set('country', 'Please choose country');
  } else {
    let infoUserCountry = document.getElementById('userInfoCountry');
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
    infoUserGender.innerHTML = `<p>Gender</p><span class="user-info__value">${genderRadioValue}</span>`;

    if (errors.has('gender')) {
      errors.delete('gender');
    }
  } else if (genderRadioMaleChecked === true) {
    genderRadioValue = genderRadio[0].value;
    infoUserGender.innerHTML = `<p>Gender</p><span class="user-info__value">${genderRadioValue}</span>`;

    if (errors.has('gender')) {
      errors.delete('gender');
    }
  } else {
    errors.set('gender', 'Please choose gender');
  }

  let userFormAgeValue = userForm.elements.age.value;
  const isValidAge = getAgeValidity(Number(userFormAgeValue));
  if (isValidAge) {
    let infoUserAge = document.getElementById('userInfoAge');
    infoUserAge.innerHTML = `<p>Age</p><span class="user-info__value">${userFormAgeValue}</span>`;
    if (errors.has('age')) {
      errors.delete('age');
    }
  } else {
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
