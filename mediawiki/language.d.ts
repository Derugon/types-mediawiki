declare global {
    namespace mw {
        /**
         * Base language object with methods related to language support, attempting to mirror some of the
         * functionality of the Language class in MediaWiki:
         *
         * - storing and retrieving language data
         * - transforming message syntax (`{{PLURAL:}}`, `{{GRAMMAR:}}`, `{{GENDER:}}`)
         * - formatting numbers
         *
         * @see https://doc.wikimedia.org/mediawiki-core/master/js/#!/api/mw.language
         */
        namespace language {
            /**
             * Language-related data (keyed by language, contains instances of mw.Map).
             *
             * Exported dynamically by the ResourceLoader\LanguageDataModule class in PHP.
             *
             * To set data:
             *
             * ```js
             * // Override, extend or create the language data object of 'nl'
             * mw.language.setData( 'nl', 'myKey', 'My value' );
             *
             * // Set multiple key/values pairs at once
             * mw.language.setData( 'nl', { foo: 'X', bar: 'Y' } );
             * ```
             *
             * To get GrammarForms data for language 'nl':
             *
             * ```js
             * var grammarForms = mw.language.getData( 'nl', 'grammarForms' );
             * ```
             *
             * Possible data keys:
             *
             * - `digitTransformTable`
             * - `separatorTransformTable`
             * - `minimumGroupingDigits`
             * - `grammarForms`
             * - `pluralRules`
             * - `digitGroupingPattern`
             * - `fallbackLanguages`
             * - `bcp47Map`
             * - `languageNames`
             *
             * @see https://doc.wikimedia.org/mediawiki-core/master/js/#!/api/mw.language-property-data
             */
            const data: Record<string, Map>;

            /**
             * Information about month names in current UI language.
             *
             * @see https://doc.wikimedia.org/mediawiki-core/master/js/#!/api/mw.language-property-months
             */
            const months: {
                /**
                 * Array of month names (in nominative case in languages which have the distinction),
                 * zero-indexed.
                 */
                abbrev: string[];

                /**
                 * Object containing zero-indexed arrays of message keys for appropriate messages
                 * which can be passed to {@link mw.msg}.
                 */
                keys: Record<"abbrev" | "genitive" | "names", string[]>;

                /**
                 * Array of month names in genitive case, zero-indexed.
                 */
                genitive: string[];

                /**
                 * Array of month names (in nominative case in languages which have the distinction),
                 * zero-indexed.
                 */
                names: string[];
            };

            /**
             * Formats language tags according the BCP 47 standard.
             * See LanguageCode::bcp47 for the PHP implementation.
             *
             * @param {string} languageTag Well-formed language tag
             * @returns {string}
             * @see https://doc.wikimedia.org/mediawiki-core/master/js/#!/api/mw.language-method-bcp47
             */
            function bcp47(languageTag: string): string;

            /**
             * Grammatical transformations, needed for inflected languages.
             * Invoked by putting `{{grammar:case|word}}` in a message.
             *
             * The rules can be defined in $wgGrammarForms global or computed
             * dynamically by overriding this method per language.
             *
             * @param {string} word
             * @param {string} form
             * @returns {string}
             * @see https://doc.wikimedia.org/mediawiki-core/master/js/#!/api/mw.language-method-convertGrammar
             */
            function convertGrammar(word: string, form: string): string;

            /**
             * Converts a number using {@link getDigitTransformTable}.
             *
             * @param {number} num Value to be converted
             * @param {boolean} [integer=false] Whether to convert the return value to an integer
             * @returns {number|string} Formatted number
             * @see https://doc.wikimedia.org/mediawiki-core/master/js/#!/api/mw.language-method-convertNumber
             */
            function convertNumber(num: number, integer?: boolean): number | string;

            /**
             * Plural form transformations, needed for some languages.
             *
             * @param {number} count Non-localized quantifier
             * @param {string[]} forms List of plural forms
             * @param {Object.<number, string>} [explicitPluralForms] List of explicit plural forms
             * @returns {string} Correct form for quantifier in this language
             * @see https://doc.wikimedia.org/mediawiki-core/master/js/#!/api/mw.language-method-convertPlural
             */
            function convertPlural(
                count: number,
                forms: string[],
                explicitPluralForms?: Record<number, string>
            ): string;

            /**
             * Provides an alternative text depending on specified gender.
             *
             * Usage in message text: `{{gender:[gender|user object]|masculine|feminine|neutral}}`.
             * If second or third parameter are not specified, masculine is used.
             *
             * These details may be overridden per language.
             *
             * @param {string} gender 'male', 'female', or anything else for neutral.
             * @param {string[]} forms List of gender forms
             * @returns {string}
             * @see https://doc.wikimedia.org/mediawiki-core/master/js/#!/api/mw.language-method-gender
             */
            function gender<T extends string>(gender: string, forms: [T?, T?, T?]): T;

            /**
             * Convenience method for retrieving language data.
             *
             * Structured by language code and data key, covering for the potential inexistence of a
             * data object for this language.
             *
             * @param {string} langCode
             * @param {string} dataKey
             * @returns {Mixed} Value stored in the mw.Map (or `undefined` if there is no map for the
             *  specified langCode)
             * @see https://doc.wikimedia.org/mediawiki-core/master/js/#!/api/mw.language-method-getData
             */
            function getData(langCode: string, dataKey: string): any;

            /**
             * Get the digit transform table for current UI language.
             *
             * @returns {Object.<number|string, string>|string[]}
             * @see https://doc.wikimedia.org/mediawiki-core/master/js/#!/api/mw.language-method-getDigitTransformTable
             */
            function getDigitTransformTable(): string[] | Record<number | string, string>;

            /**
             * Get the language fallback chain for current UI language, including the language itself.
             *
             * @returns {string[]} List of language keys, e.g. `['pfl', de', 'en']`
             * @see https://doc.wikimedia.org/mediawiki-core/master/js/#!/api/mw.language-method-getFallbackLanguageChain
             */
            function getFallbackLanguageChain(): string[];

            /**
             * Get the language fallback chain for current UI language (not including the language itself).
             *
             * @returns {string[]} List of language keys, e.g. `['de', 'en']`
             * @see https://doc.wikimedia.org/mediawiki-core/master/js/#!/api/mw.language-method-getFallbackLanguages
             */
            function getFallbackLanguages(): string[];

            /**
             * Get the separator transform table for current UI language.
             *
             * @returns {Object.<number|string, string>|string[]}
             * @see https://doc.wikimedia.org/mediawiki-core/master/js/#!/api/mw.language-method-getSeparatorTransformTable
             */
            function getSeparatorTransformTable(): string[] | Record<number | string, string>;

            /**
             * Turn a list of string into a simple list using commas and 'and'.
             *
             * See Language::listToText in languages/Language.php
             *
             * @param {string[]} list
             * @returns {string}
             * @see https://doc.wikimedia.org/mediawiki-core/master/js/#!/api/mw.language-method-listToText
             */
            function listToText(list: string[]): string;

            /**
             * Convenience method for setting language data.
             *
             * Creates the data mw.Map if there isn't one for the specified language already.
             *
             * @param {string} langCode
             * @param {string|Object.<string, any>} dataKey Key or object of key/values
             * @param {Mixed} [value] Value for dataKey, omit if dataKey is an object
             * @see https://doc.wikimedia.org/mediawiki-core/master/js/#!/api/mw.language-method-setData
             */
            function setData(langCode: string, dataKey: string, value: any): void;
            function setData(langCode: string, dataKey: Record<string, any>): void;

            /**
             * Pads an array to a specific length by copying the last one element.
             *
             * @private
             * @param {string[]} forms Number of forms given to convertPlural
             * @param {number} count Number of forms required
             * @returns {string[]} Padded array of forms
             * @see https://doc.wikimedia.org/mediawiki-core/master/js/#!/api/mw.language-method-preConvertPlural
             */
            function preConvertPlural(forms: string[], count: number): string[];
        }
    }
}

export {};
