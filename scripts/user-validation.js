export default class UserValidation {
  constructor(input) {
    this.invalidities = [];
    this.validityChecks = [];
    this.inputNode = input;
    this.registerListener = this.registerListener.bind(this);
    this.registerListener();
  }

  addInvalidity(message) {
    this.invalidities.push(message);
  }

  getInvalidities() {
    return this.invalidities.join('. \n');
  }

  checkValidity(input) {
    this.validityChecks.forEach((check) => {
      const isInvalid = check.isInvalid(input);
      const { invalidityMessage, element } = check;
      if (isInvalid) {
        this.addInvalidity(invalidityMessage);
      }
      if (!element) {
        return;
      }
      const add = isInvalid ? 'invalid' : 'valid';
      const remove = isInvalid ? 'valid' : 'invalid';
      element.classList.add(add);
      element.classList.remove(remove);
    });
  }

  checkInput() {
    this.inputNode.UserValidation.invalidities = [];
    this.checkValidity(this.inputNode);
    const isValid =
      this.inputNode.UserValidation.invalidities.length === 0 &&
      this.inputNode.value !== '';
    if (isValid) {
      this.inputNode.setCustomValidity('');
      return;
    }
    const message = this.inputNode.UserValidation.getInvalidities();
    this.inputNode.setCustomValidity(message);
  }

  registerListener() {
    const isSelectable = ['select-one', 'radio'].includes(this.inputNode.type);
    const event = isSelectable ? 'change' : 'keyup';
    this.inputNode.addEventListener(
      event,
      () => {
        this.checkInput();
      },
      false
    );
  }
}
