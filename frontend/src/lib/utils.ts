import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

interface DurationObject {
  duration: string;
}

export const LANDING_CALENDLY_URL =
  'https://calendly.com/ujjwalroy/unreal-ai-business-development-engine-2-0?month=2024-01';
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatTimestampToDayTime(timestamp: string): string {
  const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const date = new Date(timestamp);

  const dayOfWeek = daysOfWeek[date.getDay()];
  let hours = date.getHours();
  const minutes = date.getMinutes();
  const amOrPm = hours >= 12 ? 'pm' : 'am';

  if (hours > 12) {
    hours -= 12;
  } else if (hours === 0) {
    hours = 12;
  }

  return `${dayOfWeek} ${hours}:${minutes < 10 ? '0' : ''}${minutes}${amOrPm}`;
}

export function calculateAverageDuration(durations: DurationObject[]): string {
  let totalMilliseconds = 0;

  for (const durationObject of durations) {
    const [secondsStr, millisecondsStr] = durationObject.duration.split('.');
    const seconds = parseInt(secondsStr, 10);
    const milliseconds = parseInt(millisecondsStr || '0', 10);
    totalMilliseconds += seconds * 1000 + milliseconds;
  }

  const averageMilliseconds = totalMilliseconds / durations.length;
  const averageSeconds = averageMilliseconds / 1000;
  const averageMinutes = Math.floor(averageSeconds / 60);
  const remainingSeconds = Math.floor(averageSeconds % 60);

  if (averageMinutes > 0) {
    return `${averageMinutes} min ${remainingSeconds} sec`;
  } else {
    return `${remainingSeconds} sec`;
  }
}
export function formatDuration(duration: string): string {
  const [secondsStr, millisecondsStr] = duration.split('.');
  const seconds = parseInt(secondsStr, 10);
  const milliseconds = parseInt(millisecondsStr || '0', 10);

  const totalSeconds = seconds + milliseconds / 1000;
  const totalMinutes = Math.floor(totalSeconds / 60);
  const remainingSeconds = Math.floor(totalSeconds % 60);

  if (totalMinutes > 0) {
    return `${totalMinutes} min ${remainingSeconds} sec`;
  } else {
    return `${remainingSeconds} sec`;
  }
}

export function convertDateStringToFormattedDate(dateString: string): string | null {
  const dateObj = new Date(dateString);

  // Check if the date is valid
  if (isNaN(dateObj.getTime())) {
    return null;
  }

  // Extract year, month, and day
  const year = dateObj.getFullYear();
  const month = ('0' + (dateObj.getMonth() + 1)).slice(-2); // Months are zero-based
  const day = ('0' + dateObj.getDate()).slice(-2);

  // Format the date
  const formattedDate = `${year}-${month}-${day}`;
  return formattedDate;
}

export function getValueOrDefault<T>(value: T | undefined | null, defaultValue: T): T {
  return value !== undefined && value !== null ? value : defaultValue;
}

export function parseJSONString<T>(jsonString: string): T | null {
  try {
    return JSON.parse(jsonString) as T;
  } catch (error) {
    return null;
  }
}

export function toTitleCase(str: string) {
  return str.replace(/\w\S*/g, function (txt) {
    return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
  });
}

export function parseFloatValue(value: number | undefined) {
  // Check if the value is a number
  if (typeof value !== 'number' || isNaN(value)) {
    return 'Not a valid number';
  }
  // Check if it's an integer
  if (Number.isInteger(value)) {
    return value;
  } else {
    // If it's a decimal, round to 2 decimal places
    return parseFloat(value.toFixed(2));
  }
}

export function convertBytes(bytes: number): string {
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];

  if (bytes === 0) {
    return '0 Byte';
  }
  if (!bytes) {
    return 'N/A';
  }

  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  const convertedValue = parseFloat((bytes / Math.pow(1024, i)).toFixed(2));

  return `${convertedValue} ${sizes[i]}`;
}

function convertTo12HourFormat(key: number): string {
  if (key === 0 || key === 24) {
    return '12:00 AM';
  } else if (key === 12) {
    return '12:00 PM';
  } else if (key < 12) {
    return key + ':00 AM';
  } else {
    const hour = key - 12;
    return hour + ':00 PM';
  }
}

export function getKeyWithHighestCount(data: { [key: number]: number }): string | undefined {
  let maxCount: number = 0;
  let keyWithMaxCount: number | null = null;

  for (const key of Object.keys(data).map(Number)) {
    const value = data[key];
    if (value >= maxCount) {
      maxCount = value;
      keyWithMaxCount = key;
    }
  }

  if (keyWithMaxCount !== null) {
    const formattedKey = convertTo12HourFormat(keyWithMaxCount);
    return formattedKey;
  } else {
    return '00:00';
  }
}

export function searchForKeyword(arr: string[], keyword: string): string[] {
  const filteredArray: string[] = arr.filter((item: string) => {
    return item.toLowerCase().includes(keyword.toLowerCase());
  });

  return filteredArray;
}

export function ensureHTTPS(link: string): string {
  const hasHTTP = link.startsWith('http://');
  const hasHTTPS = link.startsWith('https://');

  if (!hasHTTP && !hasHTTPS) {
    return `https://${link}`;
  }

  return link;
}

export function getAbbreviation(input: string): string {
  const words = input.trim().split(/\s+/);
  if (words.length === 1) {
    return words[0].charAt(0).toUpperCase();
  } else {
    let abbreviation = '';
    for (let i = 0; i < Math.min(2, words.length); i++) {
      abbreviation += words[i].charAt(0).toUpperCase();
    }
    return abbreviation;
  }
}
