const { InsOuts } = require('../../db/models');

const inOutRecordListGET = async (req, res, next) => {
    try {
        const insOutsList = await InsOuts.findAll();
        res.send(insOutsList);
    } catch (error) {
        next(error);
    }
};

const inOutRecordCreatePOST = async (req, res, next) => {
    try {
        const inOutRecord = await InsOuts.create(req.body);
        res.send(inOutRecord);
    } catch(error) {
        next(error);
    }
};

const inOutRecordByIdGET = async (req, res, next) => {
    try {
        const { id } = req.params;
        const inOutRecord = await InsOuts.findById(id);
        inOutRecord ? res.send(inOutRecord) : next();
    } catch (error) {
        next(error);
    }
};

const inOutRecordUpdateById = async (req, res, next) => {
    try {
        const { id } = req.params;
        const [ affectedCount, affectedRows ]= await InsOuts.update(req.body, { where: { id } });
        if(affectedCount < 1) {
            return next();
        }
        const updatedInOutRecord = await InsOuts.findById(id);
        res.send(updatedInOutRecord);
    } catch (error) {
        next(error);
    }
};

const inOutRecordByIdDelete = async (req, res, next) => {
    try {
        const { id } = req.params;
        const inOutRecordToDelete = await InsOuts.findById(id);
        if(!inOutRecordToDelete) {
            return next();
        }
        await inOutRecordToDelete.destroy();
        res.send(inOutRecordToDelete);
    }
    catch(error) {
        next(error);
    }
};

module.exports = {
    inOutRecordByIdDelete,
    inOutRecordByIdGET,
    inOutRecordListGET,
    inOutRecordUpdateById,
    inOutRecordCreatePOST,
};