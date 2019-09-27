# schemat - simple runtime schema validator

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

---

This package was bootstrapped with [typescript-lib-boilerplate](https://github.com/michal-wrzosek/typescript-lib-boilerplate)
