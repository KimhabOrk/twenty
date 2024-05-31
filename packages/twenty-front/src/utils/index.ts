import { parseDate } from './date-utils';

export const formatToHumanReadableDate = (date: Date | string) => {
  const parsedJSDate = parseDate(date).toJSDate();

  return new Intl.DateTimeFormat(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(parsedJSDate);
};

export const formatToHumanReadableDateTime = (date: Date | string) => {
  const parsedJSDate = parseDate(date).toJSDate();

  return new Intl.DateTimeFormat(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
  }).format(parsedJSDate);
};

export const formatToHumanReadableMonth = (date: Date | string) => {
  const parsedJSDate = parseDate(date).toJSDate();

  return new Intl.DateTimeFormat(undefined, {
    month: 'short',
  }).format(parsedJSDate);
};

export const formatToHumanReadableDay = (date: Date | string) => {
  const parsedJSDate = parseDate(date).toJSDate();

  return new Intl.DateTimeFormat(undefined, {
    day: 'numeric',
  }).format(parsedJSDate);
};

export const formatToHumainReadableTime = (date: Date | string) => {
  const parsedJSDate = parseDate(date).toJSDate();

  return new Intl.DateTimeFormat(undefined, {
    hour: 'numeric',
    minute: 'numeric',
  }).format(parsedJSDate);
};

export const sanitizeURL = (link: string | null | undefined) => {
  return link
    ? link.replace(/(https?:\/\/)|(www\.)/g, '').replace(/\/$/, '')
    : '';
};

export const getLogoUrlFromDomainName = (
  domainName?: string,
): string | undefined => {
  const sanitizedDomain = sanitizeURL(domainName);
  return sanitizedDomain
    ? `https://favicon.twenty.com/${sanitizedDomain}`
    : undefined;
};
