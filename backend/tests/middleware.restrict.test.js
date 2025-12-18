const path = require('path');
const { LocalStorage } = require('node-localstorage');

process.env.JWT_SECRET = process.env.JWT_SECRET || 'test_jwt_secret';
const { createTokenForUser } = require('../seirvise/autho');
const { checkRole } = require('../midelwear/restrict');

const scratchPath = path.resolve(__dirname, '..', 'scratch');
const localStorage = new LocalStorage(scratchPath);

describe('checkRole middleware', () => {
  beforeEach(() => {
    global.__CLEAN_SCRATCH();
  });
  afterEach(() => {
    global.__CLEAN_SCRATCH();
  });

  test('returns 401 when no token', () => {
    const mw = checkRole(['admin']);
    const req = {};
    const res = { status: jest.fn().mockReturnThis(), send: jest.fn() };
    const next = jest.fn();

    mw(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.send).toHaveBeenCalledWith('Unauthorized: No token provided');
    expect(next).not.toHaveBeenCalled();
  });

  test('calls next when role allowed', () => {
    const token = createTokenForUser({ _id: '1', email: 'a@b.com', role: 'admin' });
    localStorage.setItem('token', token);

    const mw = checkRole(['admin']);
    const req = {};
    const res = {};
    const next = jest.fn();

    mw(req, res, next);

    expect(next).toHaveBeenCalled();
  });

  test('returns 403 when role not allowed', () => {
    const token = createTokenForUser({ _id: '1', email: 'a@b.com', role: 'user' });
    localStorage.setItem('token', token);

    const mw = checkRole(['admin']);
    const req = {};
    const res = { status: jest.fn().mockReturnThis(), send: jest.fn() };
    const next = jest.fn();

    mw(req, res, next);

    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.send).toHaveBeenCalledWith('Forbidden: Insufficient role');
    expect(next).not.toHaveBeenCalled();
  });
});
