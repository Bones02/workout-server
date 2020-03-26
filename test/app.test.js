const { expect } = require('chai');
const supertest = require('supertest');
const app = require('../src/app');

describe('endpoints', () => {
  it('should return status OK for GET /App/type/', () => {
    return supertest(app)
      .get('/App/type/')
      .expect(200);
  });
  it('should return status OK for GET /App/workout/', () => {
    return supertest(app)
      .get('/App/workout/')
      .expect(200);
  });
});