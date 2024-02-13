declare namespace mw {
    /**
     * @see https://doc.wikimedia.org/mediawiki-core/master/js/#!/api/mw.user
     */
    const user: User;

    interface User {
        /**
         * @see https://doc.wikimedia.org/mediawiki-core/master/js/#!/api/mw.user-property-options
         */
        // TODO: add types for items in the options map
        options: Map<User.Options>;

        /**
         * @see https://doc.wikimedia.org/mediawiki-core/master/js/#!/api/mw.user-property-tokens
         */
        tokens: Map<User.Tokens>;
    }

    namespace User {
        interface Info {
            /**
             * User groups that the user belongs to
             */
            groups: string[];
            /**
             * User's rights
             */
            rights: string[];
        }

        interface Options extends Record<string, any> {}

        interface Tokens extends Record<string, string> {}
    }
}
