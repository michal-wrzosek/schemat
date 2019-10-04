# schemat - simple runtime schema validator
![npm](https://img.shields.io/npm/v/schemat) [![Build Status](https://travis-ci.com/michal-wrzosek/schemat.svg?branch=master)](https://travis-ci.com/michal-wrzosek/schemat)

### How to install:

```
npm i schemat
```

### How to use

Validate objects with simple functions and receive error messages if any:

```typescript
import { createVadidator } from 'schemat';

const validator = createVadidator({
  a: (data: any) => (data === 'A' ? undefined : '"a" should be "A"'),
  likeA: (data: any, siblingsData: any) => siblingsData && siblingsData.a === data ? undefined : '"likeA" should be equal to param "a"',
  nested: createVadidator({
    c: (data: any) => (data === 'C' ? undefined : '"nested.c" should be "C"'),
  }),
});


// No errror messages here:
// errorMessages => undefined
const errorMessages = validator({
  a: 'A',
  likeA: 'A',
  nested: {
    c: 'C',
  },
});


// wrong b and nested.c params:
// errorMessages => {
//   b: '"likeA" should be equal to param "a"',
//   nested: {
//     c: '"nested.c" should be "C"',
//   },
// };
const errorMessages = validator({
  a: 'A',
  likeA: 'wrong!!!',
  nested: {
    c: 'wrong!!!',
  },
});
```

You can also pass an array of validators in your schema. Validator will run validators one by one and will stop and return first error, if any:

```typescript
import { createVadidator, ValidatorType } from 'schemat';

enum ERRORS {
  VALIDATION_ERROR_REQUIRED_FIELD = 'VALIDATION_ERROR_REQUIRED_FIELD',
  VALIDATION_ERROR_NOT_A_STRING = 'VALIDATION_ERROR_NOT_A_STRING',
  VALIDATION_ERROR_INVALID_EMAIL = 'VALIDATION_ERROR_INVALID_EMAIL',
}

const isRequiredValidator: ValidatorType = (data: any) =>
  typeof data === 'undefined' ? ERRORS.VALIDATION_ERROR_REQUIRED_FIELD : undefined;
const stringValidator: ValidatorType = (data: any) =>
  typeof data === 'undefined'
    ? undefined
    : typeof data !== 'string'
    ? ERRORS.VALIDATION_ERROR_NOT_A_STRING
    : undefined;
const emailValidator: ValidatorType = (data: any) =>
  typeof data === 'undefined'
    ? undefined
    : typeof data === 'string' && /^\S+@\S+$/.test(data)
    ? undefined
    : ERRORS.VALIDATION_ERROR_INVALID_EMAIL;

const validator = createVadidator({
  optionalEmail: emailValidator,
  requiredEmail: [isRequiredValidator, emailValidator],
  optionalString: stringValidator,
  requiredString: [isRequiredValidator, stringValidator],
});
```

---

This package was bootstrapped with [typescript-lib-boilerplate](https://github.com/michal-wrzosek/typescript-lib-boilerplate)
