var Types = require('./Types'),
    assign = require('object-assign');

(function(global) {

    var analyticsID = 'UA-37165645-5';

    function log(message) {
        if (!global.goSilent) console.log(message);
    }

    function validateAndMergeParams(baseParams, params) {
        // get the base params valid properties
        var baseParamsProperties = Object.keys(baseParams);
        // merge the baseParams with the newParams
        var newParams = assign({}, baseParams, params);
        // check if we have only valid params keys
        Object.keys(newParams).forEach(function (param) {
            if (baseParamsProperties.indexOf(param) === -1 ) {
                throw new Error('Need valid params properties');
            }
            // it's valid, now check if it is null and delete it if that's the case
            if (newParams[param] === null) delete newParams[param];
        });
        return newParams;
    }

    function validateParamType(data, param, type) {
        var isType,
            paramValue;
        if (type === 'string') {
            isType = 'isString';
        } else if (type === 'number') {
            isType = 'isNumber';
        }
        paramValue = data[param];
        if (paramValue) {
            if (data.hasOwnProperty(param) && !Types[isType](paramValue)) throw new TypeError(param + ' must be a ' + type);
        }
    }

    function GoogleAnalytics (ecommerce) {
        // load google analytics js file and append it to the global window
        (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
        (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
        m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
        })(global,document,'script','//www.google-analytics.com/analytics.js','ga');
        global.ga('create', analyticsID, 'none');
        if (ecommerce) this.initializeEcommerce();
    }

    GoogleAnalytics.prototype.sendView = function sendView(params) {
        if (global.isLocalHost) {
            log('sendView', params.page, params.title);
            return;
        }
        var availableParams = {
            hitType: 'pageview',
            page: null,         // String	No	The page path and query string of the page (e.g. /homepage?id=10). This value must start with a / character.
            title: null         // String	No	The title of the page (e.g. homepage)
        };
        availableParams = validateAndMergeParams(availableParams, params);
        validateParamType(availableParams, 'page', 'string');
        validateParamType(availableParams, 'title', 'string');
        global.ga('send', availableParams);
    };

    GoogleAnalytics.prototype.sendEvent = function sendEvent(params) {
        if (global.isLocalHost) {
            log('sendEvent', params.category, params.action, params.label, params.value);
            return;
        }
        var availableParams = {
            category: null,         // String	Yes What data is being looked at (nouns) (e.g. Videos, Articles, Products..)
            action: null,           // String	Yes	The type of interaction (verbs) (e.g. clicked, downloaded, bookmarked... )
            label: null,            // String	No	Useful for categorizing/associate data with events (e.g.  Tutorial Video, Introduction Video..).
            value: null             // Number	No	Values must be non-negative. Useful to pass integers to events (e.g. price, codes, etc...)
        };
        availableParams = validateAndMergeParams(availableParams, params);
        validateParamType(availableParams, 'category', 'string');
        validateParamType(availableParams, 'action', 'string');
        validateParamType(availableParams, 'label', 'string');
        validateParamType(availableParams, 'value', 'number');
        global.ga('send', 'event', availableParams.category, availableParams.action, availableParams.label, availableParams.value);
    };


    /**

        Bellow are Ecommerce only settings for Google analytics
        Those must be manually called to be used

        https://developers.google.com/analytics/devguides/collection/analyticsjs/enhanced-ecommerce

    **/

    GoogleAnalytics.prototype.initializeEcommerce = function initializeEcommerce() {
        // load enhanced ecommerce plugin
        global.ga('require', 'ec');
        function Ecommerce() {}

        // Provide product details in an impressionFieldObject.
        Ecommerce.prototype.addImpression = function addImpression(params) {
            var availableParams = {     //  Represents information about a product that has been viewed. It is referred to as an impressionFieldObject and contains the following values:
                id: null,               //	String	  Yes*	The product ID or SKU (e.g. P67890). *Either this field or name must be set.
                name: null,             //	String	  Yes*	The name of the product (e.g. Android T-Shirt). *Either this field or id must be set.
                list: null,             //	String	  No	The list or collection to which the product belongs (e.g. Search Results)
                brand: null,            //	String	  No	The brand associated with the product (e.g. Google).
                category: null,         //	String	  No	The category to which the product belongs (e.g. Apparel). Use / as a delimiter to specify up to 5-levels of hierarchy (e.g. Apparel/Mens/T-Shirts).
                variant: null,          //	String	  No	The variant of the product (e.g. Black).
                position: null,         //	Number	  No	The product's position in a list or collection (e.g. 2).
                price: null             //	Currency  No	The price of a product (e.g. 29.20).
            };

            availableParams = validateAndMergeParams(availableParams, params);
            if (global.isLocalHost) {
                log('addImpresion:', availableParams.name);
                log(availableParams);
            }
            validateParamType(availableParams, 'id', 'string');
            validateParamType(availableParams, 'name', 'string');
            validateParamType(availableParams, 'list', 'string');
            validateParamType(availableParams, 'brand', 'string');
            validateParamType(availableParams, 'category', 'string');
            validateParamType(availableParams, 'variant', 'string');
            validateParamType(availableParams, 'position', 'number');
            validateParamType(availableParams, 'price', 'number');

            global.ga('ec:addImpression', availableParams);
        };

        // Provide product details in a productFieldObject.
        Ecommerce.prototype.addProduct = function addProduct(params) {
            var availableParams = { // Product data represents individual products that were viewed, added to the shopping cart, etc. It is referred to as a productFieldObject and contains the following values:
                id: null,           //  String	Yes*	The product ID or SKU (e.g. P67890). *Either this field or name must be set.
                name: null,         //	String	Yes*	The name of the product (e.g. Android T-Shirt). *Either this field or id must be set.
                brand: null,        //	String	No	The brand associated with the product (e.g. Google).
                category: null,     //	String	No	The category to which the product belongs (e.g. Apparel). Use / as a delimiter to specify up to 5-levels of hierarchy (e.g. Apparel/Mens/T-Shirts).
                variant: null,      //	String	No	The variant of the product (e.g. Black).
                price: null,        //	Currency/Number 	No	The price of a product (e.g. 29.20).
                quantity: null,     //	Number	No	The quantity of a product (e.g. 2).
                coupon: null,       //	String	No	The coupon code associated with a product (e.g. SUMMER_SALE13).
                position: null      //	Number	No	The product's position in a list or collection (e.g. 2).
            };

            availableParams = validateAndMergeParams(availableParams, params);
            if (global.isLocalHost) {
                log('addProduct:', availableParams.name);
                log(availableParams);
            }
            validateParamType(availableParams, 'id', 'string');
            validateParamType(availableParams, 'name', 'string');
            validateParamType(availableParams, 'brand', 'string');
            validateParamType(availableParams, 'category', 'string');
            validateParamType(availableParams, 'variant', 'string');
            validateParamType(availableParams, 'price', 'number');
            validateParamType(availableParams, 'quantity', 'number');
            validateParamType(availableParams, 'coupon', 'string');
            validateParamType(availableParams, 'position', 'number');

            global.ga('ec:addProduct', availableParams);
        };

        // Promo details provided in a promoFieldObject.
        Ecommerce.prototype.addPromo = function addPromo(params) {
            var availableParams = {
                id: null,               //	String	Yes*	The promotion ID (e.g. PROMO_1234). *Either this field or name must be set.
                name: null,             //	String	Yes*	The name of the promotion (e.g. Summer Sale). *Either this field or id must be set.
                creative: null,         //	String	No	The creative associated with the promotion (e.g. summer_banner2).
                position: null          //	String	No	The position of the creative (e.g. banner_slot_1).
            };
            availableParams = validateAndMergeParams(availableParams, params);
            if (global.isLocalHost) {
                log('addPromo:', availableParams.name);
                log(availableParams);
            }
            validateParamType(availableParams, 'id', 'string');
            validateParamType(availableParams, 'name', 'string');
            validateParamType(availableParams, 'creative', 'string');
            validateParamType(availableParams, 'position', 'string');

            global.ga('ec:addPromo', parameters);
        };
        // Reference https://developers.google.com/analytics/devguides/collection/analyticsjs/enhanced-ecommerce
        // Product and Promotions Actions
        // name (string).
        // params (object).
        Ecommerce.prototype.setAction = function (name, params) {
            var availableParams = {     // Represents information about an ecommerce related action that has taken place
                id: null,               // Type: STRING - The transaction ID (e.g. T1234). *Required if the action type is purchase or refund.
                affiliation: null,      // Type: STRING - The store or affiliation from which this transaction occurred (e.g. Google Store).
                revenue: null,          // Type: CURRENCY - Specifies the total revenue or grand total associated with the transaction (e.g. 11.99). If not provided will be automatically calculated by using the products and prices presents on the transaction
                tax: null,              // Type: CURRENCY - the total taxes associated with the transaction
                shipping: null,         // Type: CURRENCY - the shipping costs
                coupon: null,           // Type: STRING - transaction coupon (if available)
                list: null,             // Type: STRING - the list the associated products belongs to (what?)
                step: null,             // Type: NUMBER - a number representing a step in the checkout proccess. Optional on CHECKOUT actions.
                option: null            // Type: STRING - additional fields for checkout and checkout_option actions that can descbrie option information on the checkout page, like payment method
            };
            var availableActions = [    // Actions specify how to interpret product and promotion data that you send to Google Analytics.
                'click',                // A click on a product or product link for one or more products.
                'detail',               // A view of product details.
                'add',                  // Adding one or more products to a shopping cart.
                'remove',               // Remove one or more products from a shopping cart.
                'checkout',             // Initiating the checkout process for one or more products.
                'checkout_option',      // Sending the option value for a given checkout step.
                'purchase',             // The sale of one or more products.
                'refund',               // The refund of one or more products.
                'promo_click'           // A click on an internal promotion.
            ];

            // validate name
            if (availableActions.indexOf(name) === -1 ) {
                throw new Error('Need a valid name to setAction');
            }

            availableParams = validateAndMergeParams(availableParams, params);
            if (global.isLocalHost) {
                log('setAction:', name);
                log(availableParams);
            }
            validateParamType(availableParams, 'id', 'string');
            validateParamType(availableParams, 'affiliation', 'string');
            validateParamType(availableParams, 'revenue', 'number');
            validateParamType(availableParams, 'tax', 'number');
            validateParamType(availableParams, 'shipping', 'number');
            validateParamType(availableParams, 'coupon', 'string');
            validateParamType(availableParams, 'list', 'string');
            validateParamType(availableParams, 'step', 'number');
            validateParamType(availableParams, 'option', 'string');

            if (Object.keys(availableParams).length) {
                global.ga('ec:setAction', name, availableParams);
            } else {
                global.ga('ec:setAction', name);
            }
        };

        this.ecommerce = new Ecommerce();
    };

    module.exports = new GoogleAnalytics(true);

})(typeof window === 'undefined' ? this : window);
