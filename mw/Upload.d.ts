import { ApiResponse, FinishUpload } from "./Api";

declare global {
    namespace mw {
        /**
         * Upload to a wiki. Most of the functionality is implemented
         * in {@link mw.Api.upload} and friends, but this model class will tie it
         * together as well as let you perform actions in a logical way.
         *
         * A simple example:
         *
         * ```js
         * var file = new OO.ui.SelectFileInputWidget(),
         *     button = new OO.ui.ButtonWidget( { label: 'Save' } ),
         *     upload = new mw.Upload;
         *
         * button.on( 'click', () => {
         *     upload.setFile( file.getValue() );
         *     upload.setFilename( file.getValue().name );
         *     upload.upload();
         * } );
         *
         * $( document.body ).append( file.$element, button.$element );
         * ```
         *
         * You can also choose to {@link uploadToStash stash the upload} and
         * {@link finishStashUpload finalize} it later:
         *
         * ```js
         * var file, // Some file object
         *     upload = new mw.Upload,
         *     stashPromise = $.Deferred();
         *
         * upload.setFile( file );
         * upload.uploadToStash().then( () => {
         *     stashPromise.resolve();
         * } );
         *
         * stashPromise.then( () => {
         *     upload.setFilename( 'foo' );
         *     upload.setText( 'bar' );
         *     upload.finishStashUpload().then( () => {
         *         console.log( 'Done!' );
         *     } );
         * } );
         * ```
         *
         * @see https://doc.wikimedia.org/mediawiki-core/master/js/mw.Upload.html
         */
        class Upload {
            static static: {};

            /**
             * Used to represent an upload in progress on the frontend.
             *
             * @param apiconfig A mw.Api object (or subclass), or configuration
             *     to pass to the constructor of mw.Api.
             * @see https://doc.wikimedia.org/mediawiki-core/master/js/mw.Upload.html#Upload
             */
            constructor(apiconfig?: Api | Api.Options);

            /**
             * Finish a stash upload.
             *
             * @see https://doc.wikimedia.org/mediawiki-core/master/js/mw.Upload.html#finishStashUpload
             */
            finishStashUpload(): Api.Promise<
                [ApiResponse],
                Api.RejectArgTuple | [string, ApiResponse]
            >;

            /**
             * Get the mw.Api instance used by this Upload object.
             *
             * @see https://doc.wikimedia.org/mediawiki-core/master/js/mw.Upload.html#getApi
             */
            getApi(): JQuery.Promise<Api>;

            /**
             * Gets the base filename from a path name.
             *
             * @see https://doc.wikimedia.org/mediawiki-core/master/js/mw.Upload.html#getBasename
             */
            getBasename(path: string): string;

            /**
             * Get the current value of the edit comment for the upload.
             *
             * @see https://doc.wikimedia.org/mediawiki-core/master/js/mw.Upload.html#getComment
             */
            getComment(): string;

            /**
             * Get the file being uploaded.
             *
             * @see https://doc.wikimedia.org/mediawiki-core/master/js/mw.Upload.html#getFile
             */
            getFile(): HTMLInputElement | File | Blob;

            /**
             * Get the filename, to be finalized on upload.
             *
             * @see https://doc.wikimedia.org/mediawiki-core/master/js/mw.Upload.html#getFilename
             */
            getFilename(): string;

            /**
             * Get the imageinfo object for the finished upload.
             * Only available once the upload is finished! Don't try to get it
             * beforehand.
             *
             * @see https://doc.wikimedia.org/mediawiki-core/master/js/mw.Upload.html#getImageInfo
             */
            getImageInfo(): ApiResponse | undefined;

            /**
             * Gets the state of the upload.
             *
             * @see https://doc.wikimedia.org/mediawiki-core/master/js/mw.Upload.html#getState
             */
            getState(): Upload.State;

            /**
             * Gets details of the current state.
             *
             * @see https://doc.wikimedia.org/mediawiki-core/master/js/mw.Upload.html#getStateDetails
             */
            getStateDetails(): any;

            /**
             * Get the text of the file page, to be created on file upload.
             *
             * @see https://doc.wikimedia.org/mediawiki-core/master/js/mw.Upload.html#getText
             */
            getText(): string;

            /**
             * Get the boolean for whether the file will be watchlisted after upload.
             *
             * @see https://doc.wikimedia.org/mediawiki-core/master/js/mw.Upload.html#getWatchlist
             */
            getWatchlist(): boolean;

            /**
             * Set the edit comment for the upload.
             *
             * @see https://doc.wikimedia.org/mediawiki-core/master/js/mw.Upload.html#setComment
             */
            setComment(comment: string): void;

            /**
             * Set the file to be uploaded.
             *
             * @see https://doc.wikimedia.org/mediawiki-core/master/js/mw.Upload.html#setFile
             */
            setFile(file: HTMLInputElement | File | Blob): void;

            /**
             * Set the stashed file to finish uploading.
             *
             * @see https://doc.wikimedia.org/mediawiki-core/master/js/mw.Upload.html#setFilekey
             */
            setFilekey(filekey: string): void;

            /**
             * Set the filename, to be finalized on upload.
             *
             * @see https://doc.wikimedia.org/mediawiki-core/master/js/mw.Upload.html#setFilename
             */
            setFilename(filename: string): void;

            /**
             * Sets the filename based on the filename as it was on the upload.
             *
             * @see https://doc.wikimedia.org/mediawiki-core/master/js/mw.Upload.html#setFilenameFromFile
             */
            setFilenameFromFile(): void;

            /**
             * Sets the state and state details (if any) of the upload.
             *
             * @see https://doc.wikimedia.org/mediawiki-core/master/js/mw.Upload.html#setState
             */
            setState(state: Upload.State, stateDetails: any): void;

            /**
             * Set the text of the file page, to be created on file upload.
             *
             * @see https://doc.wikimedia.org/mediawiki-core/master/js/mw.Upload.html#setText
             */
            setText(text: string): void;

            /**
             * Set whether the file should be watchlisted after upload.
             *
             * @see https://doc.wikimedia.org/mediawiki-core/master/js/mw.Upload.html#setWatchlist
             */
            setWatchlist(watchlist: boolean): void;

            /**
             * Upload the file directly.
             *
             * @see https://doc.wikimedia.org/mediawiki-core/master/js/mw.Upload.html#upload
             */
            upload(): Upload.Promise;

            /**
             * Upload the file to the stash to be completed later.
             *
             * @see https://doc.wikimedia.org/mediawiki-core/master/js/mw.Upload.html#uploadToStash
             */
            uploadToStash(): Upload.Promise<[FinishUpload]>;
        }

        namespace Upload {
            /**
             * State of uploads represented in simple terms.
             *
             * @see https://doc.wikimedia.org/mediawiki-core/master/js/mw.Upload.html#.State
             */
            enum State {
                /**
                 * Upload not yet started.
                 */
                NEW,

                /**
                 * Upload finished, but there was a warning.
                 */
                WARNING,

                /**
                 * Upload finished, but there was an error.
                 */
                ERROR,

                /**
                 * Upload in progress.
                 */
                UPLOADING,

                /**
                 * Upload finished, but not published, call {@link Upload.finishStashUpload finishStashUpload}.
                 */
                STASHED,

                /**
                 * Upload finished and published.
                 */
                UPLOADED,
            }

            namespace BookletLayout {
                interface ConfigOptions extends OO.ui.BookletLayout.ConfigOptions {
                    /**
                     * Overlay to use for widgets in the booklet.
                     */
                    $overlay?: JQuery;
                    /**
                     * Sets the stashed file to finish uploading. Overrides most of the file
                     * selection process, and fetches a thumbnail from the server.
                     */
                    filekey?: string;
                }

                interface EventMap {
                    fileSaved: [imageInfo: ApiResponse];
                    fileUploadProgress: [progress: number];
                    fileUploaded: [];
                    infoValid: [isValid: boolean];
                    uploadValid: [isValid: boolean];
                }

                type Static = OO.ui.BookletLayout.Static;

                interface Props extends OO.ui.BookletLayout.Props {
                    /**
                     * The form rendered in the second step to get metadata.
                     * Rendered in {@link BookletLayout.renderInfoForm renderInfoForm}.
                     *
                     * @see https://doc.wikimedia.org/mediawiki-core/master/js/mw.Upload.BookletLayout.html#infoForm
                     */
                    infoForm: OO.ui.FormLayout;

                    /**
                     * The form rendered in the third step to show usage.
                     * Rendered in {@link BookletLayout.renderInsertForm renderInsertForm}.
                     *
                     * @see https://doc.wikimedia.org/mediawiki-core/master/js/mw.Upload.BookletLayout.html#insertForm
                     */
                    insertForm: OO.ui.FormLayout;

                    /**
                     * The form rendered in the first step to get the file object.
                     * Rendered in {@link BookletLayout.renderUploadForm renderUploadForm}.
                     *
                     * @see https://doc.wikimedia.org/mediawiki-core/master/js/mw.Upload.BookletLayout.html#uploadForm
                     */
                    uploadForm: OO.ui.FormLayout;
                }

                interface Prototype extends OO.ui.BookletLayout.Prototype {
                    /**
                     * Initialize for a new upload.
                     *
                     * @returns Promise resolved when everything is initialized.
                     * @see https://doc.wikimedia.org/mediawiki-core/master/js/mw.Upload.BookletLayout.html#initialize
                     */
                    initialize(): JQuery.Promise<void>;

                    /**
                     * Gets the widget for displaying or inputting the file to upload.
                     *
                     * @see https://doc.wikimedia.org/mediawiki-core/master/js/mw.Upload.BookletLayout.html#getFileWidget
                     */
                    getFileWidget(): OO.ui.SelectFileInputWidget | mw.widgets.StashedFileWidget;

                    /**
                     * Clear the values of all fields.
                     *
                     * @protected
                     * @see https://doc.wikimedia.org/mediawiki-core/master/js/mw.Upload.BookletLayout.html#clear
                     */
                    clear(): void;

                    /**
                     * Create a new upload model.
                     *
                     * @protected
                     * @returns Upload model.
                     * @see https://doc.wikimedia.org/mediawiki-core/master/js/mw.Upload.BookletLayout.html#createUpload
                     */
                    createUpload(): Upload;

                    /**
                     * Get an error message (as {@link OO.ui.Error} object) that should be displayed
                     * to the user for current state and state details.
                     *
                     * @protected
                     * @returns A Promise that will be resolved with an {@link OO.ui.Error}.
                     * @see https://doc.wikimedia.org/mediawiki-core/master/js/mw.Upload.BookletLayout.html#getErrorMessageForStateDetails
                     */
                    getErrorMessageForStateDetails(): JQuery.Promise<OO.ui.Error> | undefined;

                    /**
                     * Gets the file object from the
                     * {@link BookletLayout.Props.uploadForm upload form}.
                     *
                     * @protected
                     * @see https://doc.wikimedia.org/mediawiki-core/master/js/mw.Upload.BookletLayout.html#getFile
                     */
                    getFile(): File | null;

                    /**
                     * Gets the file name from the
                     * {@link BookletLayout.Props.infoForm information form}.
                     *
                     * @protected
                     * @see https://doc.wikimedia.org/mediawiki-core/master/js/mw.Upload.BookletLayout.html#getFilename
                     */
                    getFilename(): string;

                    /**
                     * Gets the page text from the
                     * {@link BookletLayout.Props.infoForm information form}.
                     *
                     * @protected
                     * @see https://doc.wikimedia.org/mediawiki-core/master/js/mw.Upload.BookletLayout.html#getText
                     */
                    getText(): string;

                    /**
                     * Handle change events to the info form.
                     *
                     * @protected
                     * @see https://doc.wikimedia.org/mediawiki-core/master/js/mw.Upload.BookletLayout.html#onInfoFormChange
                     */
                    onInfoFormChange(): void;

                    /**
                     * Handle change events to the upload form.
                     *
                     * @protected
                     * @see https://doc.wikimedia.org/mediawiki-core/master/js/mw.Upload.BookletLayout.html#onUploadFormChange
                     */
                    onUploadFormChange(): void;

                    /**
                     * Renders and returns the information form for collecting metadata and sets the
                     * {@link BookletLayout.Props.infoForm infoForm} property.
                     *
                     * @protected
                     * @see https://doc.wikimedia.org/mediawiki-core/master/js/mw.Upload.BookletLayout.html#renderInfoForm
                     */
                    renderInfoForm(): OO.ui.FormLayout;

                    /**
                     * Renders and returns the insert form to show file usage and sets the
                     * {@link BookletLayout.Props.insertForm insertForm} property.
                     *
                     * @protected
                     * @see https://doc.wikimedia.org/mediawiki-core/master/js/mw.Upload.BookletLayout.html#renderInsertForm
                     */
                    renderInsertForm(): OO.ui.FormLayout;

                    /**
                     * Renders and returns the upload form and sets the
                     * {@link BookletLayout.Props.uploadForm uploadForm} property.
                     *
                     * @protected
                     * @see https://doc.wikimedia.org/mediawiki-core/master/js/mw.Upload.BookletLayout.html#renderUploadForm
                     */
                    renderUploadForm(): OO.ui.FormLayout;

                    /**
                     * Saves the stash finalizes upload. Uses {@link getFilename}, and
                     * {@link getText} to get details from the form.
                     *
                     * @protected
                     * @returns Rejects the promise with an {@link OO.ui.Error error}, or resolves
                     *  if the upload was successful.
                     * @see https://doc.wikimedia.org/mediawiki-core/master/js/mw.Upload.BookletLayout.html#saveFile
                     */
                    saveFile(): JQuery.Promise<void, OO.ui.Error>;

                    /**
                     * Sets the file object.
                     *
                     * @protected
                     * @param file File to select.
                     * @see https://doc.wikimedia.org/mediawiki-core/master/js/mw.Upload.BookletLayout.html#setFile
                     */
                    setFile(file: File | null): void;

                    /**
                     * Sets the filekey of a file already stashed on the server as the target of
                     * this upload operation.
                     *
                     * @protected
                     * @see https://doc.wikimedia.org/mediawiki-core/master/js/mw.Upload.BookletLayout.html#setFilekey
                     */
                    setFilekey(filekey: string): void;

                    /**
                     * Prefills the {@link BookletLayout.Props.infoForm information form} with the
                     * given filename.
                     *
                     * @protected
                     * @see https://doc.wikimedia.org/mediawiki-core/master/js/mw.Upload.BookletLayout.html#setFilename
                     */
                    setFilename(filename: string): void;

                    /**
                     * Updates the file preview on the info form when a file is added.
                     *
                     * @protected
                     * @see https://doc.wikimedia.org/mediawiki-core/master/js/mw.Upload.BookletLayout.html#updateFilePreview
                     */
                    updateFilePreview(): void;

                    /**
                     * Uploads the file that was added in the upload form. Uses {@link getFile} to
                     * get the HTML5 file object.
                     *
                     * @protected
                     * @see https://doc.wikimedia.org/mediawiki-core/master/js/mw.Upload.BookletLayout.html#uploadFile
                     */
                    uploadFile(): JQuery.Promise<void, OO.ui.Error>;

                    // #region EventEmitter overloads
                    on<K extends keyof EventMap, A extends OO.ArgTuple = [], C = null>(
                        event: K,
                        method: OO.EventHandler<
                            C,
                            (this: C, ...args: [...A, ...EventMap[K]]) => void
                        >,
                        args?: A,
                        context?: C
                    ): this;
                    on<K extends string, C = null>(
                        event: K extends keyof EventMap ? never : K,
                        method: OO.EventHandler<C>,
                        args?: any[],
                        context?: C
                    ): this;

                    once<K extends keyof EventMap>(
                        event: K,
                        listener: (this: null, ...args: EventMap[K]) => void
                    ): this;
                    once<K extends string>(
                        event: K extends keyof EventMap ? never : K,
                        listener: (this: null, ...args: any[]) => void
                    ): this;

                    off<K extends keyof EventMap, C = null>(
                        event: K,
                        method?: OO.EventHandler<C, (this: C, ...args: EventMap[K]) => void>,
                        context?: C
                    ): this;
                    off<K extends string, C = null>(
                        event: K extends keyof EventMap ? never : K,
                        method?: OO.EventHandler<C>,
                        context?: C
                    ): this;

                    emit<K extends keyof EventMap>(event: K, ...args: EventMap[K]): boolean;
                    emit<K extends string>(
                        event: K extends keyof EventMap ? never : K,
                        ...args: any[]
                    ): boolean;

                    emitThrow<K extends keyof EventMap>(event: K, ...args: EventMap[K]): boolean;
                    emitThrow<K extends string>(
                        event: K extends keyof EventMap ? never : K,
                        ...args: any[]
                    ): boolean;
                    connect<T extends Partial<Record<keyof EventMap, any>>, C>(
                        context: C,
                        methods: OO.EventConnectionMap<T, C, EventMap>
                    ): this;

                    disconnect<T extends Partial<Record<keyof EventMap, any>>, C>(
                        context: C,
                        methods?: OO.EventConnectionMap<T, C, EventMap>
                    ): this;
                    // #endregion
                }

                interface Constructor {
                    /**
                     * Create an instance of {@link mw.Upload.BookletLayout}.
                     *
                     * @param config Configuration options.
                     * @see https://doc.wikimedia.org/mediawiki-core/master/js/mw.Upload.BookletLayout.html#BookletLayout
                     */
                    new (config?: ConfigOptions): mw.Upload.BookletLayout;
                    prototype: Prototype;
                    static: Static;
                    super: OO.ui.BookletLayout.Constructor;
                    /** @deprecated Use `super` instead */
                    parent: OO.ui.BookletLayout.Constructor;
                }
            }

            /**
             *  Encapsulates the process of uploading a file
             * to MediaWiki using the {@link mw.Upload upload model}.
             * The booklet emits events that can be used to get the stashed
             * upload and the final file. It can be extended to accept
             * additional fields from the user for specific scenarios like
             * for Commons, or campaigns.
             *
             * ## Structure
             *
             * The {@link OO.ui.BookletLayout booklet layout} has three steps:
             *
             * - **Upload**: Has a {@link OO.ui.SelectFileInputWidget field} to get the file
             *   object.
             *
             * - **Information**: Has a {@link OO.ui.FormLayout form} to collect metadata. This can
             *   be extended.
             *
             * - **Insert**: Has details on how to use the file that was uploaded.
             *
             * Each step has a form associated with it defined in {@link renderUploadForm},
             * {@link renderInfoForm}, and {@link renderInfoForm}. The {@link getFile},
             * {@link getFilename}, and {@link getText} methods are used to get the information
             * filled in these forms, required to call
             * {@link mw.Upload}.
             *
             * ## Usage
             *
             * See the {@link Dialog upload dialog}.
             *
             * The {@link mw.Upload.BookletLayout.event:fileUploaded fileUploaded},
             * and {@link mw.Upload.BookletLayout.event:fileSaved fileSaved} events can
             * be used to get details of the upload.
             *
             * ## Extending
             *
             * To extend using {@link mw.Upload}, override {@link renderInfoForm} to render the form
             * required for the specific use-case. Update the {@link getFilename}, and
             * {@link getText} methods to return data from your newly created form. If you added new
             * fields you'll also have to update the {@link clear} method.
             *
             * If you plan to use a different upload model, apart from what is mentioned
             * above, you'll also have to override the
             * {@link mw.Upload.BookletLayout#createUpload createUpload} method to
             * return the new model. The {@link #saveFile saveFile}, and
             * the {@link mw.Upload.BookletLayout#uploadFile uploadFile} methods need to be
             * overridden to use the new model and data returned from the forms.
             *
             * @see https://doc.wikimedia.org/mediawiki-core/master/js/mw.Upload.BookletLayout.html
             */
            interface BookletLayout extends BookletLayout.Props, BookletLayout.Prototype {}
            const BookletLayout: BookletLayout.Constructor;
        }
    }
}

export {};
