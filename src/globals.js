// Global configuration files
(function(global) {

    if (typeof String.prototype.startsWith != 'function') {
        String.prototype.startsWith = function (str) {
            return this.slice(0, str.length) == str;
        };
    }

    if (typeof String.prototype.capitalize != 'function') {
        String.prototype.capitalize = function () {
            return this.toLowerCase().charAt(0).toUpperCase() + this.slice(1);
        };
    }

    if (typeof String.prototype.contains != 'function') {
        String.prototype.contains = function (it, exactMatch) {
            exactMatch = exactMatch || true;
            var response;
            if (exactMatch) {
                response = this === it;
            } else {
                response = this.indexOf(it) !== -1;
            }
            return response;
        };
    }

    if (typeof String.prototype.containsOr != 'function') {
        String.prototype.containsOr = function () {
            var stringList = [].splice.call(arguments, 0);
            return stringList.some( function (value) {
                return this.contains(value);
            }.bind(this));
        };
    }

    /**
     *   SET PROJECT GLOBAL VARIABLES
     */
    global.projectName = 'Impallets';
    global.isLocalHost = window.location.host.indexOf('localhost') >= 0;
    global.goSilent = true;

    /**
     *      SET TRACK.JS
     *
     */
        // configuration reference https://docs.trackjs.com/Configuration
    global._trackJs = {

        // trackjs unique access token
        token: 'c52711ea8b394b4d9542618e32c1b30a',

        // reference https://docs.trackjs.com/Examples/Developing_Locally
        enabled: !global.isLocalHost,

        // references for this function can be found on those two linkes bellow
        // https://gist.github.com/pamelafox/1878283
        // https://docs.trackjs.com/Examples/Ignoring_Errors
        onError: function (payload, error) {
            var i;

            // First check the URL and line number of the error
            url = url || window.location.href;
            lineNum = lineNum || 'None';

            // If the error is from these 3rd party script URLs, we ignore
            // We could also just ignore errors from all scripts that aren't our own
            var scriptURLs = [
                // Facebook flakiness
                'https://graph.facebook.com',
                // Facebook blocked
                'http://connect.facebook.net/en_US/all.js',
                // Woopra flakiness
                'http://eatdifferent.com.woopra-ns.com',
                'http://static.woopra.com/js/woopra.js',
                // Chrome extensions
                'extensions/',
                // Other (from plugins)
                'http://127.0.0.1:4001/isrunning', // Cacaoweb
                'http://webappstoolbarba.texthelp.com/',
                'http://metrics.itunes.apple.com.edgesuite.net/'
            ];

            for (i = 0; i < scriptURLs.length; i++) {
                if (url.indexOf(scriptURLs[i]) === 0) {
                    return false;
                }
            }


            // List borrowed from the awesome @pamelafox
            // https://gist.github.com/pamelafox/1878283
            var commonCrypticExtensionErrors = [
                "top.GLOBALS",
                "originalCreateNotification",
                "canvas.contentDocument",
                "MyApp_RemoveAllHighlights",
                "http://tt.epicplay.com",
                "Can't find variable: ZiteReader",
                "jigsaw is not defined",
                "ComboSearch is not defined",
                "http://loading.retry.widdit.com/",
                "atomicFindClose",
                "fb_xd_fragment",
                "Script error."
            ];
            for (i = 0; i < commonCrypticExtensionErrors.length; i++) {
                if (payload.message.indexOf(commonCrypticExtensionErrors[i]) > -1) {
                    // returning any kind of falsy value will reject error
                    return false;
                }
            }

            // You can ignore based on any property in the payload
            var urlToIgnore = new RegExp("admin", "i");
            if(urlToIgnore.test(payload.url)){
                return false;
            }

            // You can also ignore without inspecting the payload at all
            if(MyApplication.isSessionExpired()){
                return false;
            }

            return true; // Return any kind of truthy value here to allow transmission of error
        },

        console: {

            // Watch the console for events
            enabled: true,

            // Pass console messages through to the browser
            // TODO on production change to FALSE
            display: true,

            // Transmit console errors to TrackJS
            error: true,

            // Names of console functions to watch
            watch: ["log","debug","info","warn","error"]

        },
        network: {

            // Watch the network for events
            enabled: true,

            // Transmit network failures to TrackJS
            error: true

        },
        window: { // will bind itself to window.onerror

            // Watch the window for global errors
            enabled: true

        }
    };

})(typeof window === 'undefined' ? this : window);
// Using `this` for web workers while maintaining compatibility with browser
// targeted script loaders such as Browserify or Webpack where the only way to
// get to the global object is via `window`.
