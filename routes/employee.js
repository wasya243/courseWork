const router = require('express').Router();
const employee = require('./handlers/employee');

router.get('/employees', employee.employeeListGET);

router.get('/employees/:id', employee.employeeByIdGET);

router.post('/employees', employee.employeeCreatePOST);

router.put('/employees/:id', employee.employeeUpdateById);

router.delete('/employees/:id', employee.employeeByIdDelete);

router.get('/employees/:id/in-out-records', employee.inOutRecordsByUserIdGET);

router.get('/employees/:id/daily-statistics', employee.employeeStatisticsByDayGET);

module.exports = router;