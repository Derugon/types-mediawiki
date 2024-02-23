declare namespace mw {
    namespace notification {
        /**
         * Maximum number of simultaneous notifications to start auto-hide timers for.
         * Only this number of notifications being displayed will be auto-hidden at one time.
         * Any additional notifications in the list will only start counting their timeout for
         * auto-hiding after the previous messages have been closed.
         *
         * This basically represents the minimal number of notifications the user should
         * be able to process during the {@link notification.defaults default} {@link autoHideSeconds} time.
         *
         * @see https://doc.wikimedia.org/mediawiki-core/master/js/#!/api/mw.notification-property-autoHideLimit
         */
        const autoHideLimit: number;

        /**
         * @private
         * @see https://doc.wikimedia.org/mediawiki-core/master/js/#!/api/mw.notification-property-autoHideSeconds
         */
        const autoHideSeconds: {
            short: number;
            long: number;
        };

        /**
         * The defaults for notify options parameter.
         *
         * @see https://doc.wikimedia.org/mediawiki-core/master/js/#!/api/mw.notification-property-defaults
         */
        const defaults: Notification.Options;

        /**
         * Pause auto-hide timers for all notifications.
         * Notifications will not auto-hide until resume is called.
         *
         * @see https://doc.wikimedia.org/mediawiki-core/master/js/#!/api/mw.notification-method-pause
         */
        function pause(): void;

        /**
         * Resume any paused auto-hide timers from the beginning.
         * Only the first {@link autoHideLimit} timers will be resumed.
         *
         * @see https://doc.wikimedia.org/mediawiki-core/master/js/#!/api/mw.notification-method-resume
         */
        function resume(): void;

        /**
         * Display a notification message to the user.
         *
         * @param {HTMLElement|HTMLElement[]|JQuery|Message|string} message
         * @param {Partial<Notification.Options>} [options] The options to use for the notification.
         *  See {@link Notification.Options defaults} for details.
         * @returns {Notification} Notification object
         * @see https://doc.wikimedia.org/mediawiki-core/master/js/#!/api/mw.notification-method-notify
         */
        function notify(
            message: string | Message | JQuery | HTMLElement | HTMLElement[],
            options?: Partial<Notification.Options>
        ): Notification;
    }
}
