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
declare namespace mw.loader {
    /**
     * Get the names of all registered ResourceLoader modules.
     *
     * @returns {string[]}
     * @see https://doc.wikimedia.org/mediawiki-core/master/js/#!/api/mw.loader-method-getModuleNames
     */
    function getModuleNames(): string[];

    /**
     * Load a script by URL.
     *
     * Example:
     *
     * ```js
     * mw.loader.getScript(
     *     'https://example.org/x-1.0.0.js'
     * )
     *     .then( function () {
     *         // Script succeeded. You can use X now.
     *     }, function ( e ) {
     *         // Script failed. X is not avaiable
     *         mw.log.error( e.message ); // => "Failed to load script"
     *     } );
     * } );
     * ```
     *
     * @param {string} url Script URL
     * @returns {JQuery.Promise} Resolved when the script is loaded
     * @see https://doc.wikimedia.org/mediawiki-core/master/js/#!/api/mw.loader-method-getScript
     */
    function getScript(url: string): JQuery.Promise<any>;

    /**
     * Execute a function after one or more modules are ready.
     *
     * Use this method if you need to dynamically control which modules are loaded
     * and/or when they loaded (instead of declaring them as dependencies directly
     * on your module.)
     *
     * This uses the same loader as for regular module dependencies. This means
     * ResourceLoader will not re-download or re-execute a module for the second
     * time if something else already needed it. And the same browser HTTP cache,
     * and localStorage are checked before considering to fetch from the network.
     * And any on-going requests from other dependencies or using() calls are also
     * automatically re-used.
     *
     * Example of inline dependency on OOjs:
     *
     * ```js
     * mw.loader.using( 'oojs', function () {
     *     OO.compare( [ 1 ], [ 1 ] );
     * } );
     * ```
     *
     * Example of inline dependency obtained via `require()`:
     *
     * ```js
     * mw.loader.using( [ 'mediawiki.util' ], function ( require ) {
     *     var util = require( 'mediawiki.util' );
     * } );
     * ```
     *
     * Since MediaWiki 1.23 this returns a promise.
     *
     * Since MediaWiki 1.28 the promise is resolved with a `require` function.
     *
     * @param {string|string[]} dependencies Module name or array of modules names the
     *  callback depends on to be ready before executing
     * @param {Function} [ready] Callback to execute when all dependencies are ready
     * @param {Function} [error] Callback to execute if one or more dependencies failed
     * @returns {JQuery.Promise<ModuleRequire>} With a `require` function
     * @see https://doc.wikimedia.org/mediawiki-core/master/js/#!/api/mw.loader-method-using
     */
    function using(
        dependencies: string | string[],
        ready?: (require: ModuleRequire) => void,
        error?: (error: Error, ...args: any[]) => void
    ): JQuery.Promise<ModuleRequire>;
}
