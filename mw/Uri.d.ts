import { QueryParams } from "./utils";

interface UriOptions {
    /**
     * Trigger strict mode parsing of the url.
     */
    strictMode: boolean;
    /**
     * Whether to let duplicate query parameters override each other (`true`) or automagically convert them to an array (`false`).
     */
    overrideKeys: boolean;
    /**
     * Whether to parse array query parameters (e.g. `&foo[0]=a&foo[1]=b` or `&foo[]=a&foo[]=b`) or leave them alone.
     * Currently this does not handle associative or multi-dimensional arrays, but that may be improved in the future.
     * Implies `overrideKeys: true` (query parameters without `[...]` are not parsed as arrays).
     */
    arrayParams: boolean;
}

interface UriParser {
    strict: RegExp;
    loose: RegExp;
}

declare global {
    namespace mw {
        /**
         * A factory method to create an mw.Uri class with a default location to resolve relative URLs
         * against (including protocol-relative URLs).
         *
         * @param {string|Function} documentLocation A full url, or function returning one.
         *  If passed a function, the return value may change over time and this will be honoured. (T74334)
         * @returns {Function} An mw.Uri class constructor
         * @see https://doc.wikimedia.org/mediawiki-core/master/js/#!/api/mw-method-UriRelative
         */
        function UriRelative(documentLocation: string | (() => string)): typeof Uri;

        /**
         * Library for simple URI parsing and manipulation.
         *
         * Intended to be minimal, but featureful; do not expect full RFC 3986 compliance. The use cases we
         * have in mind are constructing 'next page' or 'previous page' URLs, detecting whether we need to
         * use cross-domain proxies for an API, constructing simple URL-based API calls, etc. Parsing here
         * is regex-based, so may not work on all URIs, but is good enough for most.
         *
         * You can modify the properties directly, then use the {@link toString} method to extract the full URI
         * string again. Example:
         *
         * ```js
         * var uri = new mw.Uri( 'http://example.com/mysite/mypage.php?quux=2' );
         *
         * if ( uri.host == 'example.com' ) {
         *     uri.host = 'foo.example.com';
         *     uri.extend( { bar: 1 } );
         *
         *     $( 'a#id1' ).attr( 'href', uri );
         *     // anchor with id 'id1' now links to http://foo.example.com/mysite/mypage.php?bar=1&quux=2
         *
         *     $( 'a#id2' ).attr( 'href', uri.clone().extend( { bar: 3, pif: 'paf' } ) );
         *     // anchor with id 'id2' now links to http://foo.example.com/mysite/mypage.php?bar=3&quux=2&pif=paf
         * }
         * ```
         *
         * Given a URI like
         * `http://usr:pwd@www.example.com:81/dir/dir.2/index.htm?q1=0&&test1&test2=&test3=value+%28escaped%29&r=1&r=2#top`
         * the returned object will have the following properties:
         *
         * ```js
         * protocol  'http'
         * user      'usr'
         * password  'pwd'
         * host      'www.example.com'
         * port      '81'
         * path      '/dir/dir.2/index.htm'
         * query     {
         *               q1: '0',
         *               test1: null,
         *               test2: '',
         *               test3: 'value (escaped)'
         *               r: ['1', '2']
         *           }
         * fragment  'top'
         * ```
         *
         * (N.b., 'password' is technically not allowed for HTTP URIs, but it is possible with other kinds
         * of URIs.)
         *
         * Parsing based on parseUri 1.2.2 (c) Steven Levithan <http://stevenlevithan.com>, MIT License.
         * <http://stevenlevithan.com/demo/parseuri/js/>
         *
         * @see https://doc.wikimedia.org/mediawiki-core/master/js/#!/api/mw.Uri
         */
        class Uri {
            /**
             * For example `top`
             *
             * @see https://doc.wikimedia.org/mediawiki-core/master/js/#!/api/mw.Uri-property-fragment
             */
            fragment: string | undefined;
            /**
             * For example `www.example.com` (always present)
             *
             * @see https://doc.wikimedia.org/mediawiki-core/master/js/#!/api/mw.Uri-property-host
             */
            host: string;
            /**
             * For example `pwd`
             *
             * @see https://doc.wikimedia.org/mediawiki-core/master/js/#!/api/mw.Uri-property-password
             */
            password: string | undefined;
            /**
             * For example `/dir/dir.2/index.htm` (always present)
             *
             * @see https://doc.wikimedia.org/mediawiki-core/master/js/#!/api/mw.Uri-property-path
             */
            path: string;
            /**
             * For example `81`
             *
             * @see https://doc.wikimedia.org/mediawiki-core/master/js/#!/api/mw.Uri-property-port
             */
            port: string | undefined;
            /**
             * For example `http` (always present)
             *
             * @see https://doc.wikimedia.org/mediawiki-core/master/js/#!/api/mw.Uri-property-protocol
             */
            protocol: string;
            /**
             * For example `{ a: '0', b: '', c: 'value' }` (always present)
             *
             * @see https://doc.wikimedia.org/mediawiki-core/master/js/#!/api/mw.Uri-property-query
             */
            query: QueryParams;
            /**
             * For example `usr`
             *
             * @see https://doc.wikimedia.org/mediawiki-core/master/js/#!/api/mw.Uri-property-user
             */
            user: string | undefined;

            /**
             * Regular expressions to parse many common URIs.
             *
             * These are gnarly expressions. For improved readability, they have been moved to a separate
             * file where they make use of named capture groups. That syntax isn't valid in JavaScript ES5,
             * so the server-side strips these before delivering to the client.
             *
             * @see https://doc.wikimedia.org/mediawiki-core/master/js/#!/api/mw.Uri-static-property-parser
             */
            private static parser: UriParser;

            /**
             * The order here matches the order of captured matches in the `parser` property regexes.
             *
             * @see https://doc.wikimedia.org/mediawiki-core/master/js/#!/api/mw.Uri-static-property-properties
             */
            private static properties: [
                "protocol",
                "user",
                "password",
                "host",
                "port",
                "path",
                "query",
                "fragment"
            ];

            /**
             * Construct a new URI object. Throws error if arguments are illegal/impossible, or
             * otherwise don't parse.
             *
             * @param {Object|string} [uri] URI string, or an Object with appropriate properties (especially
             *  another URI object to clone). Object must have non-blank `protocol`, `host`, and `path`
             *  properties. If omitted (or set to `undefined`, `null` or empty string), then an object
             *  will be created for the default `uri` of this constructor (`location.href` for mw.Uri,
             *  other values for other instances -- see mw.UriRelative for details).
             * @param {Partial<UriOptions>|boolean} [options] Object with options, or (backwards compatibility) a boolean
             *  for strictMode
             * @throws {Error} when the query string or fragment contains an unknown % sequence
             * @see https://doc.wikimedia.org/mediawiki-core/master/js/#!/api/mw.Uri-method-constructor
             */
            constructor(
                uri?: string | Uri | Partial<Record<typeof Uri.properties[number], string>>,
                options?: Partial<UriOptions> | boolean
            );

            /**
             * Clone this URI
             *
             * @returns {Uri} New URI object with same properties
             * @see https://doc.wikimedia.org/mediawiki-core/master/js/#!/api/mw.Uri-method-clone
             */
            clone(): Uri;

            /**
             * Extend the query section of the URI with new parameters.
             *
             * @param {QueryParams} parameters Query parameters to add to ours (or to override ours with) as an
             *  object
             * @returns {Uri} This URI object
             * @see https://doc.wikimedia.org/mediawiki-core/master/js/#!/api/mw.Uri-method-extend
             */
            extend(parameters: QueryParams): Uri;

            /**
             * Get the userInfo, host and port section of the URI.
             *
             * In most real-world URLs this is simply the hostname, but the definition of 'authority' section is more general.
             *
             * @returns {string}
             * @see https://doc.wikimedia.org/mediawiki-core/master/js/#!/api/mw.Uri-method-getAuthority
             */
            getAuthority(): string;

            /**
             * Get host and port section of a URI.
             *
             * @returns {string}
             * @see https://doc.wikimedia.org/mediawiki-core/master/js/#!/api/mw.Uri-method-getHostPort
             */
            getHostPort(): string;

            /**
             * Get the query arguments of the URL, encoded into a string.
             *
             * Does not preserve the original order of arguments passed in the URI. Does handle escaping.
             *
             * @returns {string}
             * @see https://doc.wikimedia.org/mediawiki-core/master/js/#!/api/mw.Uri-method-getQueryString
             */
            getQueryString(): string;

            /**
             * Get everything after the authority section of the URI.
             *
             * @returns {string}
             * @see https://doc.wikimedia.org/mediawiki-core/master/js/#!/api/mw.Uri-method-getRelativePath
             */
            getRelativePath(): string;

            /**
             * Get user and password section of a URI.
             *
             * @returns {string}
             * @see https://doc.wikimedia.org/mediawiki-core/master/js/#!/api/mw.Uri-method-getUserInfo
             */
            getUserInfo(): string;

            /**
             * Get the entire URI string.
             *
             * Note that the output may not be precisely the same as the constructor input,
             * due to order of query arguments.
             * Note also that the fragment is not always roundtripped as-is; some characters will
             * become encoded, including the slash character, which can cause problems with e.g.
             * mediawiki.router. It is recommended to use the native URL class (via
             * web2017-polyfills, which loads a polyfill if needed) in contexts where the fragment
             * is important.
             *
             * @returns {string} The URI string
             * @see https://doc.wikimedia.org/mediawiki-core/master/js/#!/api/mw.Uri-method-toString
             */
            toString(): `${string}://${string}`;

            /**
             * Parse a string and set our properties accordingly.
             *
             * @param {string} str URI, see constructor.
             * @param {Partial<UriOptions>} options See constructor.
             * @throws {Error} when the query string or fragment contains an unknown % sequence
             * @see https://doc.wikimedia.org/mediawiki-core/master/js/#!/api/mw.Uri-method-parse
             */
            private parse(str: string, options: Partial<UriOptions>): void;

            /**
             * Decode a url encoded value.
             *
             * Reversed {@link encode}. Standard decodeURIComponent, with addition of replacing
             * `+` with a space.
             *
             * @param {string} s String to decode
             * @returns {string} Decoded string
             * @throws {Error} when the string contains an unknown % sequence
             * @see https://doc.wikimedia.org/mediawiki-core/master/js/#!/api/mw.Uri-static-method-decode
             */
            static decode(s: string): string;

            /**
             * Encode a value for inclusion in a url.
             *
             * Standard encodeURIComponent, with extra stuff to make all browsers work similarly and more
             * compliant with RFC 3986. Similar to rawurlencode from PHP and our JS library
             * mw.util.rawurlencode, except this also replaces spaces with `+`.
             *
             * @param {string} s String to encode
             * @returns {string} Encoded string for URI
             * @see https://doc.wikimedia.org/mediawiki-core/master/js/#!/api/mw.Uri-static-method-encode
             */
            static encode(s: string): string;
        }
    }
}

export {};
