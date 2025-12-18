const { createTokenForUser, validateToken } = require('../seirvise/autho');

describe('Auth service', () => {
  const user = { _id: '123', email: 'a@b.com', role: 'user' };

  test('createTokenForUser and validateToken - valid token', () => {
    const token = createTokenForUser(user);
    expect(typeof token).toBe('string');

    const payload = validateToken(token);
    expect(payload).toBeDefined();
    expect(payload.email).toBe(user.email);
    expect(payload.role).toBe(user.role);
    expect(payload._id).toBe(user._id);
  });

  test('validateToken - invalid token returns error object', () => {
    const res = validateToken('not-a-valid-token');
    expect(res).toBeDefined();
    expect(res.error).toBeTruthy();
  });
});
