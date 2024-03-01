/**
 * CollapsibleTabsPlugin used in MediaWiki vector skin
 * Copied from https://gerrit.wikimedia.org/r/plugins/gitiles/mediawiki/skins/Vector/+/master/resources/CollapsibleTabsPlugin.d.ts
 */

interface JQueryStatic {
    collapsibleTabs: JQuery.CollapsibleTabs.Static;
}

interface JQuery {
    collapsibleTabs(options: Partial<JQuery.CollapsibleTabs.Options>): void;
}

declare namespace JQuery {
    interface CollapsibleTabs extends CollapsibleTabs.Static, CollapsibleTabs.Options {}

    namespace CollapsibleTabs {
        /**
         * A jQuery plugin that makes collapsible tabs for the Vector skin.
         */
        interface Options {
            /**
             * Optional tab selector. Defaults to `#p-views ul`.
             */
            expandedContainer: string;
            /**
             * Optional menu item selector. Defaults to `#p-cactions ul`.
             */
            collapsedContainer: string;
            /**
             * Optional selector for tabs that are collapsible. Defaults to `li.collapsible`.
             */
            collapsible: string;
            shifting: boolean;
            expandedWidth: number;

            expandCondition(eleWidth: number): boolean;

            collapseCondition(): boolean;
        }

        interface Static {
            defaults: Options;
            instances: JQuery[];

            addData($collapsible: JQuery): void;

            getSettings($collapsible: JQuery): Options;

            handleResize(): void;

            moveToCollapsed($moving: JQuery): void;

            moveToExpanded($moving: JQuery): void;

            calculateTabDistance(): number;
        }
    }
}
