declare namespace mw {
    interface Message {
        /**
         * Check whether the message contains only syntax supported by jqueryMsg.
         *
         * This method is only available when jqueryMsg is loaded.
         *
         * @since 1.41
         * @returns {boolean}
         * @see https://doc.wikimedia.org/mediawiki-core/master/js/#!/api/mw.Message-method-isParseable
         */
        isParseable(): boolean;

        /**
         * Parse the message to DOM nodes, rather than HTML string like {@link parse}.
         *
         * This method is only available when jqueryMsg is loaded.
         *
         * @since 1.27
         * @returns {JQuery}
         * @see https://doc.wikimedia.org/mediawiki-core/master/js/#!/api/mw.Message-method-parseDom
         */
        parseDom(): JQuery;
    }
}
