declare namespace mw {
    interface AnalyticEventCallback {
        (topic: string, data: AnalyticEventData): void;
    }

    /**
     * Empty object for third-party libraries, for cases where you don't
     * want to add a new global, or the global is bad and needs containment
     * or wrapping.
     *
     * @see https://doc.wikimedia.org/mediawiki-core/master/js/#!/api/mw-property-libs
     */
    const libs: Record<string, any>;

    /**
     * OOUI widgets specific to MediaWiki
     *
     * types for mw.widgets are out of scope!
     *
     * @see https://doc.wikimedia.org/mediawiki-core/master/js/source/mediawiki.base.html#mw-property-libs
     */
    const widgets: any;

    /**
     * Format a string. Replace $1, $2 ... $N with positional arguments.
     *
     * Used by {@link Message.parser()}.
     *
     * @since 1.25
     * @param {string} formatString Format string
     * @param {...string} parameters Values for $N replacements
     * @returns {string} Formatted string
     * @see https://doc.wikimedia.org/mediawiki-core/master/js/#!/api/mw-method-format
     */
    function format(formatString: string, ...parameters: string[]): string;

    /**
     * Get a message object.
     *
     * Shortcut for `new mw.Message( mw.messages, key, parameters )`.
     *
     * @param {string} key Key of message to get
     * @param {...any} parameters Values for $N replacements
     * @returns {Message}
     * @see https://doc.wikimedia.org/mediawiki-core/master/js/#!/api/mw-method-message
     */
    function message(key: string, ...parameters: any[]): Message;

    /**
     * Get a message string using the (default) 'text' format.
     *
     * Shortcut for `mw.message( key, parameters... ).text()`.
     *
     * @param {string} key Key of message to get
     * @param {...any} parameters Values for $N replacements
     * @returns {string}
     * @see https://doc.wikimedia.org/mediawiki-core/master/js/#!/api/mw-method-msg
     */
    function msg(key: string, ...parameters: any[]): string;

    /**
     * Display a notification message to the user.
     *
     * @param {HTMLElement|HTMLElement[]|JQuery|Message|string} message
     * @param {Partial<Notification.Options>} [options] The options to use for the notification.
     *  See {@link Notification.Options defaults} for details.
     * @returns {JQuery.Promise<Notification>} Notification object
     * @see https://doc.wikimedia.org/mediawiki-core/master/js/#!/api/mw-method-notify
     */
    function notify(
        message: string | Message | JQuery | HTMLElement | HTMLElement[],
        options?: Partial<Notification.Options>
    ): JQuery.Promise<Notification>;

    /**
     * Register a handler for subset of analytic events, specified by topic.
     *
     * Handlers will be called once for each tracked event, including for any buffered events that
     * fired before the handler was subscribed. The callback is passed a `topic` string, and optional
     * `data` event object. The `this` value for the callback is a plain object with `topic` and
     * `data` properties set to those same values.
     *
     * Example to monitor all topics for debugging:
     *
     * ```js
     * mw.trackSubscribe( '', console.log );
     * ```
     *
     * Example to subscribe to any of `foo.*`, e.g. both `foo.bar` and `foo.quux`:
     *
     * ```js
     * mw.trackSubscribe( 'foo.', console.log );
     * ```
     *
     * @param {string} topic Handle events whose name starts with this string prefix
     * @param {function(string, AnalyticEventData): void} callback Handler to call for each matching tracked event
     * @see https://doc.wikimedia.org/mediawiki-core/master/js/#!/api/mw-method-trackSubscribe
     */
    function trackSubscribe(topic: string, callback: AnalyticEventCallback): void;

    /**
     * Stop handling events for a particular handler
     *
     * @param {function(string, AnalyticEventData): void} callback
     * @see https://doc.wikimedia.org/mediawiki-core/master/js/#!/api/mw-method-trackUnsubscribe
     */
    function trackUnsubscribe(callback: AnalyticEventCallback): void;
}
