import { setRadioGroupPositions } from '../../../main/assets/js/radio-set-size';

describe('setRadioGroupPositions', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  it('keeps a 2-option group at set size 2 when the conditional text field is open', () => {
    document.body.innerHTML = `
      <div class="govuk-radios" data-module="govuk-radios">
        <div class="govuk-radios__item">
          <input type="radio" name="responseRespondentNameQuestion" value="Yes">
          <label>Yes</label>
        </div>
        <div class="govuk-radios__item">
          <input type="radio" name="responseRespondentNameQuestion" value="No" checked>
          <label>No</label>
        </div>
        <div class="govuk-radios__conditional" id="conditional-no">
          <label for="responseRespondentName">Respondent name</label>
          <input id="responseRespondentName" type="text" name="responseRespondentName">
        </div>
      </div>
    `;

    setRadioGroupPositions();

    const radios = document.querySelectorAll<HTMLInputElement>('input[type="radio"]');
    const revealedText = document.querySelector<HTMLInputElement>('#responseRespondentName');

    expect(revealedText).not.toBeNull();
    expect(radios[0].getAttribute('aria-posinset')).toBe('1');
    expect(radios[0].getAttribute('aria-setsize')).toBe('2');
    expect(radios[1].getAttribute('aria-posinset')).toBe('2');
    expect(radios[1].getAttribute('aria-setsize')).toBe('2');
    expect(revealedText?.hasAttribute('aria-setsize')).toBe(false);
    expect(revealedText?.hasAttribute('aria-posinset')).toBe(false);
  });

  it('does not let a conditional between options change the position or the total', () => {
    document.body.innerHTML = `
      <div class="govuk-radios">
        <div class="govuk-radios__item">
          <input type="radio" name="et3ResponseIsJobTitleCorrect" value="Yes">
        </div>
        <div class="govuk-radios__item">
          <input type="radio" name="et3ResponseIsJobTitleCorrect" value="No" checked>
        </div>
        <div class="govuk-radios__conditional" id="conditional-job-title">
          <input id="et3ResponseCorrectJobTitle" type="text" name="et3ResponseCorrectJobTitle">
        </div>
        <div class="govuk-radios__item">
          <input type="radio" name="et3ResponseIsJobTitleCorrect" value="Not applicable">
        </div>
      </div>
    `;

    setRadioGroupPositions();

    const radios = document.querySelectorAll<HTMLInputElement>('input[type="radio"]');

    expect(Array.from(radios).map(radio => radio.getAttribute('aria-posinset'))).toEqual(['1', '2', '3']);
    radios.forEach(radio => {
      expect(radio.getAttribute('aria-setsize')).toBe('3');
    });
    expect(document.querySelector('#et3ResponseCorrectJobTitle')?.hasAttribute('aria-setsize')).toBe(false);
  });

  it('sizes each radio group on the page separately', () => {
    document.body.innerHTML = `
      <div class="govuk-radios">
        <div class="govuk-radios__item"><input type="radio" name="contact" value="Email"></div>
        <div class="govuk-radios__item"><input type="radio" name="contact" value="Post" checked></div>
        <div class="govuk-radios__conditional"><input type="text" name="reason"></div>
      </div>
      <div class="govuk-radios govuk-radios--inline">
        <div class="govuk-radios__item"><input type="radio" name="language" value="English"></div>
        <div class="govuk-radios__item"><input type="radio" name="language" value="Welsh"></div>
      </div>
    `;

    setRadioGroupPositions();

    const contact = document.querySelectorAll<HTMLInputElement>('input[name="contact"]');
    const language = document.querySelectorAll<HTMLInputElement>('input[name="language"]');

    contact.forEach(radio => {
      expect(radio.getAttribute('aria-setsize')).toBe('2');
    });
    expect(contact[1].getAttribute('aria-posinset')).toBe('2');
    language.forEach(radio => {
      expect(radio.getAttribute('aria-setsize')).toBe('2');
    });
    expect(language[0].getAttribute('aria-posinset')).toBe('1');
    expect(language[1].getAttribute('aria-posinset')).toBe('2');
  });
});
