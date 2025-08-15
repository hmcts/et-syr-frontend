/**
 * Enum representing different Respondent Solicitor types.
 */
export enum RespondentSolicitorType {
  SOLICITORA = '[SOLICITORA]',
  SOLICITORB = '[SOLICITORB]',
  SOLICITORC = '[SOLICITORC]',
  SOLICITORD = '[SOLICITORD]',
  SOLICITORE = '[SOLICITORE]',
  SOLICITORF = '[SOLICITORF]',
  SOLICITORG = '[SOLICITORG]',
  SOLICITORH = '[SOLICITORH]',
  SOLICITORI = '[SOLICITORI]',
  SOLICITORJ = '[SOLICITORJ]',
}

/**
 * Gets the RespondentSolicitorType enums value by its label.
 *
 * @param label - The label to match, e.g. "[SOLICITORA]"
 * @returns The corresponding RespondentSolicitorType
 * @throws Error if the label does not match any enums value
 */
export function getRespondentSolicitorTypeFromLabel(label: string): RespondentSolicitorType {
  const match = Object.values(RespondentSolicitorType).find(value => value === label);
  if (!match) {
    throw new Error(`No RespondentSolicitorType found for label: ${label}`);
  }
  return match as RespondentSolicitorType;
}

/**
 * Checks whether a label is a valid RespondentSolicitorType.
 *
 * @param label - The label to check
 * @returns True if valid, false otherwise
 */
export function isValidRespondentSolicitorLabel(label: string): boolean {
  return Object.values(RespondentSolicitorType).includes(label as RespondentSolicitorType);
}

/**
 * Gets a RespondentSolicitorType by its index in the enums order.
 *
 * @param index - The index to retrieve
 * @returns The corresponding RespondentSolicitorType
 * @throws Error if the index is out of bounds
 */
export function getRespondentSolicitorTypeByIndex(index: number): RespondentSolicitorType {
  const values = Object.values(RespondentSolicitorType);
  if (index < 0 || index >= values.length) {
    throw new Error(`Index out of bounds for RespondentSolicitorType: ${index}`);
  }
  return values[index] as RespondentSolicitorType;
}
