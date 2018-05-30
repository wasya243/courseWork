const { JobTitle } = require('../../db/models');

const jobTitleListGET = async (req, res, next) => {
    try {
        const jobTitlesList = await JobTitle.findAll();
        res.send(jobTitlesList);
    } catch (error) {
        next(error);
    }
};

const jobTitleCreatePOST = async (req, res, next) => {
    try {
        const jobTitle = await JobTitle.create(req.body);
        res.send(jobTitle);
    } catch(error) {
        next(error);
    }
};

const jobTitleByIdGET = async (req, res, next) => {
    try {
        const { id } = req.params;
        const jobTitle = await JobTitle.findById(id);
        jobTitle ? res.send(jobTitle) : next();
    } catch (error) {
        next(error);
    }
};

const jobTitleUpdateById = async (req, res, next) => {
    try {
        const { id } = req.params;
        const [ affectedCount, affectedRows ]= await JobTitle.update(req.body, { where: { id } });
        if(affectedCount < 1) {
            return next();
        }
        const updatedJobTitle = await JobTitle.findById(id);
        res.send(updatedJobTitle);
    } catch (error) {
        next(error);
    }
};

const jobTitleByIdDelete = async (req, res, next) => {
    try {
        const { id } = req.params;
        const jobTitleToDelete = JobTitle.findById(id);
        if(!jobTitleToDelete) {
            return next();
        }
        await jobTitleToDelete.destroy();
        res.send(jobTitleToDelete);
    }
    catch(error) {
        next(error);
    }
};

module.exports = {
    jobTitleByIdDelete,
    jobTitleByIdGET,
    jobTitleListGET,
    jobTitleUpdateById,
    jobTitleCreatePOST,
};