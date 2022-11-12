export default new Map([
  [
    'name',
    [
      {
        isInvalid(input) {
          return input.value.length < 3;
        },
        invalidityMessage: 'This input needs to be at least 3 characters',
        element: document.querySelector(
          'input[name="name"] + .field__requirements li:nth-child( 1 )'
        ),
      },
      {
        isInvalid(input) {
          return !/^[a-z]+$/.test(input.value);
        },
        invalidityMessage: 'Only letters are allowed',
        element: document.querySelector(
          'input[name="name"] + .field__requirements li:nth-child( 2 )'
        ),
      },
    ],
  ],
  [
    'country',
    [
      {
        isInvalid(input) {
          return !['Ukraine', 'Poland', 'Canada', 'USA'].includes(input.value);
        },
        invalidityMessage: 'This select needs to be selected',
        element: document.querySelector(
          'select[name="country"] + .field__requirements li:nth-child( 1 )'
        ),
      },
    ],
  ],
  [
    'age',
    [
      {
        isInvalid(input) {
          return Number.isNaN(+input.value) || Number(input.value) === 0;
        },
        invalidityMessage: 'This input needs to have a number',
        element: document.querySelector(
          'input[name="age"] + .field__requirements li:nth-child( 1 )'
        ),
      },
    ],
  ],
  [
    'gender',
    [
      {
        isInvalid(input) {
          if (!input.checked) {
            return false;
          }
          return !['Male', 'Female'].includes(input.value);
        },
        invalidityMessage: 'This input is required',
        element: document.querySelector(
          '.field__radio-set + .field__requirements li:nth-child( 1 )'
        ),
      },
    ],
  ],
]);
