declare namespace mw {
    /**
     * @see https://doc.wikimedia.org/mediawiki-core/master/js/#!/api/mw.Api
     */
    class Api {
        /**
         * Constructor to create an object to interact with the API of a particular MediaWiki server. mw.Api objects represent the API of a particular MediaWiki server.
         *
         * ```js
         * var api = new mw.Api();
         * api.get( {
         *     action: 'query',
         *     meta: 'userinfo'
         * } ).done( function ( data ) {
         *     console.log( data );
         * } );
         * ```
         *
         * Since MW 1.25, multiple values for a parameter can be specified using an array:
         *
         * ```js
         * var api = new mw.Api();
         * api.get( {
         *     action: 'query',
         *     meta: [ 'userinfo', 'siteinfo' ] // same effect as 'userinfo|siteinfo'
         * } ).done( function ( data ) {
         *     console.log( data );
         * } );
         * ```
         *
         * Since MW 1.26, boolean values for a parameter can be specified directly. If the value is false or undefined, the parameter will be omitted from the request, as required by the API.
         *
         * @param {Api.Options} [options]
         * @see https://doc.wikimedia.org/mediawiki-core/master/js/#!/api/mw.Api-method-constructor
         */
        constructor(options?: Partial<Api.Options>);

        private defaults: Api.Options;

        /**
         * Abort all unfinished requests issued by this Api object.
         *
         * @see https://doc.wikimedia.org/mediawiki-core/master/js/#!/api/mw.Api-method-abort
         */
        abort(): void;

        /**
         * Perform API get request.
         *
         * @param {Api.Params} parameters
         * @param {JQuery.AjaxSettings} [ajaxOptions]
         * @returns {JQuery.Promise<Api.Response>}
         * @see https://doc.wikimedia.org/mediawiki-core/master/js/#!/api/mw.Api-method-get
         */
        get(
            parameters: Api.Params,
            ajaxOptions?: JQuery.AjaxSettings
        ): JQuery.Promise<Api.Response>;

        /**
         * Perform API post request.
         *
         * @param {Api.Params} parameters
         * @param {JQuery.AjaxSettings} [ajaxOptions]
         * @returns {JQuery.Promise<Api.Response>}
         * @see https://doc.wikimedia.org/mediawiki-core/master/js/#!/api/mw.Api-method-post
         */
        post(
            parameters: Api.Params,
            ajaxOptions?: JQuery.AjaxSettings
        ): JQuery.Promise<Api.Response>;

        /**
         * Massage parameters from the nice format we accept into a format suitable for the API.
         *
         * @param {Api.Params} parameters (modified in-place)
         * @param {boolean} useUS Whether to use U+001F when joining multi-valued parameters.
         * @see https://doc.wikimedia.org/mediawiki-core/master/js/#!/api/mw.Api-method-preprocessParameters
         */
        private preprocessParameters(parameters: Api.Params, useUS: boolean): void;

        /**
         * Perform the API call.
         *
         * @param {Api.Params} parameters
         * @param {JQuery.AjaxSettings} [ajaxOptions]
         * @returns {JQuery.Promise<Api.Response>} API response data and the jqXHR object
         * @see https://doc.wikimedia.org/mediawiki-core/master/js/#!/api/mw.Api-method-ajax
         */
        ajax(
            parameters: Api.Params,
            ajaxOptions?: JQuery.AjaxSettings
        ): JQuery.Promise<Api.Response>;

        /**
         * Post to API with specified type of token. If we have no token, get one and try to post.
         * If we have a cached token try using that, and if it fails, blank out the
         * cached token and start over. For example to change an user option you could do:
         *
         * ```js
         * new mw.Api().postWithToken( 'csrf', {
         *     action: 'options',
         *     optionname: 'gender',
         *     optionvalue: 'female'
         * } );
         * ```
         *
         * @since 1.22
         * @param {string} tokenType The name of the token, like `options` or `edit`
         * @param {Api.Params} params API parameters
         * @param {JQuery.AjaxSettings} [ajaxOptions]
         * @returns {JQuery.Promise<Api.Response>}
         * @see https://doc.wikimedia.org/mediawiki-core/master/js/#!/api/mw.Api-method-postWithToken
         */
        postWithToken(
            tokenType: Api.TokenType,
            params: Api.Params,
            ajaxOptions?: JQuery.AjaxSettings
        ): JQuery.Promise<Api.Response>;
        /** @deprecated Use "csrf" instead */
        postWithToken(
            tokenType: Api.LegacyTokenType,
            params: Api.Params,
            ajaxOptions?: JQuery.AjaxSettings
        ): JQuery.Promise<Api.Response>;
        postWithToken(
            tokenType: string,
            params: Api.Params,
            ajaxOptions?: JQuery.AjaxSettings
        ): JQuery.Promise<Api.Response>;

        /**
         * Get a token for a certain action from the API.
         *
         * @since 1.22
         * @param {string} type Token type
         * @param {Api.QueryTokensParams|Api.Assert} [additionalParams] Additional parameters for the API (since 1.35). When given a string, it's treated as the `assert` parameter (since 1.25)
         * @returns {JQuery.Promise<string>} Received token
         * @see https://doc.wikimedia.org/mediawiki-core/master/js/#!/api/mw.Api-method-getToken
         */
        getToken(
            type: Api.TokenType,
            additionalParams?: Api.QueryTokensParams | Api.Assert
        ): JQuery.Promise<string>;
        /** @deprecated Use "csrf" instead */
        getToken(
            type: Api.LegacyTokenType,
            additionalParams?: Api.QueryTokensParams | Api.Assert
        ): JQuery.Promise<string>;
        getToken(
            type: string,
            additionalParams?: Api.QueryTokensParams | Api.Assert
        ): JQuery.Promise<string>;

        /**
         * Indicate that the cached token for a certain action of the API is bad.
         *
         * Call this if you get a `badtoken` error when using the token returned by `getToken()`.
         * You may also want to use `postWithToken()` instead, which invalidates bad cached tokens
         * automatically.
         *
         * @since 1.26
         * @param {string} type Token type
         * @see https://doc.wikimedia.org/mediawiki-core/master/js/#!/api/mw.Api-method-badToken
         */
        badToken(type: Api.TokenType): void;
        /** @deprecated Use "csrf" instead */
        badToken(type: Api.LegacyTokenType): void;
        badToken(type: string): void;

        /**
         * Given an API response indicating an error, get a jQuery object containing a human-readable
         * error message that you can display somewhere on the page.
         *
         * For better quality of error messages, it's recommended to use the following options in your
         * API queries:
         *
         * ```js
         * errorformat: 'html',
         * errorlang: mw.config.get( 'wgUserLanguage' ),
         * errorsuselocal: true,
         * ```
         *
         * Error messages, particularly for editing pages, may consist of multiple paragraphs of text.
         * Your user interface should have enough space for that.
         *
         * Example usage:
         *
         * ```js
         * var api = new mw.Api();
         * // var title = 'Test valid title';
         * var title = 'Test invalid title <>';
         * api.postWithToken( 'watch', {
         *     action: 'watch',
         *     title: title
         * } ).then( function ( data ) {
         *     mw.notify( 'Success!' );
         * }, function ( code, data ) {
         *     mw.notify( api.getErrorMessage( data ), { type: 'error' } );
         * } );
         * ```
         *
         * @param {Api.Response} data API response indicating an error
         * @returns {JQuery} Error messages, each wrapped in a `<div>`
         * @see https://doc.wikimedia.org/mediawiki-core/master/js/#!/api/mw.Api-method-getErrorMessage
         */
        getErrorMessage(data: Api.Response): JQuery;

        /**
         * Post to API with csrf token. If we have no token, get one and try to post. If we have a cached token try using that, and if it fails, blank out the cached token and start over.
         *
         * @param {APIParams} params API parameters
         * @param {JQuery.AjaxSettings} [ajaxOptions]
         * @returns {JQuery.Promise<Api.Response>}
         * @see https://doc.wikimedia.org/mediawiki-core/master/js/#!/api/mw.Api.plugin.edit-method-postWithEditToken
         */
        postWithEditToken(
            params: Api.Params,
            ajaxOptions?: JQuery.AjaxSettings
        ): JQuery.Promise<Api.Response>;

        /**
         * API helper to grab a csrf token.
         *
         * @returns {JQuery.Promise<string>} Received token.
         * @see https://doc.wikimedia.org/mediawiki-core/master/js/#!/api/mw.Api.plugin.edit-method-getEditToken
         */
        getEditToken(): JQuery.Promise<string>;

        /**
         * Create a new page.
         *
         * Example:
         *
         * ```js
         * new mw.Api().create( 'Sandbox',
         *     { summary: 'Load sand particles.' },
         *     'Sand.'
         * );
         * ```
         *
         * @since 1.28
         * @param {TitleLike} title Page title
         * @param {Api.EditPageParams} params Edit API parameters
         * @param {string} content Page content
         * @returns {JQuery.Promise<Api.EditResult>} API response
         * @see https://doc.wikimedia.org/mediawiki-core/master/js/#!/api/mw.Api.plugin.edit-method-create
         */
        create(
            title: TitleLike,
            params: Api.EditPageParams,
            content: string
        ): JQuery.Promise<Api.EditResult>;

        /**
         * Edit an existing page.
         *
         * To create a new page, use create() instead.
         *
         * Simple transformation:
         *
         * ```js
         * new mw.Api()
         *     .edit( 'Sandbox', function ( revision ) {
         *         return revision.content.replace( 'foo', 'bar' );
         *     } )
         *     .then( function () {
         *         console.log( 'Saved!' );
         *     } );
         * ```
         *
         * Set save parameters by returning an object instead of a string:
         *
         * ```js
         * new mw.Api().edit(
         *     'Sandbox',
         *     function ( revision ) {
         *         return {
         *             text: revision.content.replace( 'foo', 'bar' ),
         *             summary: 'Replace "foo" with "bar".',
         *             assert: 'bot',
         *             minor: true
         *         };
         *     }
         * )
         * .then( function () {
         *     console.log( 'Saved!' );
         * } );
         * ```
         *
         * Transform asynchronously by returning a promise.
         *
         * ```js
         * new mw.Api()
         *     .edit( 'Sandbox', function ( revision ) {
         *         return Spelling
         *             .corrections( revision.content )
         *             .then( function ( report ) {
         *                 return {
         *                     text: report.output,
         *                     summary: report.changelog
         *                 };
         *             } );
         *     } )
         *     .then( function () {
         *         console.log( 'Saved!' );
         *     } );
         * ```
         *
         * @since 1.28
         * @param {TitleLike} title Page title
         * @param {function(Api.Revision):string|Api.EditPageParams} transform Callback that prepares the edit
         * @returns {JQuery.Promise<Api.EditResult>}
         * @see https://doc.wikimedia.org/mediawiki-core/master/js/#!/api/mw.Api.plugin.edit-method-edit
         */
        edit(
            title: TitleLike,
            transform: (revision: Api.Revision) => string | Api.EditPageParams
        ): JQuery.Promise<Api.EditResult>;

        /**
         * Post a new section to the page.
         *
         * @param {TitleLike} title Target page
         * @param {string} header
         * @param {string} message Wikitext message
         * @param {Api.EditPageParams} additionalParams Additional API parameters
         * @returns {JQuery.Promise<Api.Response>}
         * @see https://doc.wikimedia.org/mediawiki-core/master/js/#!/api/mw.Api.plugin.edit-method-newSection
         */
        newSection(
            title: TitleLike,
            header: string,
            message: string,
            additionalParams?: Api.EditPageParams
        ): JQuery.Promise<Api.Response>;

        /**
         * Get the current user's groups and rights.
         *
         * @since 1.27
         * @returns {JQuery.Promise<User.Info>}
         * @see https://doc.wikimedia.org/mediawiki-core/master/js/#!/api/mw.Api.plugin.user-method-getUserInfo
         */
        getUserInfo(): JQuery.Promise<User.Info>;

        /**
         * Extend an API parameter object with an assertion that the user won't change.
         *
         * This is useful for API calls which create new revisions or log entries. When the current page was loaded when the user was logged in, but at the time of the API call the user is not logged in anymore (e.g. due to session expiry), their IP is recorded in the page history or log, which can cause serious privacy issues. Extending the API parameters via this method ensures that that won't happen, by checking the user's identity that was embedded into the page when it was rendered against the active session on the server.
         *
         * Use it like this: `api.postWithToken( 'csrf', api.assertCurrentUser( { action: 'edit', ... } ) )`. When the assertion fails, the API request will fail, with one of the following error codes:
         * * `apierror-assertanonfailed`: when the client-side logic thinks the user is anonymous but the server thinks it is logged in
         * * `apierror-assertuserfailed`: when the client-side logic thinks the user is logged in but the server thinks it is anonymous
         * * `apierror-assertnameduserfailed`: when both the client-side logic and the server thinks the user is logged in but they see it logged in under a different username.
         *
         * @since 1.27
         * @param {Api.Params} query Query parameters. The object will not be changed
         * @returns {Api.AssertUser}
         * @see https://doc.wikimedia.org/mediawiki-core/master/js/#!/api/mw.Api.plugin.user-method-assertCurrentUser
         */
        assertCurrentUser<T extends Api.Params>(
            query: T
        ): Omit<T, keyof Api.AssertUser> & Api.AssertUser;

        /**
         * Asynchronously save the value of a single user option using the API. See `saveOptions()`.
         *
         * @param {string} name
         * @param {string|null} value
         * @returns {JQuery.Promise<Api.Response>}
         * @see https://doc.wikimedia.org/mediawiki-core/master/js/#!/api/mw.Api.plugin.options-method-saveOption
         */
        saveOption(name: string, value: string | null): JQuery.Promise<Api.Response>;

        /**
         * Asynchronously save the values of user options using the API.
         *
         * If a value of `null` is provided, the given option will be reset to the default value.
         *
         * Any warnings returned by the API, including warnings about invalid option names or values, are ignored. However, do not rely on this behavior.
         *
         * If necessary, the options will be saved using several sequential API requests. Only one promise is always returned that will be resolved when all requests complete.
         *
         * If a request from a previous `saveOptions()` call is still pending, this will wait for it to be completed, otherwise MediaWiki gets sad. No requests are sent for anonymous users, as they would fail anyway. See T214963.
         *
         * @param {Object.<string, string|null>} options Options as a `{ name: value, … }` object
         * @returns {JQuery.Promise<Api.Response>}
         * @see https://doc.wikimedia.org/mediawiki-core/master/js/#!/api/mw.Api.plugin.options-method-saveOptions
         */
        saveOptions(options: Record<string, string | null>): JQuery.Promise<Api.Response>;

        /**
         * Convenience method for `action=watch`.
         *
         * @since 1.35 - expiry parameter can be passed when Watchlist Expiry is enabled
         * @param {TypeOrUnionArray<TitleLike>} pages
         * @param {string} [expiry]
         * @returns {JQuery.Promise<TypeOrUnionArray<Api.WatchStatus>>}
         * @see https://doc.wikimedia.org/mediawiki-core/master/js/#!/api/mw.Api.plugin.watch-method-watch
         */
        watch<P extends TypeOrUnionArray<TitleLike>>(
            pages: P,
            expiry?: string
        ): JQuery.Promise<ReplaceValue<P, TitleLike, Api.WatchStatus>>;

        /**
         * Convenience method for `action=watch&unwatch=1`.
         *
         * @param {TypeOrUnionArray<TitleLike>} pages
         * @returns {JQuery.Promise<TypeOrUnionArray<Api.WatchStatus>>}
         * @see https://doc.wikimedia.org/mediawiki-core/master/js/#!/api/mw.Api.plugin.watch-method-unwatch
         */
        unwatch<P extends TypeOrUnionArray<TitleLike>>(
            pages: P
        ): JQuery.Promise<ReplaceValue<P, TitleLike, Api.WatchStatus>>;

        /**
         * Convenience method for `action=parse`.
         *
         * @param {TitleLike} content Content to parse, either as a wikitext string or a mw.Title
         * @param {Api.ParseParams} [additionalParams] Parameters object to set custom settings, e.g.
         *   redirects, sectionpreview.  prop should not be overridden.
         * @returns {JQuery.Promise<string>} Parsed HTML of `wikitext`.
         * @see https://doc.wikimedia.org/mediawiki-core/master/js/#!/api/mw.Api.plugin.parse-method-parse
         */
        parse(content: TitleLike, additionalParams?: Api.ParseParams): JQuery.Promise<string>;

        /**
         * Get a set of messages.
         *
         * @since 1.27
         * @param {string|string[]} messages Messages to retrieve
         * @param {Api.QueryAllMessagesParams} [options] Additional parameters for the API call
         * @returns {JQuery.Promise<Object.<string, string>>}
         * @see https://doc.wikimedia.org/mediawiki-core/master/js/#!/api/mw.Api.plugin.messages-method-getMessages
         */
        getMessages<T extends string>(
            messages: T | T[],
            options?: Api.QueryAllMessagesParams
        ): JQuery.Promise<Partial<Record<T, string>>>;

        /**
         * Load a set of messages and add them to `mw.messages`.
         *
         * @param {string|string[]} messages Messages to retrieve
         * @param {Api.QueryAllMessagesParams} [options] Additional parameters for the API call
         * @returns {JQuery.Promise<boolean>}
         * @see https://doc.wikimedia.org/mediawiki-core/master/js/#!/api/mw.Api.plugin.messages-method-loadMessages
         */
        loadMessages(
            messages: string | string[],
            options?: Api.QueryAllMessagesParams
        ): JQuery.Promise<boolean>;

        /**
         * Load a set of messages and add them to `mw.messages`. Only messages that are not already known are loaded. If all messages are known, the returned promise is resolved immediately.
         *
         * @since 1.27
         * @param {string[]} messages Messages to retrieve
         * @param {Api.QueryAllMessagesParams} [options] Additional parameters for the API call
         * @returns {JQuery.Promise<boolean>}
         * @see https://doc.wikimedia.org/mediawiki-core/master/js/#!/api/mw.Api.plugin.messages-method-loadMessagesIfMissing
         */
        loadMessagesIfMissing(
            messages: string[],
            options?: Api.QueryAllMessagesParams
        ): JQuery.Promise<boolean>;

        /**
         * Determine if a category exists.
         *
         * @param {TitleLike} title
         * @returns {JQuery.Promise<boolean>}
         * @see https://doc.wikimedia.org/mediawiki-core/master/js/#!/api/mw.Api.plugin.category-method-isCategory
         */
        isCategory(title: TitleLike): JQuery.Promise<boolean>;

        /**
         * Get a list of categories that match a certain prefix.
         *
         * E.g. given "Foo", return "Food", "Foolish people", "Foosball tables"...
         *
         * @param {string} prefix Prefix to match.
         * @returns {JQuery.Promise<string[]>} Matched categories
         * @see https://doc.wikimedia.org/mediawiki-core/master/js/#!/api/mw.Api.plugin.category-method-getCategoriesByPrefix
         */
        getCategoriesByPrefix(prefix: string): JQuery.Promise<string[]>;

        /**
         * Get the categories that a particular page on the wiki belongs to.
         *
         * @param {TitleLike} title
         * @returns {JQuery.Promise<false|Title[]>} List of category titles or false if title was not found
         * @see https://doc.wikimedia.org/mediawiki-core/master/js/#!/api/mw.Api.plugin.category-method-getCategories
         */
        getCategories(title: TitleLike): JQuery.Promise<false | Title[]>;

        /**
         * Convenience method for `action=rollback`.
         *
         * @since 1.28
         * @param {TitleLike} page
         * @param {string} user
         * @param {Api.RollbackParams} [params] Additional parameters
         * @returns {JQuery.Promise<Api.RollbackInfo>}
         * @see https://doc.wikimedia.org/mediawiki-core/master/js/#!/api/mw.Api.plugin.rollback-method-rollback
         */
        rollback(
            page: TitleLike,
            user: string,
            params?: Api.RollbackParams
        ): JQuery.Promise<Api.RollbackInfo>;

        /**
         * Upload a file in several chunks.
         *
         * @param {File} file
         * @param {Api.UploadParams} data Other upload options, see `action=upload` API docs for more
         * @param {number} [chunkSize] Size (in bytes) per chunk (default: 5MB)
         * @param {number} [chunkRetries] Amount of times to retry a failed chunk (default: 1)
         * @returns {JQuery.Promise<Api.Response>}
         * @see https://doc.wikimedia.org/mediawiki-core/master/js/#!/api/mw.Api.plugin.upload-method-chunkedUpload
         */
        chunkedUpload(
            file: File,
            data: Api.UploadParams,
            chunkSize?: number,
            chunkRetries?: number
        ): JQuery.Promise<Api.Response>;

        /**
         * Upload a file to the stash, in chunks.
         *
         * This function will return a promise that will resolve with a function to finish the stash upload.
         *
         * @param {File|HTMLInputElement} file
         * @param {Api.UploadParams} [data]
         * @param {number} [chunkSize] Size (in bytes) per chunk (default: 5MB)
         * @param {number} [chunkRetries] Amount of times to retry a failed chunk (default: 1)
         * @returns {JQuery.Promise<Api.FinishUpload>}
         * @see https://doc.wikimedia.org/mediawiki-core/master/js/#!/api/mw.Api.plugin.upload-method-chunkedUploadToStash
         */
        chunkedUploadToStash(
            file: File | HTMLInputElement,
            data?: Api.UploadParams,
            chunkSize?: number,
            chunkRetries?: number
        ): JQuery.Promise<Api.FinishUpload>;

        /**
         * Upload a file to MediaWiki.
         *
         * The file will be uploaded using AJAX and FormData.
         *
         * @param {File|Blob|HTMLInputElement} file HTML `input type=file` element with a file already inside of it, or a File object.
         * @param {Api.UploadParams} data Other upload options, see `action=upload` API docs for more
         * @returns {JQuery.Promise<Api.Response>}
         * @see https://doc.wikimedia.org/mediawiki-core/master/js/#!/api/mw.Api.plugin.upload-method-upload
         */
        upload(
            file: File | Blob | HTMLInputElement,
            data: Api.UploadParams
        ): JQuery.Promise<Api.Response>;

        /**
         * Finish an upload in the stash.
         *
         * @param {string} filekey
         * @param {Api.UploadParams} data
         * @returns {JQuery.Promise<Api.Response>}
         * @see https://doc.wikimedia.org/mediawiki-core/master/js/#!/api/mw.Api.plugin.upload-method-uploadFromStash
         */
        uploadFromStash(filekey: string, data: Api.UploadParams): JQuery.Promise<Api.Response>;

        /**
         * Upload a file to the stash.
         *
         * This function will return a promise that will resolve with a function to finish the stash upload. You can call that function with an argument containing more, or conflicting, data to pass to the server. For example:
         *
         * ```js
         * // upload a file to the stash with a placeholder filename
         * api.uploadToStash( file, { filename: 'testing.png' } ).done( function ( finish ) {
         *     // finish is now the function we can use to finalize the upload
         *     // pass it a new filename from user input to override the initial value
         *     finish( { filename: getFilenameFromUser() } ).done( function ( data ) {
         *         // the upload is complete, data holds the API response
         *     } );
         * } );
         * ```
         *
         * @param {File|HTMLInputElement} file
         * @param {Api.UploadParams} [data]
         * @returns {JQuery.Promise<Api.FinishUpload>}
         * @see https://doc.wikimedia.org/mediawiki-core/master/js/#!/api/mw.Api.plugin.upload-method-uploadToStash
         */
        uploadToStash(
            file: File | HTMLInputElement,
            data?: Api.UploadParams
        ): JQuery.Promise<Api.FinishUpload>;

        /**
         * @param {string} username
         * @param {string} password
         * @returns {JQuery.Promise<Api.Response>}
         * @see https://doc.wikimedia.org/mediawiki-core/master/js/#!/api/mw.Api.plugin.login-method-login
         */
        login(username: string, password: string): JQuery.Promise<Api.Response>;
    }

    namespace Api {
        type timestamp = string;
        type expiry = string;
        type namespace = number;
        type limit = number | "max";
        type password = string;
        type upload = File; // XXX
        type OneOrMore<T> = T | T[];

        type Assert = "anon" | "bot" | "user";

        type TokenType =
            | "createaccount"
            | "csrf"
            | "deleteglobalaccount"
            | "login"
            | "patrol"
            | "rollback"
            | "setglobalaccountstatus"
            | "userrights"
            | "watch";

        type LegacyTokenType =
            | "block"
            | "delete"
            | "edit"
            | "email"
            | "import"
            | "move"
            | "options"
            | "protect"
            | "unblock";

        interface Params {
            action?: string;
            format?: "json" | "jsonfm" | "xml" | "xmlfm" | "php" | "none";
            maxlag?: number;
            smaxage?: number;
            maxage?: number;
            assert?: "user" | "bot" | "anon";
            assertuser?: string;
            requestid?: string;
            servedby?: boolean;
            curtimestamp?: boolean;
            responselanginfo?: boolean;
            origin?: string;
            uselang?: string;
            errorformat?: "bc" | "html" | "none" | "plaintext" | "raw" | "wikitext";
            errorlang?: string;
            errorsuselocal?: boolean;
            centralauthtoken?: string;

            // format=json
            callback?: string;
            utf8?: boolean;
            ascii?: boolean;
            formatversion?: "1" | "2" | "latest";
        }

        // it will always be a JSON object, the rest is uncertain ...
        type Response = Record<string, any>;

        interface Revision {
            content: string;
            timestamp: string;
        }

        type EditResult = EditFailureResult | EditNoChangeResult | EditChangedResult;

        interface EditFailureResult {
            result: "Failure";
        }

        interface EditSuccessResult {
            contentmodel: string | false;
            pageid: number;
            result: "Success";
            tempusercreated?: true;
            tempusercreatedredirect?: string;
            title: string;
            watched?: true;
            watchlistexpiry?: string;
        }

        interface EditNoChangeResult extends EditSuccessResult {
            nochange: true;
        }

        interface EditChangedResult extends EditSuccessResult {
            oldrevid: number;
            newrevid: number;
            newtimestamp: string;
        }

        interface AssertUser {
            assert: "anon" | "user";
            assertUser: string;
        }

        interface WatchStatus {
            ns: number;
            title: string;
            watched: boolean;
        }

        interface RollbackInfo {
            /**
             * The revision being restored (the last revision before revision(s) by the reverted user).
             */
            last_revid: number;
            /**
             * The revision being reverted (previously the current revision of the page).
             */
            old_revid: number;
            pageid: number;
            revid: number;
            summary: string;
            title: string;
        }

        interface FinishUpload {
            /**
             * Call this function to finish the upload.
             */
            (data?: UploadParams): JQuery.Promise<Response>;
        }

        /**
         * Default options for {@link jQuery.ajax} calls. Can be overridden by passing
         * `options` to {@link mw.Api} constructor.
         *
         * @see https://doc.wikimedia.org/mediawiki-core/master/js/#!/api/mw.Api-property-defaultOptions
         */
        interface Options {
            /**
             * Default query parameters for API requests
             */
            parameters: Params;
            /**
             * Default options for {@link jQuery.ajax}
             */
            ajax: JQuery.AjaxSettings;
            /**
             * Whether to use U+001F when joining multi-valued parameters (since 1.28).
             * Default is true if ajax.url is not set, false otherwise for compatibility.
             */
            useUS?: boolean;
        }
    }
}
