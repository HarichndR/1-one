const morgan = require("morgan");
const winston = require("../seirvise/logger");

// Custom Morgan format
morgan.token("body", (req) => JSON.stringify(req.body));
morgan.token("query", (req) => JSON.stringify(req.query));
morgan.token("params", (req) => JSON.stringify(req.params));

const httpLogger = morgan(
    ':method :url :status :res[content-length] - :response-time ms - body::body - query::query - params::params',
    {
        stream: {
            write: (message) => winston.info(message.trim()),
        },
    }
);

module.exports = httpLogger;
