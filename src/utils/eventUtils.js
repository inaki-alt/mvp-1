export function formatEventDate(date) {
    if (!date) {
        return new Date().toISOString().split('T')[0];
    }

    const dateObj = typeof date === 'number' 
        ? new Date(date) 
        : new Date(date);

    return dateObj.toISOString().split('T')[0];
}

export function formatTimeString(date) {
    if (!date) {
        return '00:00';
    }

    const dateObj = typeof date === 'number' 
        ? new Date(date) 
        : new Date(date);

    return dateObj.toTimeString().substr(0, 5);
}

export function parseDateTime(date) {
    if (!date) {
        return new Date();
    }

    const dateObj = typeof date === 'number' 
        ? new Date(date) 
        : new Date(date);

    return dateObj;
}

export function processEventData(eventData) {
    if (!eventData) {
        return null;
    }

    const oneHourInMs = 3600000;
    const currentTime = Date.now();
    const defaultEndTime = eventData.start_time 
        ? eventData.start_time + oneHourInMs 
        : currentTime + oneHourInMs;

    const event = {
        ...eventData,
        event_name: eventData.event_name || eventData.title || '',
        start_time: eventData.start_time || currentTime,
        end_time: eventData.end_time || defaultEndTime
    };

    return {
        dateKey: formatEventDate(event.start_time),
        index: 0,
        event
    };
}