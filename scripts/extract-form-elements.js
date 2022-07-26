const extractFormElements = (form) =>
  Array.from(form.elements).filter(({ type }) => type !== 'submit');
export default extractFormElements;
