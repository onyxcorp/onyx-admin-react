
var Types = require('./Types'),
    global = Types.isGlobal(window) ? window : this || {},
    localStorage = global.localStorage || null,
    Storage;

function Storage(namespace, attributes) {

    if (!Types.isString(namespace)) {
        throw new TypeError('Storage namespace must be a string');
    }

    this.namespace = namespace;

    this.data = {};

    var attributesKeys = Object.keys(attributes);
    if (Types.isObject(attributes) && attributesKeys.length) {
        // TODO need testing
        attributesKeys.forEach( function (key) {
            // check if the data is already set
            if (this.get(key)) {
                // if the data doesn't exists, set the default passed value in attributes
                this.set(key, attributes[key]);
            }
        }.bind(this));
    }
}

Storage.prototype.exists = localStorage ? true : false;

/**
 * Try to get the data in the storage, if nothing is found returns false, or else the json parsed array
 * @param key
 * @returns {*}
 */
Storage.prototype.get = function (key) {

    if (!this.exists) return;

    if (!Types.isString(key)) {
        throw new TypeError('Get argument must be of type string');
    }

    if (!Object.keys(this.data).length) {
        this.data = JSON.parse(localStorage.getItem(this.namespace)) || {};
    }

    return this.data[key] ? this.data[key] : null;

};

/**
 * Try to set a new data information, returns true if the data was correctly passed
 *
 * @param key
 * @param data
 * @returns getData (array)
 */
Storage.prototype.set = function (key, newData) {

    if (!this.exists) return;

    if (!Types.isString(key)) {
        throw new TypeError('Storage.set first argument must be of type string');
    }

    if (!Object.keys(this.data).length) {
        this.data = JSON.parse(localStorage.getItem(this.namespace)) || {};
    }

    if (newData === null && this.data[key]) {
        delete this.data[key];
    } else if (newData !== null) {
        this.data[key] = newData;
    }
    // may set an empty object
    localStorage.setItem(this.namespace, JSON.stringify(this.data) || null);
    return this.get(key);
};

/**
 * Try to set a new data information, returns true if the data was correctly passed
 *
 * @param attributes
 * @returns void
 */
Storage.prototype.setAll = function (attributes) {

    if (!Types.isObject(attributes)) {
        throw new TypeError('Storage.setAll only accepts object as argument');
    }

    var attributesKeys = Object.keys(attributes);
    if (Types.isObject(attributes) && attributesKeys.length) {
        // TODO need testing
        attributesKeys.forEach( function (key) {
            this.set(key, attributes[key]);
        }.bind(this));
    }
};

/**
 * Shorthand for setting data that area basicaly true or false
 * @param key
 * @returns setData -> getData -> array
 */
Storage.prototype.toggle = function (key) {

    if (!this.exists) return;

    if (!Types.isString(key)) {
        throw new TypeError('Storage.set first argument must be of type string');
    }

    if (!Object.keys(this.data).length) {
        this.data = JSON.parse(localStorage.getItem(this.namespace)) || {};
    }

    if (this.data[key]) {
        this.data[key] = false;
    } else {
        this.data[key] = true;
    }

    // may set an empty object
    localStorage.setItem(this.namespace, JSON.stringify(this.data) || null);

    return this.get(key);
};

module.exports = Storage;
