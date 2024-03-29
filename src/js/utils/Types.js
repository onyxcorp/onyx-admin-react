var Immutable = require('immutable');

module.exports.isImmutableList = function isImmutableList(o) {
    return (o instanceof Immutable.List);
};

module.exports.isImmutableRecord = function isImmutableRecord(o) {
    return (o instanceof Immutable.Record);
};

module.exports.isImmutableMap = function isImmutableMap(o) {
    return (o instanceof Immutable.Map);
};

module.exports.isStoreFlux = function isStoreFlux(o) {
    // return (Object.prototype.toString.call(o) === '[object Store]');
    return (Object.prototype.toString.call(o) === '[object Function]');
};

module.exports.isActionFlux = function isActionFlux(o) {
    // return (Object.prototype.toString.call(o) === '[object Action]');
    return (Object.prototype.toString.call(o) === '[object Function]');
};

module.exports.isBoolean = function isBoolean(o) {
    return (Object.prototype.toString.call(o) === '[object Boolean]');
};

module.exports.isString = function isString(o) {
    return (Object.prototype.toString.call(o) === '[object String]');
};

module.exports.isDate = function isDate(o) {
    return (Object.prototype.toString.call(o) === '[object Date]');
};

module.exports.isNumber = function isNumber(o) {
    return (Object.prototype.toString.call(o) === '[object Number]');
};

module.exports.isFunction = function isFunctionA(o) {
    return (Object.prototype.toString.call(o) == '[object Function]');
};

module.exports.isObject = function isObject(o) {
    return (Object.prototype.toString.call(o) == '[object Object]');
};

module.exports.isArray = function isArray(o) {
    return (Object.prototype.toString.call(o) === '[object Array]');
};

module.exports.isRegex = function isRegex(o) {
    return (Object.prototype.toString.call(o) === '[object RegExp]');
};

module.exports.isGlobal = function isGlobal(o) {
    return (Object.prototype.toString.call(o) === '[object global]');
};

module.exports.isError = function isError(o) {
    return (Object.prototype.toString.call(o) === '[object Error]');
};

module.exports.isUndefined = function (o) {
    return (Object.prototype.toString.call(o) === '[object Undefined]');
};

module.exports.isNull = function (o) {
    return (Object.prototype.toString.call(o) === '[object Null]');
};
