declare namespace mw {
    /**
     * Write a verbose message to the browser's console in debug mode.
     *
     * This method is mainly intended for verbose logging. It is a no-op in production mode.
     * In ResourceLoader debug mode, it will use the browser's console.
     *
     * See {@link mw.log} for other logging methods.
     *
     * @param {...any} msg Messages to output to console.
     * @see https://doc.wikimedia.org/mediawiki-core/master/js/#!/api/mw-method-log
     */
    function log(...msg: any[]): void;

    /**
     * Collection of methods to help log messages to the console.
     *
     * @see https://doc.wikimedia.org/mediawiki-core/master/js/#!/api/mw.log
     */
    namespace log {
        /**
         * Write a message to the browser console's warning channel.
         *
         * @param {...any} msg Messages to output to console
         * @see https://doc.wikimedia.org/mediawiki-core/master/js/#!/api/mw.log-method-warn
         */
        function warn(...msg: any[]): void;
    }
}
