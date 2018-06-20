// const records = [{ time: 7 , type: 'In' }, { time: 7.55 , type: 'Out' }, { time: 8.15 , type: 'In' }, { time: 13.10 , type: 'Out' }, { time: 13.55 , type: 'In' }, { time: 14.55 , type: 'Out' }, { time: 16.10 , type: 'In' },{ time: 17.10 , type: 'Out' }];
//
// const schedule = {
//     workDayBeginning: 8,
//     dailyBreakBeginning: 13,
//     dailyBreakEnding: 14,
//     workDayEnding: 18
// };

function getAverageDate(date1, date2) {
    let date1_ms = date1.getTime();
    const date2_ms = date2.getTime();

    const difference = (date2_ms - date1_ms) / 2;

    date1_ms += difference;

    return new Date(date1_ms);
}

function getControlPoints(inRecord, outRecord, workSchedule) {
    let controlPoints = Object.keys(workSchedule).map(prop => workSchedule[prop]);

    controlPoints = controlPoints.concat([inRecord.date, outRecord.date]);
    controlPoints.sort((a, b) => a - b);

    const start = controlPoints.indexOf(inRecord.date);
    const end = controlPoints.indexOf(outRecord.date);

    return controlPoints.slice(start, end + 1);
}

function getControlPointsBySingleRecord(record, workSchedule, isFirst) {
    let controlPoints = Object.keys(workSchedule).map(prop => workSchedule[prop]);

    controlPoints = controlPoints.concat([record.date]);
    controlPoints.sort((a, b) => a - b);

    const start = isFirst ? 0 : controlPoints.indexOf(record.date);
    const end = isFirst ? controlPoints.indexOf(record.date) + 1 : controlPoints.length;

    return controlPoints.slice(start, end);
}

function getRangeNameByTime(time, schedule) {
    let eventName;
    if (fallsWithinWorkingTime(time, schedule)) {
        eventName = 'AtWork';
    } else if (fallsWithinDailyBreakTime(time, schedule)) {
        eventName = 'DailyBreak';
    } else if (fallsWithinNotWorkingTime(time, schedule)) {
        eventName = 'NotWorkingTime';
    }

    return eventName;
}

function fallsWithinFirstPartOfWorkingTime(time, schedule) {
    return time < schedule.dailyBreakBeginning && time >= schedule.workDayBeginning;
}

function fallsWithinSecondPartOfWorkingTime(time, schedule) {
    return time > schedule.dailyBreakEnding && time <= schedule.workDayEnding;
}

function fallsWithinWorkingTime(time, schedule) {
    return fallsWithinFirstPartOfWorkingTime(time, schedule) || fallsWithinSecondPartOfWorkingTime(time, schedule);

}

function fallsWithinDailyBreakTime(time, schedule) {
    return time >= schedule.dailyBreakBeginning && time <= schedule.dailyBreakEnding;
}

function fallsWithinNotWorkingTime(time, schedule) {
    return !((fallsWithinWorkingTime(time, schedule) || fallsWithinDailyBreakTime(time, schedule)));
}

function createRecord(start, end, type) {
    return { start, end, type };
}

function getReportByMultipleRecords(records, getControlPointsFunc, getRangeNameByTimeFunc, createRecordFunc, schedule) {
    let currentControlPoints = [];
    let notAbsenceRanges = [];
    let absenceRanges = [];

    for(let i = 0; i < records.length - records.length % 2 - 1; i+=2) {
        currentControlPoints = getControlPointsFunc(records[i], records[i + 1], schedule);
        for(let j = 0; j < currentControlPoints.length - 1; j++) {
            const currentPoint = currentControlPoints[j];
            const nextPoint = currentControlPoints[j + 1];
            const eventName = getRangeNameByTimeFunc(getAverageDate(currentPoint, nextPoint), schedule);
            if(eventName === 'DailyBreak') {
                notAbsenceRanges.push(createRecordFunc(schedule.dailyBreakBeginning, schedule.dailyBreakEnding, eventName));
            }
            notAbsenceRanges.push(createRecordFunc(currentPoint, nextPoint, eventName));
        }
    }

    // a little bit of magic
    absenceRanges = absenceRanges.concat(getReportBySingleRecord(records[0], getControlPointsBySingleRecord,  getRangeNameByTime, createRecord, schedule, true));
    absenceRanges = absenceRanges.concat(getReportBySingleRecord(records[records.length - 1], getControlPointsBySingleRecord,  getRangeNameByTime, createRecord, schedule, false));

    let length = records.length % 2 === 1 ? records.length : records.length - 1;

    for(let i = 1; i < length; i+=2) {
        currentControlPoints = getControlPointsFunc(records[i], records[i + 1], schedule);
        for(let j = 0; j < currentControlPoints.length - 1; j++) {
            const currentPoint = currentControlPoints[j];
            const nextPoint = currentControlPoints[j + 1];
            if(getRangeNameByTimeFunc(getAverageDate(currentPoint, nextPoint), schedule) === 'AtWork') {
                absenceRanges.push(createRecordFunc(currentPoint, nextPoint, 'Absence'));
            }

        }
    }

    return {
        absenceRanges,
        notAbsenceRanges
    }
}

function getReportBySingleRecord(record, getControlPointsBySingleRecordFunc, getRangeNameByTimeFunc, createRecordFunc, schedule, isFirst) {
    let ranges = [];
    const currentControlPoints = getControlPointsBySingleRecordFunc(record, schedule, isFirst);

    for(let i = 0; i < currentControlPoints.length - 1; i++) {
        const currentPoint = currentControlPoints[i];
        const nextPoint = currentControlPoints[i + 1];
        const eventName = getRangeNameByTimeFunc(getAverageDate(currentPoint, nextPoint), schedule);
        if(eventName === 'AtWork') {
            ranges.push(createRecordFunc(currentPoint, nextPoint, 'Absence'));
        } else {
            ranges.push(createRecordFunc(currentPoint, nextPoint, eventName));
        }
    }

    return ranges;
}

// a little bit of magic
function processReports(notAbscenceRanges = [], createRecordFunc, type, schedule) {
    const result = notAbscenceRanges.filter(item => item.type !== type);
    result.push(createRecordFunc(schedule.dailyBreakBeginning, schedule.dailyBreakEnding, type));

    return result;
}
// if(records.length === 1) {
//     getReportBySingleRecord(records[0], getControlPointsBySingleRecord, getRangeNameByTime, createRecord, schedule);
// } else {
//     // a little bit of magic
//     let result = getReportByMultipleRecords(records, getControlPoints, getRangeNameByTime, createRecord, schedule);
//     result.notAbscenceRanges = processReports(result.notAbscenceRanges,  createRecord, 'DailyBreak', schedule);
//     console.log(result);
// }

function remapScheduleObject(databaseSchedule) {
    const remappedSchedule = {};

    remappedSchedule.workDayBeginning = databaseSchedule.start_work_hour;
    remappedSchedule.dailyBreakBeginning = databaseSchedule.start_break_hour;
    remappedSchedule.dailyBreakEnding = databaseSchedule.end_break_hour;
    remappedSchedule.workDayEnding = databaseSchedule.end_work_hour;

    return remappedSchedule;
}


module.exports = {
    getReportBySingleRecord,
    getReportByMultipleRecords,
    processReports,
    createRecord,
    getRangeNameByTime,
    getControlPoints,
    getControlPointsBySingleRecord,
    remapScheduleObject,
};