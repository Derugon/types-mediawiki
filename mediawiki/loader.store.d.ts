/**
 * @see https://doc.wikimedia.org/mediawiki-core/master/js/#!/api/mw.loader.store
 */
declare namespace mw.loader.store {
    interface Stats {
        expired: number;
        failed: number;
        hits: number;
        misses: number;
    }

    /**
     * The localStorage key for the entire module store. The key references
     * $wgDBname to prevent clashes between wikis which share a common host.
     *
     * @property {string}
     * @see https://doc.wikimedia.org/mediawiki-core/master/js/#!/api/mw.loader.store-property-key
     */
    const key: string;

    /**
     * A string containing various factors by which the module cache should vary.
     *
     * Defined by ResourceLoader\StartupModule::getStoreVary() in PHP.
     *
     * @property {string}
     * @see https://doc.wikimedia.org/mediawiki-core/master/js/#!/api/mw.loader.store-property-vary
     */
    const vary: string;

    /**
     * Queue the name of a module that the next update should consider storing.
     *
     * @since 1.32
     * @param {string} module Module name
     * @see https://doc.wikimedia.org/mediawiki-core/master/js/#!/api/mw.loader.store-method-add
     */
    function add(module: string): void;

    /**
     * Clear the entire module store right now.
     *
     * @see https://doc.wikimedia.org/mediawiki-core/master/js/#!/api/mw.loader.store-method-clear
     */
    function clear(): void;

    /**
     * Retrieve a module from the store and update cache hit stats.
     *
     * @param {string} module Module name
     * @returns {string|boolean} Module implementation or false if unavailable
     * @see https://doc.wikimedia.org/mediawiki-core/master/js/#!/api/mw.loader.store-method-get
     */
    function get(module: string): string | false;

    /**
     * Initialize the store.
     *
     * Retrieves store from localStorage and (if successfully retrieved) decoding
     * the stored JSON value to a plain object.
     *
     * @see https://doc.wikimedia.org/mediawiki-core/master/js/#!/api/mw.loader.store-method-init
     */
    function init(): void;

    /**
     * Internal helper for {@link init()}. Separated for ease of testing.
     *
     * @see https://doc.wikimedia.org/mediawiki-core/master/js/#!/api/mw.loader.store-method-load
     */
    function load(): void;

    /**
     * Iterate through the module store, removing any item that does not correspond
     * (in name and version) to an item in the module registry.
     *
     * @see https://doc.wikimedia.org/mediawiki-core/master/js/#!/api/mw.loader.store-method-prune
     */
    function prune(): void;

    /**
     * Construct a JSON-serializable object representing the content of the store.
     *
     * @returns {Object} Module store contents.
     * @see https://doc.wikimedia.org/mediawiki-core/master/js/#!/api/mw.loader.store-method-toJSON
     */
    function toJSON(): { items: string; vary: string; asOf: number };

    /**
     * Whether the store is in use on this page.
     *
     * @see https://doc.wikimedia.org/mediawiki-core/master/js/source/mediawiki.loader.html
     */
    const enabled: boolean | null;

    /**
     * The contents of the store, mapping '[name]@[version]' keys
     * to module implementations.
     *
     * @see https://doc.wikimedia.org/mediawiki-core/master/js/source/mediawiki.loader.html
     */
    const items: Record<ModuleKey, any>;

    /**
     * Names of modules to be stored during the next update.
     *
     * @see https://doc.wikimedia.org/mediawiki-core/master/js/source/mediawiki.loader.html
     */
    const queue: string[];

    /**
     * Cache hit stats
     *
     * @see https://doc.wikimedia.org/mediawiki-core/master/js/source/mediawiki.loader.html
     */
    const stats: Stats;

    /**
     * Add the contents of the named module to the in-memory store.
     *
     * This method does not guarantee that the module will be stored.
     * Inspection of the module's meta data and size will ultimately decide that.
     *
     * This method is considered internal to mw.loader.store and must only
     * be called if the store is enabled.
     *
     * @private
     * @param {string} module Module name
     * @see https://doc.wikimedia.org/mediawiki-core/master/js/#!/api/mw.loader.store-method-set
     */
    function set(module: string): void;

    /**
     * Request a sync of the in-memory store back to persisted localStorage.
     *
     * This function debounces updates. The debouncing logic should account
     * for the following factors:
     *
     * - Writing to localStorage is an expensive operation that must not happen
     *   during the critical path of initialising and executing module code.
     *   Instead, it should happen at a later time after modules have been given
     *   time and priority to do their thing first.
     *
     * - This method is called from {@link mw.loader.store.add()}, which will be called
     *   hundreds of times on a typical page, including within the same call-stack
     *   and eventloop-tick. This is because responses from load.php happen in
     *   batches. As such, we want to allow all modules from the same load.php
     *   response to be written to disk with a single flush, not many.
     *
     * - Repeatedly deleting and creating timers is non-trivial.
     *
     * - localStorage is shared by all pages from the same origin, if multiple
     *   pages are loaded with different module sets, the possibility exists that
     *   modules saved by one page will be clobbered by another. The impact of
     *   this is minor, it merely causes a less efficient cache use, and the
     *   problem would be corrected by subsequent page views.
     *
     * This method is considered internal to mw.loader.store and must only
     * be called if the store is enabled.
     *
     * @private
     * @see https://doc.wikimedia.org/mediawiki-core/master/js/#!/api/mw.loader.store-method-requestUpdate
     */
    function requestUpdate(): void;
}
