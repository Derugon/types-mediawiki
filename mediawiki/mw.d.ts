/**
 * Base library for MediaWiki.
 *
 * Exposed globally as `mw`, with `mediaWiki` as alias.
 *
 * @see https://doc.wikimedia.org/mediawiki-core/master/js/#!/api/mw
 */
declare const mediaWiki: typeof mw;

/**
 * Base library for MediaWiki.
 *
 * Exposed globally as `mw`, with `mediaWiki` as alias.
 *
 * @see https://doc.wikimedia.org/mediawiki-core/master/js/#!/api/mw
 */
declare namespace mw {
    type ObjectAnalyticEventData = Record<string, any>;

    type AnalyticEventData = ObjectAnalyticEventData | number | string | undefined;

    interface ErrorAnalyticEventData extends ObjectAnalyticEventData {
        exception?: any;
        module?: string;
        source: string;
    }

    interface AnalyticEvent {
        topic: string;
        data: AnalyticEventData;
    }

    /**
     * Get the current time, measured in milliseconds since January 1, 1970 (UTC).
     *
     * On browsers that implement the Navigation Timing API, this function will produce
     * floating-point values with microsecond precision that are guaranteed to be monotonic.
     * On all other browsers, it will fall back to using `Date`.
     *
     * @returns {number} Current time
     * @see https://doc.wikimedia.org/mediawiki-core/master/js/#!/api/mw-method-now
     */
    function now(): number;

    /**
     * Schedule a deferred task to run in the background.
     *
     * This allows code to perform tasks in the main thread without impacting
     * time-critical operations such as animations and response to input events.
     *
     * Basic logic is as follows:
     *
     * - User input event should be acknowledged within 100ms per [RAIL].
     * - Idle work should be grouped in blocks of upto 50ms so that enough time
     *   remains for the event handler to execute and any rendering to take place.
     * - Whenever a native event happens (e.g. user input), the deadline for any
     *   running idle callback drops to 0.
     * - As long as the deadline is non-zero, other callbacks pending may be
     *   executed in the same idle period.
     *
     * See also:
     *
     * - <https://developer.mozilla.org/en-US/docs/Web/API/Window/requestIdleCallback>
     * - <https://w3c.github.io/requestidlecallback/>
     * - <https://developers.google.com/web/updates/2015/08/using-requestidlecallback>
     * [RAIL]: https://developers.google.com/web/fundamentals/performance/rail
     *
     * @param {Function} callback
     * @param {Object} [options]
     * @param {number} [options.timeout] If set, the callback will be scheduled for
     *  immediate execution after this amount of time (in milliseconds) if it didn't run
     *  by that time.
     * @see https://doc.wikimedia.org/mediawiki-core/master/js/#!/api/mw-method-requestIdleCallback
     */
    function requestIdleCallback(
        callback: (...args: any[]) => any,
        options?: { timeout?: number }
    ): void;

    /**
     * Track an analytic event.
     *
     * This method provides a generic means for MediaWiki JavaScript code to capture state
     * information for analysis. Each logged event specifies a string topic name that describes
     * the kind of event that it is. Topic names consist of dot-separated path components,
     * arranged from most general to most specific. Each path component should have a clear and
     * well-defined purpose.
     *
     * Data handlers are registered via {@link mw.trackSubscribe}, and receive the full set of
     * events that match their subscription, including buffered events that fired before the handler
     * was subscribed.
     *
     * @param {string} topic Topic name
     * @param {AnalyticEventData} [data] Data describing the event.
     * @see https://doc.wikimedia.org/mediawiki-core/master/js/#!/api/mw-method-track
     */
    function track(topic: string, data?: AnalyticEventData): void;

    /**
     * Track an early error event via mw.track and send it to the window console.
     *
     * @private
     * @param {string} topic Topic name
     * @param {ErrorAnalyticEventData} data Data describing the event, encoded as an object; see {@link errorLogger.logError}
     * @see https://doc.wikimedia.org/mediawiki-core/master/js/#!/api/mw-method-trackError
     */
    function trackError(topic: string, data: ErrorAnalyticEventData): void;

    /**
     * List of all analytic events emitted so far.
     *
     * Exposed only for use by mediawiki.base.
     *
     * @private
     * @see https://doc.wikimedia.org/mediawiki-core/master/js/#!/api/mw-property-trackQueue
     */
    const trackQueue: AnalyticEvent[];
}
