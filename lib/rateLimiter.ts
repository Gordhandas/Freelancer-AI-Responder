
const REQUEST_LIMIT = 5; // 5 requests
const TIME_WINDOW_MS = 60 * 1000; // 1 minute
const STORAGE_KEY = 'api-request-timestamps';

const getTimestamps = (): number[] => {
    try {
        const stored = localStorage.getItem(STORAGE_KEY);
        return stored ? JSON.parse(stored) : [];
    } catch (e) {
        console.error('Failed to parse timestamps from localStorage', e);
        return [];
    }
};

const saveTimestamps = (timestamps: number[]) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(timestamps));
};

const filterOldTimestamps = (timestamps: number[]): number[] => {
    const now = Date.now();
    const windowStart = now - TIME_WINDOW_MS;
    return timestamps.filter(ts => ts > windowStart);
};

export const recordRequest = () => {
    const timestamps = getTimestamps();
    const now = Date.now();
    const updatedTimestamps = [...filterOldTimestamps(timestamps), now];
    saveTimestamps(updatedTimestamps);
};

export const checkRateLimit = (): { isLimited: boolean, timeUntilNextRequest: number } => {
    const timestamps = filterOldTimestamps(getTimestamps());
    
    if (timestamps.length >= REQUEST_LIMIT) {
        const oldestRequest = timestamps[0];
        const timeUntilNextRequest = (oldestRequest + TIME_WINDOW_MS) - Date.now();
        return { isLimited: true, timeUntilNextRequest };
    }

    return { isLimited: false, timeUntilNextRequest: 0 };
};
