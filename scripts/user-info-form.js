/* eslint-disable class-methods-use-this */
import UserValidation from './user-validation.js';
import ValidityChecks from './validity-checks.js';

class UserInfoForm {
  #setValidation() {
    this.elements.forEach((el) => {
      el.UserValidation = new UserValidation(el);
      el.UserValidation.validityChecks = ValidityChecks.get(el.name);
    });
  }

  #hideSecondaryElements() {
    const requirements = document.getElementsByClassName('field__requirements');
    const radioLabels = document.getElementsByClassName('field__label--radio');
    const submit = document.getElementById('submitBtn');
    [...Array.from(requirements), ...Array.from(radioLabels), submit].forEach(
      (el) => {
        el.hidden = true;
      }
    );
  }

  #replaceWithValue(el) {
    const isRadio = el.type === 'radio';
    const valueEl = document.createElement('div');
    valueEl.style.fontSize = '14px';
    valueEl.textContent = isRadio && !el.checked ? '' : el.value;
    el.replaceWith(valueEl);
  }

  constructor(form) {
    this.form = form;
    this.#setValidation();
  }

  get elements() {
    return Array.from(this.form.elements).filter(
      ({ type }) => type !== 'submit'
    );
  }

  handleSubmit() {
    this.elements.forEach((el) => el.UserValidation.checkInput());
    const allValid = this.elements.every(({ validity: { valid } }) => valid);
    if (!allValid) {
      return;
    }
    this.#hideSecondaryElements();
    this.elements.forEach(this.#replaceWithValue);
  }
}

export default UserInfoForm;
