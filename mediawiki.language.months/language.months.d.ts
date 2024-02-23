declare namespace mw.language {
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
    namespace months {
        /**
         * Array of month names (in nominative case in languages which have the distinction),
         * zero-indexed.
         */
        const abbrev: string[];

        /**
         * Object containing zero-indexed arrays of message keys for appropriate messages
         * which can be passed to {@link mw.msg}.
         */
        const keys: Record<"abbrev" | "genitive" | "names", string[]>;

        /**
         * Array of month names in genitive case, zero-indexed.
         */
        const genitive: string[];

        /**
         * Array of month names (in nominative case in languages which have the distinction),
         * zero-indexed.
         */
        const names: string[];
    }
}
