import { v4 } from 'uuid';

const RANDOM_ID_MAX_LENGTH = 32;
const RANDOM_ID_MIN_LENGTH = 6;

/**
 * Generates random ID with v4 UUID specs
 *
 * @param length Max value is 32. Min value is 0. Default value is 32
 */
export function generateId(length: number = RANDOM_ID_MAX_LENGTH): string {
	if (RANDOM_ID_MIN_LENGTH <= length && length <= RANDOM_ID_MAX_LENGTH) {
		return v4().split('-').join('').slice(0, length);
	} else {
		return v4().split('-').join('');
	}
}
