import { Response } from 'express';

// ✅ OK // ! check for integer between and including 0-10
const isValidInteger = (integer: number) => {
  return new Promise((resolve, reject) => {
    if (!isNaN(integer) || Math.floor(integer) === integer || integer >= 0 || integer <= 10) {
      resolve('Nice');
    } else {
      reject({ bad_data: ` You integer '${integer}' does not meet acceptable criteria` });
    }
  });
};

// ✅ OK
const isValidEmail = (email: string) => {
  const emailRegex =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

  // ! Return new promise
  return new Promise((resolve, reject) => {
    if (emailRegex.test(email)) {
      resolve('Nice');
    } else {
      reject({ bad_data: `email ${email} does not meet acceptable criteria` });
    }
  });

  // return emailRegex.test(email);
};

//
const areValidStrings = (strings: string[]) => {
  return new Promise((resolve, reject) => {
    if (strings.every((str) => str && typeof str === 'string' && str !== ' ')) {
      resolve('Nice');
    } else {
      reject({ bad_data: 'Your entry does not meet acceptable string criteria' });
    }
  });
};

// ✅ OK
const areBelowMaxLength = (res: Response, pairs: [string, number][]) => {
  if (!pairs.every((pair) => pair[0].length <= pair[1])) {
    res.status(400).json({ message: 'Invalid data' });
    return;
  }
};

export default {
  isValidInteger,
  isValidEmail,
  areValidStrings,
  areBelowMaxLength,
};
