import { HearingModel } from '../definitions/api/caseApiResponse';

const formatDate = (rawDate: Date): string =>
  new Intl.DateTimeFormat('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date(rawDate));

/**
 * Build a display label for an unheard (future, Listed) hearing.
 * Returns undefined when the hearing has no future Listed dates.
 */
export const createLabelForHearing = (hearing: HearingModel): string | undefined => {
  if (!hearing?.value?.hearingDateCollection?.length) {
    return undefined;
  }

  const hearingsInFuture = hearing.value.hearingDateCollection.filter(
    item => new Date(item.value.listedDate) > new Date() && item.value.Hearing_status === 'Listed'
  );

  if (!hearingsInFuture.length) {
    return undefined;
  }

  const earliestDate = hearingsInFuture.reduce(
    (earliest, current) =>
      new Date(earliest.value.listedDate) > new Date(current.value.listedDate) ? current : earliest,
    hearingsInFuture[0]
  );
  const venue = hearing.value?.Hearing_venue_Scotland || hearing.value?.Hearing_venue?.value?.label;
  return `${hearing.value.hearingNumber ?? ''} ${hearing.value.Hearing_type ?? ''} - ${venue ?? ''} - ${formatDate(
    earliestDate.value.listedDate
  )}`;
};

/**
 * Create radio options for all unheard hearings in the collection.
 */
export const createRadioBtnsForHearings = (
  hearingCollection: HearingModel[] | undefined
): { name: string; label: string; value: string }[] | undefined => {
  if (!hearingCollection?.length) {
    return undefined;
  }

  const filtered = hearingCollection.filter(hearing => !!createLabelForHearing(hearing));
  if (!filtered.length) {
    return undefined;
  }

  return filtered.map(hearing => ({
    label: createLabelForHearing(hearing) as string,
    value: hearing.id,
    name: 'hearingDocumentsAreFor',
  }));
};
