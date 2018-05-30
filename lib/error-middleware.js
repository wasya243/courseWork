const statuses = require('statuses');

module.exports = (error, req, res, next) =>{

    const err = error.response ? error.response.data : error;

    let status = err.status || err.statusCode || 500;
    if (status < 400) {
        status = 500;
    }

    const body = {status};

    if (status >= 500) {
        body.message = statuses[status];

        return res.status(status).json(body);
    }

    body.message = err.message;

    if (err.code) {
        body.code = err.code;
    }
    if (err.error) {
        body.error = err.error;
    }
    if (err.name) {
        body.name = err.name;
    }

    res.status(status).json(body);
};