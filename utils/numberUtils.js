/*
- commaSeparator 10000 => 10,000
- phone number validator
*/

const commaSeperator = number => {
  return number.toLocaleString('en-US');
};

const phoneNumberValidator = phone => {
  const regExp = /^1?\s?(\(\d{3}\)|\d{3})(\s|-)?\d{3}(\s|-)?\d{4}$/gm;
  return !!regExp.test(phone);
};

module.exports = { commaSeperator, phoneNumberValidator };
