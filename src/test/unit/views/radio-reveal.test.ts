import { syncRadioReveals } from '../../../main/assets/js/radio-reveal';

describe('syncRadioReveals', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  it('shows only the follow-up for the selected radio and removes the controls link', () => {
    document.body.innerHTML = `
      <input id="question" type="radio" name="question" value="Yes" data-reveal="conditional-question">
      <input id="question-2" type="radio" name="question" value="No" data-reveal="conditional-question-2" aria-controls="conditional-question-2" aria-expanded="true">
      <div id="conditional-question" class="govuk-radios__conditional"></div>
      <div id="conditional-question-2" class="govuk-radios__conditional govuk-radios__conditional--hidden"></div>
    `;
    const no = document.querySelector<HTMLInputElement>('#question-2');
    if (no) {
      no.checked = true;
    }

    syncRadioReveals();

    expect(no?.hasAttribute('aria-controls')).toBe(false);
    expect(no?.hasAttribute('aria-expanded')).toBe(false);
    expect(
      document.querySelector('#conditional-question')?.classList.contains('govuk-radios__conditional--hidden')
    ).toBe(true);
    expect(
      document.querySelector('#conditional-question-2')?.classList.contains('govuk-radios__conditional--hidden')
    ).toBe(false);
  });

  it('hides the follow-up when another option in the group is selected', () => {
    document.body.innerHTML = `
      <input id="question" type="radio" name="question" value="Yes">
      <input id="question-2" type="radio" name="question" value="No" checked data-reveal="conditional-question-2">
      <div id="conditional-question-2" class="govuk-radios__conditional"></div>
    `;
    const yes = document.querySelector<HTMLInputElement>('#question');
    const no = document.querySelector<HTMLInputElement>('#question-2');
    if (yes && no) {
      yes.checked = true;
      no.checked = false;
      yes.dispatchEvent(new Event('change', { bubbles: true }));
    }

    expect(
      document.querySelector('#conditional-question-2')?.classList.contains('govuk-radios__conditional--hidden')
    ).toBe(true);
  });
});
