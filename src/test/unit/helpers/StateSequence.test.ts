import { ET3Status } from '../../../main/definitions/definition';
import { currentET3StatusFn } from '../../../main/helpers/state-sequence';
import { mockRespondentET3Model } from '../mocks/mockRespondentET3Model';

describe('state sequence tests', () => {
  test('Should have state index 1', async () => {
    const currentState = currentET3StatusFn(mockRespondentET3Model);
    expect(currentState.stateIndex).toEqual(1);
  });
  test('Should have state index 3', async () => {
    const mockedRespondent = mockRespondentET3Model;
    mockedRespondent.et3Status = ET3Status.RESPONSE_ACCEPTED.toString();
    const currentState = currentET3StatusFn(mockedRespondent);
    expect(currentState.stateIndex).toEqual(3);
  });
  test('Should have state index 4', async () => {
    const mockedRespondent = mockRespondentET3Model;
    mockedRespondent.et3Status = ET3Status.HEARINGS_ESTABLISHED.toString();
    const currentState = currentET3StatusFn(mockedRespondent);
    expect(currentState.stateIndex).toEqual(4);
  });
  test('Should have state index 5', async () => {
    const mockedRespondent = mockRespondentET3Model;
    mockedRespondent.et3Status = ET3Status.CASE_DECIDED.toString();
    const currentState = currentET3StatusFn(mockedRespondent);
    expect(currentState.stateIndex).toEqual(5);
  });
});
