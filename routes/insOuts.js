const router = require('express').Router();
const insOuts = require('./handlers/insOuts');

router.get('/ins-outs', insOuts.inOutRecordListGET);

router.get('/ins-outs/:id', insOuts.inOutRecordByIdGET);

router.post('/ins-outs', insOuts.inOutRecordCreatePOST);

router.put('/ins-outs/:id', insOuts.inOutRecordUpdateById);

router.delete('/ins-outs/:id', insOuts.inOutRecordByIdDelete);

module.exports = router;