declare namespace mw {
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
     * A Notification object for 1 message.
     *
     * The constructor is not publicly accessible; use {@link mw.notification.notify} instead.
     * This does not insert anything into the document (see {@link start}).
     *
     * @see https://doc.wikimedia.org/mediawiki-core/master/js/#!/api/mw.Notification_
     */
    interface Notification {
        $notification: JQuery;
        autoHideSeconds: number;
        isOpen: boolean;
        isPaused: boolean;
        options: Partial<Notification.Options>;
        timeout: {
            set: typeof setTimeout;
            clear: typeof clearTimeout;
        };

        /**
         * Close the notification.
         *
         * @see https://doc.wikimedia.org/mediawiki-core/master/js/#!/api/mw.Notification_-method-close
         */
        close(): void;

        /**
         * Pause any running auto-hide timer for this notification
         *
         * @see https://doc.wikimedia.org/mediawiki-core/master/js/#!/api/mw.Notification_-method-pause
         */
        pause(): void;

        /**
         * Start autoHide timer if not already started.
         * Does nothing if autoHide is disabled.
         * Either to resume from pause or to make the first start.
         *
         * @see https://doc.wikimedia.org/mediawiki-core/master/js/#!/api/mw.Notification_-method-resume
         */
        resume(): void;

        /**
         * Start the notification. Called automatically by {@link mw.notification.notify}
         * (possibly asynchronously on document-ready).
         *
         * This inserts the notification into the page, closes any matching tagged notifications,
         * handles the fadeIn animations and replacement transitions, and starts autoHide timers.
         *
         * @private
         * @see https://doc.wikimedia.org/mediawiki-core/master/js/#!/api/mw.Notification_-method-start
         */
        start(): void;
    }

    namespace Notification {
        interface Options {
            /**
             * A boolean indicating whether the notification should automatically
             * be hidden after shown. Or if it should persist.
             */
            autoHide: boolean;

            /**
             * Key to {@link mw.notification.autoHideSeconds} for number of seconds for timeout of auto-hide
             * notifications.
             */
            autoHideSeconds: "long" | "short";

            /**
             * An optional string. When a notification is tagged only one message
             * with that tag will be displayed. Trying to display a new notification
             * with the same tag as one already being displayed will cause the other
             * notification to be closed and this new notification to open up inside
             * the same place as the previous notification.
             */
            tag: string | null;

            /**
             * An optional title for the notification. Will be displayed above the
             * content. Usually in bold.
             */
            title: string | null;

            /**
             * An optional string for the type of the message used for styling:
             * Examples: 'info', 'warn', 'error', 'success'.
             */
            type: "error" | "info" | "success" | "warn" | null;

            /**
             * A boolean indicating if the autoHide timeout should be based on
             * time the page was visible to user. Or if it should use wall clock time.
             */
            visibleTimeout: boolean;

            /**
             * HTML ID to set on the notification element.
             */
            id: string | false;

            /**
             * CSS class names in the form of a single string or
             * array of strings, to be set on the notification element.
             */
            classes: string | string[] | false;
        }
    }
}
