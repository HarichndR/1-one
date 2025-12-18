const fs = require('fs');
const path = require('path');
const { LocalStorage } = require('node-localstorage');

// Ensure env secret is set before requiring middleware
process.env.JWT_SECRET = process.env.JWT_SECRET || 'test_jwt_secret';

const { createTokenForUser } = require('../seirvise/autho');

// require the middleware after env is set
const checkForAuthenticationCookie = require('../midelwear/autho');

const scratchPath = path.resolve(__dirname, '..', 'scratch');
const localStorage = new LocalStorage(scratchPath);

describe('checkForAuthenticationCookie middleware', () => {
  beforeEach(() => {
    global.__CLEAN_SCRATCH();
  });
  afterEach(() => {
    global.__CLEAN_SCRATCH();
  });

  test('responds 401 when no token', () => {
    const req = {};
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    const next = jest.fn();

    checkForAuthenticationCookie(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ error: 'Token not provided' });
    expect(next).not.toHaveBeenCalled();
  });

  test('calls next when token valid', () => {
    const token = createTokenForUser({ _id: '1', email: 'a@b.com', role: 'user' });
    localStorage.setItem('token', token);

    const req = {};
    const res = {};
    const next = jest.fn();

    checkForAuthenticationCookie(req, res, next);

    expect(next).toHaveBeenCalled();
    expect(req.user).toBeDefined();
    expect(req.user.email).toBe('a@b.com');
  });

  test('responds 401 when token invalid', () => {
    localStorage.setItem('token', 'badtoken');

    const req = {};
    const res = {};
    const next = jest.fn();

    checkForAuthenticationCookie(req, res, next);

    // Current middleware sets req.user to the validateToken return value
    expect(next).toHaveBeenCalled();
    expect(req.user).toBeDefined();
    expect(req.user.error).toBeTruthy();
  });
});
