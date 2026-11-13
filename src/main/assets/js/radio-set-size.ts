// Chrome includes an open conditional reveal when it tells VoiceOver how many
// radios are in the group. These attributes are the real radio count, and they
// stay the same when the follow-up field is shown or hidden.
export function setRadioGroupPositions(root: ParentNode = document): void {
  root.querySelectorAll('.govuk-radios').forEach(group => {
    const radios = group.querySelectorAll<HTMLInputElement>(':scope > .govuk-radios__item > input[type="radio"]');
    const setSize = String(radios.length);
    radios.forEach((radio, index) => {
      radio.setAttribute('aria-setsize', setSize);
      radio.setAttribute('aria-posinset', String(index + 1));
    });
  });
}

const applyRadioGroupPositions = (): void => {
  setRadioGroupPositions();
};

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', applyRadioGroupPositions);
} else {
  applyRadioGroupPositions();
}

window.addEventListener('pageshow', applyRadioGroupPositions);
