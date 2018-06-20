const router = require('express').Router();
const personalSchedules = require('./handlers/personalSchedules');

router.get('/personal-schedules', personalSchedules.personalScheduleListGET);

router.get('/personal-schedules/:id', personalSchedules.personalScheduleByIdGET);

router.post('/personal-schedules', personalSchedules.personalScheduleCreatePOST);

router.put('/personal-schedules/:id', personalSchedules.personalScheduleUpdateById);

router.delete('/personal-schedules/:id', personalSchedules.personalScheduleDelete);

module.exports = router;