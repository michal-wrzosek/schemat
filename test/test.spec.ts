import { expect } from 'chai';

import { createValidator, ValidatorType } from '../src/schemaValidator';

describe('test', () => {
  const schema = {
    a: (data: any) => (data === 'A' ? undefined : 'a should be A'),
    b: (data: any) => (data === 'B' ? undefined : 'b should be B'),
    isRequiredAndIsAString: [
      (data: any) => (typeof data === 'undefined' ? 'is required error' : undefined),
      (data: any) => (typeof data !== 'string' ? 'not a string error' : undefined),
    ],
    c: createValidator({
      cA: (data: any) => (data === 'CA' ? undefined : 'cA should be CA'),
      cB: (data: any) => (data === 'CB' ? undefined : 'cB should be CB'),
      likeCA: (data: any, siblingsData: any) =>
        siblingsData && siblingsData.cA === data ? undefined : 'likeCA should be equal to cA',
    }),
  };
  const validator = createValidator(schema);

  it('returns undefined when no errors', () => {
    const errorMessages = validator({
      a: 'A',
      b: 'B',
      isRequiredAndIsAString: 'this is a string',
      c: {
        cA: 'CA',
        cB: 'CB',
        likeCA: 'CA',
      },
    });

    expect(errorMessages).to.be.equal(undefined);
  });

  it('returns object with errors when provided data is wrong', () => {
    const errorMessages = validator({
      a: 'wrong!!!',
      b: 'B',
      c: {
        cA: 'wrong!!!',
        cB: 'CB',
        likeCA: 'wrong!',
      },
    });

    expect(errorMessages).to.be.deep.equal({
      a: 'a should be A',
      isRequiredAndIsAString: 'is required error',
      c: {
        cA: 'cA should be CA',
        likeCA: 'likeCA should be equal to cA',
      },
    });
  });

  it('correctly validates array of validators', () => {
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

    const validator = createValidator({
      optionalEmail: emailValidator,
      requiredEmail: [isRequiredValidator, emailValidator],
      optionalString: stringValidator,
      requiredString: [isRequiredValidator, stringValidator],
    });

    expect(
      validator({
        requiredEmail: 'example@email.com',
        requiredString: 'some string',
      }),
    ).to.be.equal(undefined);

    expect(validator({})).to.be.deep.equal({
      requiredEmail: ERRORS.VALIDATION_ERROR_REQUIRED_FIELD,
      requiredString: ERRORS.VALIDATION_ERROR_REQUIRED_FIELD,
    });

    expect(
      validator({
        optionalEmail: 'wrong email',
        requiredEmail: 2,
        optionalString: 123,
        requiredString: 1234,
      }),
    ).to.be.deep.equal({
      optionalEmail: ERRORS.VALIDATION_ERROR_INVALID_EMAIL,
      requiredEmail: ERRORS.VALIDATION_ERROR_INVALID_EMAIL,
      optionalString: ERRORS.VALIDATION_ERROR_NOT_A_STRING,
      requiredString: ERRORS.VALIDATION_ERROR_NOT_A_STRING,
    });
  });

  it('allow to validate a combination of params', () => {
    const validator = createValidator({
      a: (data: any) => (typeof data === 'undefined' ? undefined : data === 'A' ? undefined : 'a should be A'),
      b: (data: any) => (typeof data === 'undefined' ? undefined : data === 'B' ? undefined : 'b should be B'),
      abCombination: (_, siblingsData) =>
        siblingsData && (typeof siblingsData.a !== 'undefined' || typeof siblingsData.b !== 'undefined')
          ? undefined
          : 'a or b should be defined',
    });

    expect(
      validator({
        a: 'A',
      }),
    ).to.be.equal(undefined);

    expect(validator({})).to.be.deep.equal({
      abCombination: 'a or b should be defined',
    });
  });
});
