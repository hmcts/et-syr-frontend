// Show or hide a follow-up field without aria-controls. Chrome and Edge add the
// controlled field to the radio count when that link is present.
export function syncRadioReveals(root: ParentNode = document): void {
  root.querySelectorAll<HTMLInputElement>('input[type="radio"]').forEach(radio => {
    radio.removeAttribute('aria-controls');
    radio.removeAttribute('aria-expanded');
    radio.removeAttribute('data-aria-controls');
  });

  root.querySelectorAll<HTMLInputElement>('input[type="radio"][data-reveal]').forEach(radio => {
    const reveal = document.getElementById(radio.dataset.reveal || '');
    if (!reveal) {
      return;
    }
    reveal.classList.toggle('govuk-radios__conditional--hidden', !radio.checked);
  });
}

const syncChangedRadioGroup = (event: Event): void => {
  const target = event.target;
  if (!(target instanceof HTMLInputElement) || target.type !== 'radio') {
    return;
  }
  document.querySelectorAll<HTMLInputElement>('input[type="radio"][data-reveal]').forEach(radio => {
    if (radio.name !== target.name || radio.form !== target.form) {
      return;
    }
    radio.removeAttribute('aria-controls');
    radio.removeAttribute('aria-expanded');
    const reveal = document.getElementById(radio.dataset.reveal || '');
    if (!reveal) {
      return;
    }
    reveal.classList.toggle('govuk-radios__conditional--hidden', !radio.checked);
  });
};

if (typeof document !== 'undefined') {
  document.addEventListener('change', syncChangedRadioGroup);
  window.addEventListener('pageshow', () => syncRadioReveals());
}
