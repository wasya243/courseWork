const { ScheduleExceptions } = require('../../db/models');

const scheduleExceptionsListGET = async (req, res, next) => {
    try {
        const scheduleExceptionsList = await ScheduleExceptions.findAll();
        res.send(scheduleExceptionsList);
    } catch (error) {
        next(error);
    }
};

const scheduleExceptionsCreatePOST = async (req, res, next) => {
    try {
        const scheduleExceptions = await ScheduleExceptions.create(req.body);
        res.send(scheduleExceptions);
    } catch(error) {
        next(error);
    }
};

const scheduleExceptionsByIdGET = async (req, res, next) => {
    try {
        const { id } = req.params;
        const scheduleExceptions = await ScheduleExceptions.findById(id);
        scheduleExceptions ? res.send(scheduleExceptions) : next();
    } catch (error) {
        next(error);
    }
};

const scheduleExceptionsUpdateById = async (req, res, next) => {
    try {
        const { id } = req.params;
        const scheduleExceptionsToUpdate = ScheduleExceptions.findById(id);
        if (!scheduleExceptionsToUpdate) {
            return next();
        }
        await scheduleExceptionsToUpdate.update(req.body);
        res.send(scheduleExceptionsToUpdate);
    } catch (error) {
        next(error);
    }
};

const scheduleExceptionsByIdDelete = async (req, res, next) => {
    try {
        const { id } = req.params;
        const [ affectedCount, affectedRows ]= await ScheduleExceptions.update(req.body, { where: { id } });
        if(affectedCount < 1) {
            return next();
        }
        const updatedScheduleExceptions = await ScheduleExceptions.findById(id);
        res.send(updatedScheduleExceptions);
    } catch (error) {
        next(error);
    }
};

module.exports = {
    scheduleExceptionsByIdDelete,
    scheduleExceptionsByIdGET,
    scheduleExceptionsListGET,
    scheduleExceptionsUpdateById,
    scheduleExceptionsCreatePOST,
};
