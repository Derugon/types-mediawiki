declare global {
    interface JQueryStatic {
        /**
         * User-agent detection
         *
         * @see https://doc.wikimedia.org/mediawiki-core/master/js/#!/api/jQuery.client
         */
        client: JQuery.Client;
    }

    namespace JQuery {
        interface Client {
            /**
             * Get an object containing information about the client.
             *
             * The resulting client object will be in the following format:
             *
             * ```js
             * {
             *     'name': 'firefox',
             *     'layout': 'gecko',
             *     'layoutVersion': 20101026,
             *     'platform': 'linux'
             *     'version': '3.5.1',
             *     'versionBase': '3',
             *     'versionNumber': 3.5,
             * }
             * ```
             *
             * Example:
             *
             * ```js
             * if ( $.client.profile().layout == 'gecko' ) {
             *     // This will only run in Gecko browsers, such as Mozilla Firefox.
             * }
             *
             * var profile = $.client.profile();
             * if ( profile.layout == 'gecko' && profile.platform == 'linux' ) {
             *     // This will only run in Gecko browsers on Linux.
             * }
             * ```
             *
             * Recognised browser names:
             *
             * - `android` (legacy Android browser, prior to Chrome Mobile)
             * - `chrome` (includes Chrome Mobile, Microsoft Edge, Opera, and others)
             * - `crios` (Chrome on iOS, which uses Mobile Safari)
             * - `edge` (legacy Microsoft Edge, which uses EdgeHTML)
             * - `firefox` (includes Firefox Mobile, Iceweasel, and others)
             * - `fxios` (Firefox on iOS, which uses Mobile Safari)
             * - `konqueror`
             * - `msie`
             * - `opera` (legacy Opera, which uses Presto)
             * - `rekonq`
             * - `safari` (including Mobile Safari)
             * - `silk`
             *
             * Recognised layout engines:
             *
             * - `edge` (EdgeHTML 12-18, as used by legacy Microsoft Edge)
             * - `gecko`
             * - `khtml`
             * - `presto`
             * - `trident`
             * - `webkit`
             *
             * Note that Chrome and Chromium-based browsers like Opera have their layout
             * engine identified as `webkit`.
             *
             * Recognised platforms:
             *
             * - `ipad`
             * - `iphone`
             * - `linux`
             * - `mac`
             * - `solaris` (untested)
             * - `win`
             *
             * @param {Client.Navigator} [nav] An object with a 'userAgent' and 'platform' property.
             *  Defaults to the global `navigator` object.
             * @returns {Client.Profile} The client object
             * @see https://doc.wikimedia.org/mediawiki-core/master/js/#!/api/jQuery.client-method-profile
             */
            profile(nav?: Client.Navigator): Client.Profile;

            /**
             * Checks the current browser against a support map object.
             *
             * Version numbers passed as numeric values will be compared like numbers (1.2 > 1.11).
             * Version numbers passed as string values will be compared using a simple component-wise
             * algorithm, similar to PHP's version_compare ('1.2' < '1.11').
             *
             * A browser map is in the following format:
             *
             * ```js
             * {
             *     // Multiple rules with configurable operators
             *     'msie': [['>=', 7], ['!=', 9]],
             *     // Match no versions
             *     'iphone': false,
             *     // Match any version
             *     'android': null
             * }
             * ```
             *
             * It can optionally be split into ltr/rtl sections:
             *
             * ```js
             * {
             *     'ltr': {
             *         'android': null,
             *         'iphone': false
             *     },
             *     'rtl': {
             *         'android': false,
             *         // rules are not inherited from ltr
             *         'iphone': false
             *     }
             * }
             * ```
             *
             * @param {Client.SupportMap} map Browser support map
             * @param {Client.Profile} [profile] A client-profile object
             * @param {boolean} [exactMatchOnly=false] Only return true if the browser is matched,
             *  otherwise returns true if the browser is not found.
             * @returns {boolean} The current browser is in the support map
             * @see https://doc.wikimedia.org/mediawiki-core/master/js/#!/api/jQuery.client-method-test
             */
            test(
                map: Client.SupportMap,
                profile?: Client.Profile,
                exactMatchOnly?: boolean
            ): boolean;
        }

        namespace Client {
            interface Navigator {
                userAgent: string;
                platform: string;
            }

            type ProfileName =
                | "android"
                | "chrome"
                | "crios"
                | "edge"
                | "firefox"
                | "fxios"
                | "konqueror"
                | "msie"
                | "opera"
                | "rekong"
                | "safari"
                | "silk";

            type ComparisonOperator = "==" | "===" | "!=" | "!==" | "<" | "<=" | ">" | ">=";

            type SupportMap = SupportMap.Undirected | Record<"ltr" | "rtl", SupportMap.Undirected>;

            namespace SupportMap {
                type Condition = [ComparisonOperator, string | number];

                type Undirected = Partial<Record<ProfileName, false | null | Condition[]>>;
            }

            interface Profile {
                name: ProfileName;
                layout: "edge" | "gecko" | "khtml" | "presto" | "trident" | "webkit";
                layoutVersion: number;
                platform: "ipad" | "iphone" | "linux" | "mac" | "solaris" | "win";
                version: string;
                versionBase: string;
                versionNumber: number;
            }
        }
    }
}

/** @deprecated Use {@link JQuery.Client.Navigator} instead */
export type ClientNavigator = JQuery.Client.Navigator;

export {};