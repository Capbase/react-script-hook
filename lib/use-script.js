"use strict";
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.scripts = void 0;
var react_1 = require("react");
// Previously loading/loaded scripts and their current status
exports.scripts = {};
// Check for existing <script> tags with this src. If so, update scripts[src]
// and return the new status; otherwise, return undefined.
var checkExisting = function (src) {
    var existing = document.querySelector("script[src=\"" + src + "\"]");
    if (existing) {
        // Assume existing <script> tag is already loaded,
        // and cache that data for future use.
        return (exports.scripts[src] = {
            loading: false,
            error: null,
            scriptEl: existing,
        });
    }
    return undefined;
};
function useScript(_a) {
    var src = _a.src, _b = _a.checkForExisting, checkForExisting = _b === void 0 ? false : _b, attributes = __rest(_a, ["src", "checkForExisting"]);
    // Check whether some instance of this hook considered this src.
    var status = src ? exports.scripts[src] : undefined;
    // If requested, check for existing <script> tags with this src
    // (unless we've already loaded the script ourselves).
    if (!status && checkForExisting && src && isBrowser) {
        status = checkExisting(src);
    }
    var _c = (0, react_1.useState)(status ? status.loading : Boolean(src)), loading = _c[0], setLoading = _c[1];
    var _d = (0, react_1.useState)(status ? status.error : null), error = _d[0], setError = _d[1];
    // Tracks if script is loaded so we can avoid duplicate script tags
    var _e = (0, react_1.useState)(false), scriptLoaded = _e[0], setScriptLoaded = _e[1];
    (0, react_1.useEffect)(function () {
        // Nothing to do on server, or if no src specified, or
        // if script is already loaded or "error" state.
        if (!isBrowser || !src || scriptLoaded || error)
            return;
        // Check again for existing <script> tags with this src
        // in case it's changed since mount.
        // eslint-disable-next-line react-hooks/exhaustive-deps
        status = exports.scripts[src];
        if (!status && checkForExisting) {
            status = checkExisting(src);
        }
        // Determine or create <script> element to listen to.
        var scriptEl;
        if (status) {
            scriptEl = status.scriptEl;
        }
        else {
            scriptEl = document.createElement('script');
            scriptEl.src = src;
            Object.keys(attributes).forEach(function (key) {
                if (scriptEl[key] === undefined) {
                    scriptEl.setAttribute(key, attributes[key]);
                }
                else {
                    scriptEl[key] = attributes[key];
                }
            });
            status = exports.scripts[src] = {
                loading: true,
                error: null,
                scriptEl: scriptEl,
            };
        }
        // `status` is now guaranteed to be defined: either the old status
        // from a previous load, or a newly created one.
        var handleLoad = function () {
            if (status)
                status.loading = false;
            setLoading(false);
            setScriptLoaded(true);
        };
        var handleError = function (error) {
            if (status)
                status.error = error;
            setError(error);
        };
        scriptEl.addEventListener('load', handleLoad);
        scriptEl.addEventListener('error', handleError);
        document.body.appendChild(scriptEl);
        return function () {
            if (status)
                status.loading = false;
            scriptEl.removeEventListener('load', handleLoad);
            scriptEl.removeEventListener('error', handleError);
        };
        // we need to ignore the attributes as they're a new object per call, so we'd never skip an effect call
    }, [src]);
    return [loading, error];
}
exports.default = useScript;
var isBrowser = typeof window !== 'undefined' && typeof window.document !== 'undefined';
//# sourceMappingURL=use-script.js.map