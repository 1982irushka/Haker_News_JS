function getAgeValidity(value) {
  const isNumber = !Number.isNaN(value) && typeof value === 'number';
  return isNumber && Number(value) > 0;
}

const newsAllPromise = fetch(
  'https://hacker-news.firebaseio.com/v0/topstories.json?print=pretty'
);
newsAllPromise
  .then((responses) => responses.json())
  .then((newsAllIds) => {
    const newsIdsSlice = newsAllIds.slice(0, 5);
    const newsPromisesFive = newsIdsSlice.map((id) =>
      fetch(
        `https://hacker-news.firebaseio.com/v0/item/${id}.json?print=pretty`
      )
    );
    return Promise.all(newsPromisesFive);
  })
  .then((responses) =>
    Promise.all(responses.map((response) => response.json()))
  )
  .then((newsData) =>
    Promise.all([
      Promise.resolve(newsData),
      ...newsData.reduce(
        (accumulator, { kids }) => [
          ...accumulator,
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
  .then(([newsData, ...commentsResponses]) =>
    Promise.all([
      Promise.resolve(newsData),
      ...commentsResponses.map((responses) => responses.json()),
    ])
  )
  .then(([newsData, ...comments]) => {
    const newsHtml = newsData.reduce((accom, newsOne) => {
      const {
        by,
        descendants,
        time: newsTime,
        title: newsTitle,
        score,
        url,
        kids,
      } = newsOne;

      const commentsHtml = comments
        .filter(({ id }) => kids.slice(0, 4).includes(id))
        .reduce(
          (acc, { text, time }) => ` ${acc} 
        <li class="generic-list__item">
           <article class="comment">
             <p class="comment__info">
               <span>${by}</span>
               <span>${time}</span>
             </p>
             <div>${text}</div>
            </article>
         </li>`,
          ''
        );
      const newsUrl = url ? new URL(url) : {};
      const { hostname = null } = newsUrl;
      const heading = `<h2 class="generic-list__title">${newsTitle}</h2>`;
      const headingWithLink = `<a href="${url}">${heading}</a>`;
      const source = url && hostname ? `<a href="${url}">${hostname}</a>` : '';

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
              <span>${newsTime}</span> | <!-- timestamp to readable date -->
              <button class="generic-list__show-comments">${score} comments</button>
            </p>
          </article>
          <ul class="generic-list generic-list--hidden comments-list">${commentsHtml}</ul>
             </li>`;
    }, '');
    const newsList = document.getElementById('news-list');
    newsList.innerHTML = newsHtml;

    const commentsButtons = document.getElementsByClassName(
      'generic-list__show-comments'
    );
    Array.from(commentsButtons).forEach((button) => {
      button.addEventListener('click', () => {
        const li = button.closest('.generic-list__item');
        const [ul] = Array.from(li.getElementsByClassName('comments-list'));
        ul.classList.toggle('generic-list--hidden');
      });
    });
  });

// validation login form
const userForm = document.forms.user;

userForm.onsubmit = function validationForm(event) {
  event.preventDefault();

  const errors = new Map();

  const countrySelect = userForm.elements.country;

  const countrySelectValue = countrySelect.value;

  if (countrySelectValue === '') {
    errors.set('country', 'Please choose country');
  } else {
    const infoUserCountry = document.getElementById('userInfoCountry');
    infoUserCountry.innerHTML = `<p>Country</p><span class="user-info__value">${countrySelectValue}</span>`;
    if (errors.has('country')) {
      errors.delete('country');
    }
  }

  const genderRadio = userForm.elements.gender;
  const genderRadioMaleChecked = genderRadio[0].checked;
  const genderRadioFemaleChecked = genderRadio[1].checked;

  let genderRadioValue;
  const infoUserGender = document.getElementById('userInfoGender');

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

  const userFormAgeValue = userForm.elements.age.value;
  const isValidAge = getAgeValidity(Number(userFormAgeValue));
  if (isValidAge) {
    const infoUserAge = document.getElementById('userInfoAge');
    infoUserAge.innerHTML = `<p>Age</p><span class="user-info__value">${userFormAgeValue}</span>`;
    if (errors.has('age')) {
      errors.delete('age');
    }
  } else {
    errors.set('age', 'please enter number to age field');
  }

  const nameText = userForm.elements.name;
  const nameTextValue = nameText.value;
  const isValidName = nameTextValue && /^[a-z]+$/.test(nameTextValue);

  if (isValidName) {
    if (errors.has('name')) {
      errors.delete('name');
    }
    const infoUserName = document.getElementById('userInfoName');
    infoUserName.innerHTML = `<p>Name</p><span class="user-info__value">${nameTextValue}</span>`;
  } else {
    errors.set('name', 'Please fill name input');
  }

  function invalidMessage(mapOfErrors) {
    const formMistake = document.getElementById('formMistake');
    let errorMgs = '';
    mapOfErrors.forEach((value) => {
      errorMgs = `${errorMgs}<li class="form__mistake">${value}</li>`;
    });
    formMistake.innerHTML = errorMgs;
  }

  function validField() {
    const userInformation = document.getElementById('userInfo');
    userForm.style.display = 'none';
    userInformation.style.display = 'block';
  }

  invalidMessage(errors);
  if (errors.size === 0) {
    validField(errors);
  }
};
