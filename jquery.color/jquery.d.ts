interface JQueryStatic {
    colorUtil: JQuery.ColorUtil;
}

declare namespace JQuery {
    interface ColorUtil {
        /**
         * Parse CSS color strings looking for color tuples
         *
         * Based on highlightFade by Blair Mitchelmore
         * <http://jquery.offput.ca/highlightFade/>
         *
         * @param {ColorUtil.Color|string} color
         * @returns {ColorUtil.Color}
         */
        getRGB<T extends ColorUtil.Color>(color: string | T): T;

        /**
         * Named color map
         *
         * Based on Interface by Stefan Petre
         * <http://interface.eyecon.ro/>
         */
        colors: Record<string, ColorUtil.Color>;

        /**
         * Convert an RGB color value to HSL.
         *
         * Conversion formula based on
         * <http://mjijackson.com/2008/02/rgb-to-hsl-and-rgb-to-hsv-color-model-conversion-algorithms-in-javascript>
         *
         * Adapted from <https://en.wikipedia.org/wiki/HSL_color_space>.
         *
         * Assumes `r`, `g`, and `b` are contained in the set `[0, 255]` and
         * returns `h`, `s`, and `l` in the set `[0, 1]`.
         *
         * @param {number} r The red color value
         * @param {number} g The green color value
         * @param {number} b The blue color value
         * @returns {ColorUtil.Color} The HSL representation
         */
        rgbToHsl(r: number, g: number, b: number): ColorUtil.Color;

        /**
         * Convert an HSL color value to RGB.
         *
         * Conversion formula based on
         * <http://mjijackson.com/2008/02/rgb-to-hsl-and-rgb-to-hsv-color-model-conversion-algorithms-in-javascript>
         *
         * Adapted from <https://en.wikipedia.org/wiki/HSL_color_space>.
         *
         * Assumes `h`, `s`, and `l` are contained in the set `[0, 1]` and
         * returns `r`, `g`, and `b` in the set `[0, 255]`.
         *
         * @param {number} h The hue
         * @param {number} s The saturation
         * @param {number} l The lightness
         * @returns {ColorUtil.Color} The RGB representation
         */
        hslToRgb(h: number, s: number, l: number): ColorUtil.Color;

        /**
         * Get a brighter or darker rgb() value string.
         *
         * Usage:
         *
         * ```js
         * $.colorUtil.getColorBrightness( 'red', +0.1 );
         * // > "rgb(255,50,50)"
         * $.colorUtil.getColorBrightness( 'rgb(200,50,50)', -0.2 );
         * // > "rgb(118,29,29)"
         * ```
         *
         * @param {ColorUtil.Color|string} currentColor Current value in css
         * @param {number} mod Wanted brightness modification between -1 and 1
         * @returns {string} Like `'rgb(r,g,b)'`
         */
        getColorBrightness(
            currentColor: string | ColorUtil.Color,
            mod: number
        ): `rgb(${number},${number},${number})`;
    }

    namespace ColorUtil {
        type Color = [number, number, number];
    }
}
