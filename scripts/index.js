import NewsFacade from './news-facade.js';
import Store from './store.js';
import APIService from './api-service.js';
import News from './news.js';

const HOST = 'https://hacker-news.firebaseio.com/v0';

const compose = (...fns) =>
  fns.reduce(
    (f, g) =>
      (...args) =>
        g(f(...args))
  );

const api = new APIService(HOST);
const store = new Store();

api
  .fetchOne(api.news)
  .then((ids) => {
    const urls = ids.slice(0, 5).map((id) => api.getItemUrl(id));
    return api.fetchAll(urls);
  })
  .then((data) => {
    store.set('news', data);
    const urls = data.reduce(
      (accumulator, { kids }) => [
        ...accumulator,
        ...(kids ?? []).slice(0, 4).map((id) => api.getItemUrl(id)),
      ],
      []
    );
    return api.fetchAll(urls);
  })
  .then((data) => {
    store.set('comments', data);
    const producer = new NewsFacade(
      store,
      new News('news-list', 'show-comments'),
      compose
    );
    producer.setup();
  })
  .catch((error) => {
    console.error(error);
  });

const getAgeValidity = (value) => {
  const isNumber = !Number.isNaN(value) && typeof value === 'number';
  return isNumber && Number(value) > 0;
};

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

  const infoUserGender = document.getElementById('userInfoGender');
  const genderRadioValue = userForm.elements.gender.value;
  const isValidGenderValue = ['Male', 'Female'].includes(genderRadioValue);
  if (isValidGenderValue) {
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
    const [infoErrors] = Array.from(
      document.getElementsByClassName('info-errors')
    );
    const formMistakeCreate = infoErrors ?? document.createElement('ul');
    formMistakeCreate.className = 'info-errors';
    const formTitle = document.getElementById('loginFormTitle');
    formTitle.after(formMistakeCreate);
    let errorMgs = '';
    mapOfErrors.forEach((value) => {
      errorMgs = `${errorMgs}<li class="info-errors__err">${value}</li>`;
    });
    formMistakeCreate.innerHTML = errorMgs;
  }

  function validField() {
    const userInformation = document.getElementById('userInfo');
    userForm.style.display = 'none';
    userInformation.style.display = 'flex';
  }

  invalidMessage(errors);
  if (errors.size === 0) {
    validField(errors);
  }
};
