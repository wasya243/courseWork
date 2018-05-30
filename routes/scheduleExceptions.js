const router = require('express').Router();
const scheduleExceptions = require('./handlers/scheduleExceptions');

router.get('/schedule-exceptions', scheduleExceptions.scheduleExceptionsListGET);

router.get('/schedule-exceptions/:id', scheduleExceptions.scheduleExceptionsByIdGET);

router.post('/schedule-exceptions', scheduleExceptions.scheduleExceptionsCreatePOST);

router.put('/schedule-exceptions/:id', scheduleExceptions.scheduleExceptionsUpdateById);

router.delete('/schedule-exceptions/:id', scheduleExceptions.scheduleExceptionsByIdDelete);

module.exports = router;