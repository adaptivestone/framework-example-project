import { after, before } from 'node:test';

before(() => {
  console.log('Hi. This is a before all hook');
});

after(() => {
  console.log('Buy!. This is a after all hook');
});
