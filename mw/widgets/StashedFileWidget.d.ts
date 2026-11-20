declare global {
    namespace mw.widgets {
        namespace StashedFileWidget {
            interface ConfigOptions
                extends OO.ui.Widget.ConfigOptions,
                    OO.ui.mixin.IconElement.ConfigOptions,
                    OO.ui.mixin.LabelElement.ConfigOptions,
                    OO.ui.mixin.PendingElement.ConfigOptions {
                /**
                 * API to use for thumbnails.
                 */
                api?: mw.Api;
                /**
                 * The filekey of the stashed file.
                 */
                filekey?: string;
            }

            interface Static
                extends OO.ui.Widget.Static,
                    OO.ui.mixin.IconElement.Static,
                    OO.ui.mixin.LabelElement.Static {}

            interface Props
                extends OO.ui.Widget.Props,
                    OO.ui.mixin.IconElement.Props,
                    OO.ui.mixin.LabelElement.Props,
                    OO.ui.mixin.PendingElement.Props {}

            interface Prototype
                extends OO.ui.Widget.Prototype,
                    OO.ui.mixin.IconElement.Prototype,
                    OO.ui.mixin.LabelElement.Prototype,
                    OO.ui.mixin.PendingElement.Prototype {
                /**
                 * Get the current filekey.
                 *
                 * @see https://doc.wikimedia.org/mediawiki-core/master/js/mw.widgets.StashedFileWidget.html#getValue
                 */
                getValue(): string | null;

                loadAndGetImageUrl(): Api.Promise<
                    [url: string, mime: string],
                    Api.RejectArgTuple | [string]
                >;

                /**
                 * Set the filekey.
                 *
                 * @see https://doc.wikimedia.org/mediawiki-core/master/js/mw.widgets.StashedFileWidget.html#setValue
                 */
                setValue(filekey: string | null): void;

                updateUI(): void;
            }

            interface Constructor {
                /**
                 * @param config Configuration options.
                 * @see https://doc.wikimedia.org/mediawiki-core/master/js/mw.widgets.StashedFileWidget.html#StashedFileWidget
                 */
                new (config?: ConfigOptions): StashedFileWidget;
                prototype: Prototype;
                static: Static;
                super: StashedFileWidget.Constructor;
                /** @deprecated Use `super` instead */
                parent: StashedFileWidget.Constructor;
            }
        }

        /**
         * Accepts a stashed file and displays the information for purposes of
         * publishing the file at the behest of the user.
         *
         * Note that this widget will not finish an upload for you. Use {@link mw.Upload}
         * and {@link mw.Upload.setFilekey}, then {@link mw.Upload.finishStashUpload} to accomplish
         * that.
         *
         * @example
         * ```js
         * const widget = new mw.widgets.StashedFileWidget( {
         *     filekey: '12r9e4rugeec.ddtmmp.1.jpg',
         * } );
         *
         * widget.getValue(); // '12r9e4rugeec.ddtmmp.1.jpg'
         * widget.setValue( '12r9epfbnskk.knfiy7.1.jpg' );
         * widget.getValue(); // '12r9epfbnskk.knfiy7.1.jpg'
         * ```
         * @since 1.27
         * @see https://doc.wikimedia.org/mediawiki-core/master/js/mw.widgets.StashedFileWidget.html
         */
        interface StashedFileWidget extends StashedFileWidget.Props, StashedFileWidget.Prototype {}
        const StashedFileWidget: StashedFileWidget.Constructor;
    }
}

export {};
