import { afterAll, beforeAll } from 'vitest';

beforeAll(() => {
  console.log('Hi. This is a before all hook');
});

afterAll(() => {
  console.log('Buy!. This is a after all hook');
});
