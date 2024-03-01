declare namespace mw {
    /**
     * Client for ResourceLoader server end point.
     *
     * This client is in charge of maintaining the module registry and state
     * machine, initiating network (batch) requests for loading modules, as
     * well as dependency resolution and execution of source code.
     *
     * For more information, refer to
     * <https://www.mediawiki.org/wiki/ResourceLoader/Features>
     *
     * @see https://doc.wikimedia.org/mediawiki-core/master/js/#!/api/mw.loader
     */
    namespace loader {
        interface Module {
            exports: any;
        }

        type ModuleKey = `${string}@${string}`;

        type ModuleState =
            | "error"
            | "executing"
            | "loaded"
            | "loading"
            | "missing"
            | "ready"
            | "registered";

        type ModuleMessages = Record<string, string>;
        type ModuleStyle = Record<string, any>;
        type ModuleTemplates = Record<string, any>;

        interface ModuleDeclarator {
            (): [
                module: string,
                script?: ModuleScript | null,
                style?: ModuleStyle | null,
                messages?: ModuleMessages | null,
                templates?: ModuleTemplates | null,
                deprecationWarning?: string | null
            ];
        }

        interface ModuleRequire {
            /**
             * Get the exported value of a module.
             *
             * @param moduleName Module name
             * @returns Exported value
             */
            (moduleName: string): any;
        }

        type ModuleScript =
            | string[]
            | (($: JQuery, jQuery: JQuery, require: ModuleRequire, module: Module) => void)
            | {
                  files: { [key: string]: any };
                  main: string;
              }
            | string;

        interface ModuleRegistryEntry {
            declarator?: ModuleDeclarator | null;
            dependencies: string[];
            deprecationWarning?: string | null;
            group: number | null;
            messages?: ModuleMessages | null;
            module: Module;
            packageExports: any;
            skip: string | null;
            source: string;
            state: "error" | "loaded" | "missing" | "registered" | "ready";
            version: string;
        }

        /**
         * Create a new style element and add it to the DOM.
         *
         * @param {string} text CSS text
         * @param {Node|null} [nextNode] The element where the style tag
         *  should be inserted before
         * @returns {HTMLStyleElement} Reference to the created style element
         * @see https://doc.wikimedia.org/mediawiki-core/master/js/#!/api/mw.loader-method-addStyleTag
         */
        function addStyleTag(text: string, nextNode?: Node | null): HTMLStyleElement;

        /**
         * Get the state of a module.
         *
         * Possible states for the public API:
         *
         * - `registered`: The module is available for loading but not yet requested.
         * - `loading`, `loaded`, or `executing`: The module is currently being loaded.
         * - `ready`: The module was succesfully and fully loaded.
         * - `error`: The module or one its dependencies has failed to load, e.g. due to
         *    uncaught error from the module's script files.
         * - `missing`: The module was requested but is not defined according to the server.
         *
         * @param {string} module Name of module
         * @returns {string|null} The state, or null if the module (or its state) is not
         *  in the registry.
         * @see https://doc.wikimedia.org/mediawiki-core/master/js/#!/api/mw.loader-method-getState
         */
        function getState(module: string): ModuleState | null;

        /**
         * Implement a module given a function which returns the components of the module
         *
         * @param {Function} declarator
         *
         * The declarator should return an array with the following keys:
         *
         * - 0. {string} module Name of module and current module version. Formatted
         *   as '`[name]@[version]`". This version should match the requested version
         *   (from #batchRequest and #registry). This avoids race conditions (T117587).
         *
         * - 1. {ModuleScript} [script] Module code. This can be a function,
         *   a list of URLs to load via `<script src>`, a string for `globalEval()`, or an
         *   object like {"files": {"foo.js":function, "bar.js": function, ...}, "main": "foo.js"}.
         *   If an object is provided, the main file will be executed immediately, and the other
         *   files will only be executed if loaded via require(). If a function or string is
         *   provided, it will be executed/evaluated immediately. If an array is provided, all
         *   URLs in the array will be loaded immediately, and executed as soon as they arrive.
         *
         * - 2. {ModuleStyle} [style] Should follow one of the following patterns:
         *
         *   ```js
         *   { "css": [css, ..] }
         *   { "url": { (media): [url, ..] } }
         *   ```
         *
         *   The reason css strings are not concatenated anymore is T33676. We now check
         *   whether it's safe to extend the stylesheet.
         *
         * - 3. {ModuleMessages} [messages] List of key/value pairs to be added to {@link mw.messages}.
         * - 4. {ModuleTemplates} [templates] List of key/value pairs to be added to {@link mw.templates}.
         * - 5. {String|null} [deprecationWarning] Deprecation warning if any
         *
         * The declarator must not use any scope variables, since it will be serialized with
         * {@link Function.prototype.toString()} and later restored and executed in the global scope.
         *
         * The elements are all optional except the name.
         */
        function impl(declarator: ModuleDeclarator): void;

        /**
         * Implement a module given the components of the module.
         *
         * See {@link impl} for a full description of the parameters.
         *
         * Prior to MW 1.41, this was used internally, but now it is only kept
         * for backwards compatibility.
         *
         * Does not support mw.loader.store caching.
         *
         * @param {string} module
         * @param {ModuleScript} [script] Module code. This can be a function,
         *  a list of URLs to load via `<script src>`, a string for `domEval()`, or an
         *  object like {"files": {"foo.js":function, "bar.js": function, ...}, "main": "foo.js"}.
         *  If an object is provided, the main file will be executed immediately, and the other
         *  files will only be executed if loaded via require(). If a function or string is
         *  provided, it will be executed/evaluated immediately. If an array is provided, all
         *  URLs in the array will be loaded immediately, and executed as soon as they arrive.
         * @param {ModuleStyle} [style] Should follow one of the following patterns:
         *
         * ```js
         * { "css": [css, ..] }
         * { "url": { <media>: [url, ..] } }
         * ```
         *
         * The reason css strings are not concatenated anymore is T33676. We now check
         * whether it's safe to extend the stylesheet.
         * @param {ModuleMessages} [messages] List of key/value pairs to be added to {@link mw.messages}.
         * @param {ModuleTemplates} [templates] List of key/value pairs to be added to {@link mw.templates}.
         * @param {string|null} [deprecationWarning] Deprecation warning if any
         * @see https://doc.wikimedia.org/mediawiki-core/master/js/#!/api/mw.loader-method-implement
         */
        function implement(
            module: string,
            script?: ModuleScript,
            style?: ModuleStyle,
            messages?: ModuleMessages,
            templates?: ModuleTemplates,
            deprecationWarning?: string | null
        ): void;

        /**
         * Load an external script or one or more modules.
         *
         * This method takes a list of unrelated modules. Use cases:
         *
         * - A web page will be composed of many different widgets. These widgets independently
         *   queue their ResourceLoader modules (`OutputPage::addModules()`). If any of them
         *   have problems, or are no longer known (e.g. cached HTML), the other modules
         *   should still be loaded.
         * - This method is used for preloading, which must not throw. Later code that
         *   calls {@link using()} will handle the error.
         *
         * @param {string|string[]} modules Either the name of a module, array of modules,
         *  or a URL of an external script or style
         * @param {string} [type='text/javascript'] MIME type to use if calling with a URL of an
         *  external script or style; acceptable values are "text/css" and
         *  "text/javascript"; if no type is provided, text/javascript is assumed.
         * @throws {Error} If type is invalid
         * @see https://doc.wikimedia.org/mediawiki-core/master/js/#!/api/mw.loader-method-load
         */
        function load(modules: string | string[], type?: "text/css" | "text/javascript"): void;

        /**
         * Register a module, letting the system know about it and its properties.
         *
         * The startup module calls this method.
         *
         * When using multiple module registration by passing an array, dependencies that
         * are specified as references to modules within the array will be resolved before
         * the modules are registered.
         *
         * @param {string|Array} modules Module name or array of arrays, each containing
         *  a list of arguments compatible with this method
         * @param {string|number} [version] Module version hash (falls backs to empty string)
         *  Can also be a number (timestamp) for compatibility with MediaWiki 1.25 and earlier.
         * @param {string[]} [dependencies] Array of module names on which this module depends.
         * @param {string} [group=null] Group which the module is in
         * @param {string} [source='local'] Name of the source
         * @param {string} [skip=null] Script body of the skip function
         * @see https://doc.wikimedia.org/mediawiki-core/master/js/#!/api/mw.loader-method-register
         */
        function register(
            modules: string,
            version?: string | number,
            dependencies?: string[],
            group?: string | null,
            source?: string,
            skip?: string | null
        ): void;
        function register(
            modules: Array<
                [
                    module: string,
                    version?: string | number,
                    dependencies?: Array<string | number>,
                    group?: string | null,
                    source?: string,
                    skip?: string | null
                ]
            >
        ): void;

        /**
         * Change the state of one or more modules.
         *
         * @param {Object.<string, ModuleState>} states Object of module name/state pairs
         * @see https://doc.wikimedia.org/mediawiki-core/master/js/#!/api/mw.loader-method-state
         */
        function state(states: Record<string, ModuleState>): void;

        /**
         * Exposed for testing and debugging only.
         *
         * @private
         * @see https://doc.wikimedia.org/mediawiki-core/master/js/#!/api/mw.loader-property-maxQueryLength
         */
        const maxQueryLength: number;

        /**
         * The module registry is exposed as an aid for debugging and inspecting page
         * state; it is not a public interface for modifying the registry.
         *
         * @private
         * @see https://doc.wikimedia.org/mediawiki-core/master/js/#!/api/mw.loader-property-moduleRegistry
         */
        const moduleRegistry: Record<string, ModuleRegistryEntry>;

        /**
         * Utility function for execute()
         *
         * @private
         * @param {string} url URL
         * @param {string} [media] Media attribute
         * @param {Node|null} [nextNode]
         * @returns {HTMLLinkElement}
         * @see https://doc.wikimedia.org/mediawiki-core/master/js/source/mediawiki.loader.html#global-method-addLinkTag
         */
        function addLinkTag(url: string, media?: string, nextNode?: Node | null): HTMLLinkElement;

        /**
         * Load and execute a script.
         *
         * @private
         * @param {string} src URL to script, will be used as the src attribute in the script tag
         * @param {Function} [callback] Callback to run after request resolution
         * @param {string[]} [modules] List of modules being requested, for state to be marked as error
         * in case the script fails to load
         * @returns {HTMLScriptElement}
         * @see https://doc.wikimedia.org/mediawiki-core/master/js/source/mediawiki.loader.html#mw-loader-method-addScriptTag
         */
        function addScriptTag(
            src: string,
            callback?: () => void,
            modules?: string[]
        ): HTMLScriptElement;

        /**
         * Add one or more modules to the module load queue.
         *
         * See also {@link work()}.
         *
         * @private
         * @param {string[]} dependencies Array of module names in the registry
         * @param {Function} [ready] Callback to execute when all dependencies are ready
         * @param {Function} [error] Callback to execute when any dependency fails
         * @see https://doc.wikimedia.org/mediawiki-core/master/js/#!/api/mw.loader-method-enqueue
         */
        function enqueue(
            dependencies: string[],
            ready?: () => void,
            error?: (error: Error, ...args: any[]) => void
        ): void;

        /**
         * Get the exported value of a module.
         *
         * This static method is publicly exposed for debugging purposes
         * only and must not be used in production code. In production code,
         * please use the dynamically provided `require()` function instead.
         *
         * In case of lazy-loaded modules via {@link mw.loader.using()}, the returned
         * Promise provides the function, see using() for examples.
         *
         * @since 1.27
         * @private
         * @see https://doc.wikimedia.org/mediawiki-core/master/js/#!/api/mw.loader-method-require
         */
        const require: ModuleRequire;

        /**
         * Get names of module that a module depends on, in their proper dependency order.
         *
         * @private
         * @param {string[]} modules Array of string module names
         * @returns {string[]} List of dependencies, including 'module'.
         * @throws {Error} If an unregistered module or a dependency loop is encountered
         * @see https://doc.wikimedia.org/mediawiki-core/master/js/#!/api/mw.loader-method-resolve
         */
        // note: U is required so T is not inferred from the "modules" argument
        function resolve<T extends string, U extends T = T>(modules: U[]): T[];

        /**
         * Start loading of all queued module dependencies.
         *
         * @private
         * @see https://doc.wikimedia.org/mediawiki-core/master/js/#!/api/mw.loader-method-work
         */
        function work(): void;
    }
}
