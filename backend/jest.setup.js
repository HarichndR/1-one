// Basic Jest setup for backend tests
process.env.JWT_SECRET = process.env.JWT_SECRET || 'test_jwt_secret';

const fs = require('fs');
const path = require('path');

// Ensure scratch directory exists for node-localstorage
const scratchDir = path.resolve(__dirname, 'scratch');
if (!fs.existsSync(scratchDir)) {
  fs.mkdirSync(scratchDir, { recursive: true });
}

// Cleanup function to run after tests (will be used by tests themselves if needed)
global.__CLEAN_SCRATCH = () => {
  try {
    const files = fs.readdirSync(scratchDir || '.');
    for (const f of files) {
      const p = path.join(scratchDir, f);
      fs.unlinkSync(p);
    }
  } catch (e) {
    // ignore
  }
};
