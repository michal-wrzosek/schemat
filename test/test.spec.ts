import { expect } from 'chai';

import { createVadidator } from '../src/schemaValidator';

describe('test', () => {
  const schema = {
    a: (data: any) => (data === 'A' ? undefined : 'a should be A'),
    b: (data: any) => (data === 'B' ? undefined : 'b should be B'),
    c: createVadidator({
      cA: (data: any) => (data === 'CA' ? undefined : 'cA should be CA'),
      cB: (data: any) => (data === 'CB' ? undefined : 'cB should be CB'),
      likeCA: (data: any, siblingsData: any) =>
        siblingsData && siblingsData.cA === data ? undefined : 'likeCA should be equal to cA',
    }),
  };
  const validator = createVadidator(schema);

  it('returns undefined when no errors', () => {
    const errorMessages = validator({
      a: 'A',
      b: 'B',
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
      c: {
        cA: 'cA should be CA',
        likeCA: 'likeCA should be equal to cA',
      },
    });
  });

  it('allow to validate a combination of params', () => {
    const validator = createVadidator({
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
