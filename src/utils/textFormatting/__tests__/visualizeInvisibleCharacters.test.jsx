import {
	visualizeWhitespaces,
	isSpecialUnicodeCodePoint,
	SPECIAL_UNICODE_CODE_POINTS,
	SPECIAL_UNICODE_RANGES,
} from '../visualizeInvisibleCharacters';

/**
 * Test suite for special characters visualization
 * Extensible test data allows easy addition of new malicious/special strings
 */

// Test data: Array of test cases for special characters
const SPECIAL_CHARACTERS_TEST_CASES = [
	// Whitespace characters
	{
		name: 'Tab character',
		input: 'hello\tworld',
		shouldVisualize: true,
		codePoint: 0x0009,
		description: 'Horizontal tab'
	},
	{
		name: 'Line feed',
		input: 'line1\nline2',
		shouldVisualize: true,
		codePoint: 0x000A,
		description: 'LF control character'
	},
	{
		name: 'Carriage return',
		input: 'text\r',
		shouldVisualize: true,
		codePoint: 0x000D,
		description: 'CR control character'
	},
	{
		name: 'No-Break Space',
		input: 'hello\u00A0world',
		shouldVisualize: true,
		codePoint: 0x00A0,
		description: 'Non-breaking space'
	},

	// Zero-width characters (invisible but detectable)
	{
		name: 'Zero Width Space',
		input: 'hello\u200Bworld',
		shouldVisualize: true,
		codePoint: 0x200B,
		description: 'Zero-width space'
	},
	{
		name: 'Zero Width Joiner',
		input: 'text\u200Dmore',
		shouldVisualize: true,
		codePoint: 0x200D,
		description: 'Zero-width joiner'
	},
	{
		name: 'Zero Width Non-Joiner',
		input: 'text\u200Cmore',
		shouldVisualize: true,
		codePoint: 0x200C,
		description: 'Zero-width non-joiner'
	},

	// Bidirectional control characters (Trojan Source)
	{
		name: 'Right-to-Left Mark',
		input: 'text\u200Fmore',
		shouldVisualize: true,
		codePoint: 0x200F,
		description: 'RTL control character - security risk'
	},
	{
		name: 'Left-to-Right Mark',
		input: 'text\u200Emore',
		shouldVisualize: true,
		codePoint: 0x200E,
		description: 'LTR control character'
	},

	// Control characters (0x00-0x1F - C0 control characters)
	{
		name: 'Null character',
		input: 'text\u0000more',
		shouldVisualize: true,
		codePoint: 0x0000,
		description: 'Null terminator'
	},
	{
		name: 'SOH (Start of Heading)',
		input: 'text\u0001more',
		shouldVisualize: true,
		codePoint: 0x0001,
		description: 'Start of Heading'
	},
	{
		name: 'STX (Start of Text)',
		input: 'text\u0002more',
		shouldVisualize: true,
		codePoint: 0x0002,
		description: 'Start of Text'
	},
	{
		name: 'Escape character',
		input: 'text\u001Bmore',
		shouldVisualize: true,
		codePoint: 0x001B,
		description: 'Escape control character'
	},
	{
		name: 'Unit Separator (0x1F)',
		input: 'text\u001Fmore',
		shouldVisualize: true,
		codePoint: 0x001F,
		description: 'Unit Separator - last C0 control character'
	},

	// Regular text (should NOT be visualized)
	{
		name: 'Normal ASCII text',
		input: 'hello world',
		shouldVisualize: false,
		description: 'Regular ASCII characters'
	}
];

describe('visualizeInvisibleCharacters', () => {
	describe('isSpecialUnicodeCodePoint', () => {
		SPECIAL_CHARACTERS_TEST_CASES.forEach(testCase => {
			if (testCase.codePoint !== undefined) {
				it(`should ${testCase.shouldVisualize ? 'detect' : 'ignore'} ${testCase.name} (U+${testCase.codePoint.toString(16).toUpperCase()})`, () => {
					const result = isSpecialUnicodeCodePoint(testCase.codePoint);
					expect(result).toBe(testCase.shouldVisualize);
				});
			}
		});
	});

	describe('visualizeWhitespaces rendering', () => {
		SPECIAL_CHARACTERS_TEST_CASES.forEach(testCase => {
			it(`should handle ${testCase.name}: ${testCase.description}`, () => {
				const result = visualizeWhitespaces(testCase.input);

				if (testCase.shouldVisualize) {
					// Should return an array or have visualization artifacts
					expect(result).toBeTruthy();
					expect(result).not.toBe(testCase.input);
				} else {
					// Normal text should be processed
					expect(result).toBeTruthy();
				}
			});
		});
	});

	describe('Edge cases', () => {
		it('should handle null input gracefully', () => {
			const result = visualizeWhitespaces(null);
			expect(result).toBeNull();
		});

		it('should handle undefined input gracefully', () => {
			const result = visualizeWhitespaces(undefined);
			expect(result).toBeUndefined();
		});

		it('should handle empty string', () => {
			const result = visualizeWhitespaces('');
			expect(result).toBe('');
		});

		it('should handle multiple special characters in sequence', () => {
			const input = 'text\u200B\u200C\u200Dmore';
			const result = visualizeWhitespaces(input);
			expect(result).toBeTruthy();
		});

		it('should handle mixed normal and special characters', () => {
			const input = 'hello\u200Bworld\u200Ctest';
			const result = visualizeWhitespaces(input);
			expect(result).toBeTruthy();
		});
	});

	describe('C0 Control Characters (0x00-0x1F) - Full range', () => {
		it('should visualize all C0 control characters', () => {
			// Test all characters from 0x00 to 0x1F
			for (let i = 0x00; i <= 0x1F; i++) {
				const result = isSpecialUnicodeCodePoint(i);
				expect(result).toBe(true);
			}
		});

		it('should render visualization spans for C0 control characters', () => {
			const testCharacters = [
				String.fromCharCode(0x00), // Null
				String.fromCharCode(0x01), // SOH
				String.fromCharCode(0x09), // Tab
				String.fromCharCode(0x0A), // LF
				String.fromCharCode(0x0D), // CR
				String.fromCharCode(0x1B), // Escape
				String.fromCharCode(0x1F), // Unit Separator
			];

			testCharacters.forEach(char => {
				const result = visualizeWhitespaces(`text${char}more`);
				expect(result).toBeTruthy();
				expect(result).not.toBe(`text${char}more`);
			});
		});

		it('should visualize bidirectional override characters that could hide malicious code', () => {
			// These characters can be used to hide code in comments (Trojan Source)
			const trojans = [
				{ code: 0x202E, name: 'RLO (Right-to-Left Override)' },
				{ code: 0x202D, name: 'LRO (Left-to-Right Override)' },
				{ code: 0x2066, name: 'LRI (Left-to-Right Isolate)' },
				{ code: 0x2067, name: 'RLI (Right-to-Left Isolate)' },
			];

			trojans.forEach(trojan => {
				const result = isSpecialUnicodeCodePoint(trojan.code);
				expect(result).toBe(true);
			});
		});
	});
});

// Helper function to easily add new test cases
export function addSpecialCharacterTestCase(testCase) {
	if (!testCase.name || !testCase.input) {
		throw new Error('Test case must have "name" and "input" properties');
	}
	SPECIAL_CHARACTERS_TEST_CASES.push(testCase);
}

// Export for external extension
export { SPECIAL_CHARACTERS_TEST_CASES };
