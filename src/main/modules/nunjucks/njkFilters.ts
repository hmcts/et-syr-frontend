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
      .map((item, index) => {
        if (!item || item.divider) {
          return '';
        }
        const position = index + 1;
        return item.id || (position > 1 ? `${idPrefix}-${position}` : idPrefix);
      })
      .filter(Boolean)
      .join(' ');
  });
}

type RadioItem = { id?: string; divider?: string; attributes?: Record<string, unknown> };

export default createFilters;
