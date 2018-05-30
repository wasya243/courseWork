const router = require('express').Router();
const department = require('./handlers/department');

router.get('/departments', department.departmentListGET);

router.get('/departments/:id', department.departmentByIdGET);

router.post('/departments', department.departmentCreatePOST);

router.put('/departments/:id', department.departmentUpdateById);

router.delete('/departments/:id', department.departmentByIdDelete);

router.get('/departments/:id/teams', department.teamListByDepartmentIdGet);

module.exports = router;