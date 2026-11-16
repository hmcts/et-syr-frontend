import nunjucks from 'nunjucks';

function createFilters(env: nunjucks.Environment): void {
  // to switch a string or an array of strings to titleCase
  env.addFilter('titleCase', function (input: string | string[]) {
    if (typeof input === 'string') {
      const words = input.split(' ');
      const titleCaseWords = words.map(function (word: string) {
        return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
      });
      return titleCaseWords.join(' ');
    } else if (Array.isArray(input)) {
      const titleCaseArray = input.map(function (str: string) {
        const words = str.split(' ');
        const titleCaseWords = words.map(function (word: string) {
          return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
        });
        return titleCaseWords.join(' ');
      });
      return titleCaseArray;
    }
  });

  // Record the real radio count. Dividers ("or") are not radios, so skip them.
  // The radios template also gives these radios their own group, so a revealed field is not counted.
  env.addFilter('radioPositions', function (items: RadioItem[]) {
    const setSize = items.filter(item => item && !item.divider).length;
    let position = 0;
    return items.map(item => {
      if (!item || item.divider) {
        return item;
      }
      position++;
      return {
        ...item,
        attributes: { ...item.attributes, 'aria-posinset': position, 'aria-setsize': setSize },
      };
    });
  });

  // Ids match the GOV.UK radios template: the first radio uses the prefix, later radios use prefix-2, prefix-3.
  env.addFilter('radioOwns', function (items: RadioItem[], idPrefix: string) {
    return items
      .map((item, index) => (item && !item.divider ? radioInputId(item, index, idPrefix) : ''))
      .filter(Boolean)
      .join(' ');
  });

  // Move a follow-up field out of the radio markup. Chrome and Edge count it as another
  // option when it is inside the group or linked with aria-controls.
  env.addFilter('prepareRadioReveals', function (items: RadioItem[], idPrefix: string) {
    const reveals: RadioReveal[] = [];
    const nextItems = items.map((item, index) => {
      if (!item || item.divider || !item.conditional?.html) {
        return item;
      }
      const revealId = `conditional-${radioInputId(item, index, idPrefix)}`;
      reveals.push({ id: revealId, html: item.conditional.html, open: Boolean(item.checked) });
      return {
        ...item,
        conditional: { html: '' },
        attributes: { ...item.attributes, 'data-reveal': revealId },
      };
    });
    return { items: nextItems, reveals };
  });
}

function radioInputId(item: RadioItem, index: number, idPrefix: string): string {
  const position = index + 1;
  return item.id || (position > 1 ? `${idPrefix}-${position}` : idPrefix);
}

type RadioItem = {
  id?: string;
  divider?: string;
  checked?: boolean;
  attributes?: Record<string, unknown>;
  conditional?: { html?: string };
};

type RadioReveal = { id: string; html: string; open: boolean };

export default createFilters;
