function fallsWithinFirstPartOfWorkingTime (time, schedule) {
    return time < schedule.dailyBreakBeginning && time >= schedule.workDayBeginning;
}

function fallsWithinSecondPartOfWorkingTime(time, schedule) {
    return time > schedule.dailyBreakEnding && time <= schedule.workDayEnding;
}

function fallsWithinWorkingTime (time, schedule) {
    return fallsWithinFirstPartOfWorkingTime(time, schedule) || fallsWithinSecondPartOfWorkingTime(time, schedule);
}

function fallsWithinDailyBreakTime (time, schedule) {
    return time >= schedule.dailyBreakBeginning && time <= schedule.dailyBreakEnding;
}

function fallsWithinNotWorkingTime (time, schedule) {
    return !(fallsWithinWorkingTime(time, schedule) || fallsWithinDailyBreakTime(time, schedule));
}

function containsDailyBreak(start, end, schedule) {
    return start < schedule.dailyBreakBeginning && end > schedule.dailyBreakEnding;
}

function createRecord(start, end, type) {
    return { start, end, type };
}

function cutOutDailyBreak(start, end, schedule) {
    const absenceBeforeBreak = {
        start,
        end: schedule.dailyBreakBeginning,
    };
    const absenceAfterBreak = {
        start: schedule.dailyBreakEnding,
        end
    };
    return [absenceBeforeBreak, absenceAfterBreak];
}

function getEventNameByTime(time, schedule) {
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

function createReportEntriesByRange(start, end, schedule) {
    const firstEventName = getEventNameByTime(start, schedule);
    const secondEventName = getEventNameByTime(end, schedule);

    const reports = [];

    if(firstEventName === 'NotWorkingTime' && secondEventName === 'AtWork') {
        reports.push(createRecord(schedule.workDayBeginning, end, secondEventName));
    }

    else if (firstEventName === 'AtWork' && secondEventName === 'AtWork') {
        if (containsDailyBreak(start, end, schedule)) {
            reports.push(cutOutDailyBreak(start, end, schedule).map(item => { return { ...item, type: firstEventName } }));
        }
        const atWorkRecord = createRecord(start, end, firstEventName);
        reports.push(atWorkRecord);
    }

    else if (firstEventName === 'AtWork' && secondEventName === 'DailyBreak') {
        const atWorkRecord = createRecord(start, schedule.dailyBreakBeginning, firstEventName);
        reports.push(atWorkRecord);
    }

    else if (firstEventName === 'DailyBreak' && secondEventName === 'AtWork') {
        const atWorkRecord = createRecord(schedule.dailyBreakEnding, end, secondEventName);
        reports.push(atWorkRecord);
    }

    else if (firstEventName === 'NotWorkingTime' && secondEventName === 'AtWork') {
        const notWorkingTimeRecord = createRecord(start, schedule.workDayBeginning, firstEventName);
        const atWorkRecord = createRecord(schedule.workDayBeginning, end, secondEventName);
        reports.push(atWorkRecord, notWorkingTimeRecord);
    }

    else if (firstEventName === 'AtWork' && secondEventName === 'NotWorkingTime') {
        const notWorkingTimeRecord = createRecord(schedule.workDayEnding, end, secondEventName);
        const atWorkRecord = createRecord(start, schedule.workDayEnding, firstEventName);
        reports.push(atWorkRecord, notWorkingTimeRecord);
    }

    else if (firstEventName === 'NotWorkingTime' && secondEventName === 'NotWorkingTime') {
        const notWorkingTimeRecord = createRecord(start, end, firstEventName);
        reports.push(notWorkingTimeRecord);
    }

    else if (firstEventName === 'DailyBreak' && secondEventName === 'NotWorkingTime') {
        const atWorkRecord = createRecord(schedule.dailyBreakEnding, schedule.workDayEnding, 'AtWork');
        const notWorkingTimeRecord = createRecord(schedule.workDayEnding, end, secondEventName);
        reports.push(atWorkRecord);
        reports.push(notWorkingTimeRecord);
    }

    else if(firstEventName === 'NotWorkingTime' && secondEventName === 'DailyBreak') {
        const notWorkingTimeRecord = createRecord(start, schedule.dailyBreakBeginning, firstEventName);
        const atWorkRecord = createRecord(schedule.dailyBreakBeginning, schedule.dailyBreakBeginning, 'AtWork');
        reports.push(atWorkRecord);
        reports.push(notWorkingTimeRecord);
    }

    return reports;
}

function createReportEntryByEvent(event, schedule) {
    const eventName = getEventNameByTime(event.date);

    const reports = [];

    if(eventName === 'NotWorkingTime') {
        // I guess it is illegal to go the job after work time ending
        const notWorkingTimeRecord = createRecord(event.date, schedule.workDayBeginning, 'NotWorkingTime');
        reports.push(notWorkingTimeRecord);
    } else if(eventName === 'AtWork') {
        // check at what part of the day certain employee came to work
        const atWorkRecord = fallsWithinFirstPartOfWorkingTime(event.date, schedule)
            ? createRecord(event.date, schedule.workDayBeginning, 'AtWork')
            : createRecord(event.date, schedule.workDayEnding, 'AtWork');
        reports.push(atWorkRecord);
    } else {
        // daily break
        // ...
    }

    return reports;
}

function remapScheduleObject(databaseSchedule) {
    const remappedSchedule = {};

    remappedSchedule.workDayBeginning = databaseSchedule.start_work_hour;
    remappedSchedule.dailyBreakBeginning = databaseSchedule.start_break_hour;
    remappedSchedule.dailyBreakEnding = databaseSchedule.end_break_hour;
    remappedSchedule.workDayEnding = databaseSchedule.end_work_hour;

    return remappedSchedule;
}

module.exports = {
    createReportEntryByEvent,
    createReportEntriesByRange,
    remapScheduleObject,
};

// var fullPairs = insAndOuts.length / 2;
// var lastInRecord = insAndOuts.length % 2;
// var result = [];
// if(fullPairs < 1) {
//     // handle single in
//     result = result.concat(createReportEntryByEvent(insAndOuts[0], schedule));
// } else {
//     for(let i = 0; i < insAndOuts.length - 1; i+= 2) {
//         const inRecord = insAndOuts[i];
//         const outRecord =insAndOuts[i + 1];
//         result = result.concat(createReportEntriesByRange(inRecord.time, outRecord.time, schedule));
//     }
//     // plus handle single in (the last one);
//     if (lastInRecord !== 0) {
//         result = result.concat(createReportEntryByEvent(insAndOuts[insAndOuts.length - 1], schedule));
//     }
// }
