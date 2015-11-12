
var Dispatcher = require('flux').Dispatcher,
    Types = require('./Types'),
    uniqueId = require('uniqueid'),
    Ga = require('./Ga'),
    Queue = require('queue'),
    EventEmitter = require('eventemitter3'),
    Storage = require('../utils/Storage'),
    Immutable = require('immutable'),
    assign = require('object-assign'),
    trackJsMockup;

function validateAndMergeParams(baseParams, params) {
    // get the base params valid properties
    var baseParamsProperties = Object.keys(baseParams);
    // check if there are base params to compare to
    if (!baseParamsProperties.length) return {};
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

trackJsMockup = {
    attempt: function () {console.warn('trackJjs not set');},
    console: {
        debug: function () {console.warn('trackJjs not set');},
        error: function () {console.warn('trackJjs not set');},
        info: function () {console.warn('trackJjs not set');},
        log: function () {console.warn('trackJjs not set');},
        warn: function () {console.warn('trackJjs not set');}
    },
    track: function () {console.warn('trackJjs not set');},
    version: function () {console.warn('trackJjs not set');},
    watch: function () { onsole.warn('trackJjs not set');},
    watchAll: function () {console.warn('trackJjs not set');}
};

function ActionFactory(extend) {
    function Action(OnyxFlux) {
        this._baseId = uniqueId();
        this._dispatch = OnyxFlux.dispatch.bind(OnyxFlux); // maybe this can be a prototype?
        this._dispatchAsync = OnyxFlux.dispatchAsync.bind(OnyxFlux); // same from above
        this.getActionNames().forEach( function (action) {
            this._wrapAction(action);
        }.bind(this));
    }

    Action.prototype._wrapAction = function (methodName) {
        var originalMethod = this[methodName],
            actionId = this._baseId + '-' + methodName,
            action;
        action = function () {
            // result will be the return value of the original method
            var result = originalMethod.apply(this, arguments);

            // an action will be registered now, we can call the
            // method associated events here

            // it means we are returning the this.async function
            if (result && result.method && Types.isFunction(result.method)) {
                // result will be the callback to be executed
                this._dispatchAsync('SERVER_ACTION', actionId, result);
            } else {
                this._dispatch('VIEW_ACTION', actionId, result);
            }

            // Return original method's value to caller
            return result;

        }.bind(this);
        action._id = actionId;
        this[methodName] = action;
    };

    Action.prototype.track = function (actionName, service, eventType, params) {
        var trackEventRef,
            configuration = this.getConfiguration();

        params = params || {};

        if (!configuration.hasOwnProperty(actionName)) throw new Error(actionName + ' actionName needs to be a valid configuration property');
        if (!configuration[actionName].hasOwnProperty('track')) throw new Error(actionName + ' needs a valid property called track');
        if (!configuration[actionName].track.hasOwnProperty(service)) throw new Error(service + ' service needs to be a valid track property');
        if (!configuration[actionName].track[service].hasOwnProperty(eventType)) throw new Error(eventType + ' event needs to be a valid service property');

        var defaultParams = configuration[actionName].track[service][eventType];

        if (service === 'analytics' && Types.isObject(defaultParams)) {

            params = validateAndMergeParams(defaultParams, params);

            if (eventType === 'sendEvent' || eventType === 'sendView') {
                trackEventRef = Ga[eventType];
            } else if (eventType === 'addPromo' || eventType === 'addProduct' || eventType =='addImpression') {
                trackEventRef = Ga.ecommerce[eventType];
            } else if ( eventType === 'setClick'   ||
                        eventType === 'setDetail'  ||
                        eventType === 'setAdd'     ||
                        eventType === 'setRemove'  ||
                        eventType === 'setCheckout'||
                        eventType === 'setCheckoutOption' ||
                        eventType === 'setPurchase'||
                        eventType === 'setRefund'  ||
                        eventType === 'setPromoClick') {
                            trackEventRef = Ga.ecommerce.setAction.bind(null, eventType.substr(3).toLowerCase());

            } else {
                throw new Error('Invalid eventType:' + eventType);
            }
            trackEventRef(params);
        } else {
            throw new Error('Invalid tracker');
        }
    };

    Action.prototype.getConfiguration = function (actionName) {
        if (actionName) {
            if (!configuration.hasOwnProperty(actionName)) throw new Error('Invalid actionName');
            return this._config[actionName];
        }
        return this._config;
    };

    Action.prototype.getActionNames = function () {
        // actionsNames
        return Object.getOwnPropertyNames(this.constructor.prototype).filter( function (name) {
            return (Types.isFunction(this[name]) && (
                name !== 'getActionNames' && name !== 'track' && name !== 'constructor' && name !== 'getConfiguration' &&
                name !== 'types' && name !== 'async' && name !== 'toString' && !name.startsWith('_')));
        }.bind(this));
    };

    Action.prototype.toString = function () {
        return '[object Action]';
    };
    Action.prototype.types = Types;
    Action.prototype.async = function (method, args) {
        if (!Types.isFunction(method)) {
            throw new Error('Async only accepts function as argument');
        }
        return {
            method: method, // the method to be executed as a callback
            params: args    // the initial args received by the action
        };
    };

    assign(Action.prototype, extend);
    return Action;
}

function StoreFactory(extend) {
    function Store(name, OnyxFlux) {
        this._handlers = {};
        this._waitFor = OnyxFlux.waitFor.bind(OnyxFlux);
        this._token = OnyxFlux.dispatcher.register(this.handler.bind(this));
        this._state = assign({}, this.initialState);
        this._rollbackState = assign({}, this.initialState);
        this._storage = new Storage(name, Immutable.Map(this._state).toJS());
        // children constructor
        this._init(OnyxFlux);
    }
    Store.prototype.toString = function () {
        return '[object Store]';
    };
    Store.prototype._init = function () {};
    Store.prototype.types = Types;
    // reference to trackJs or create an wrapper for it
    Store.prototype.error = window.trackJs ? window.trackJs : trackJsMockup;
    Store.prototype.initialState = {};
    Store.prototype.getToken = function () { return this._token; };
    Store.prototype.getState = function (property) {
        property = property || null;
        var response;
        if (!property) {
            response = assign({}, this._state);
        } else {
            if (!this._state.hasOwnProperty(property)) throw new Error('getState need a valid property to return. Property: "' + property + '" is invalid.');
            response = assign({}, this._state);
            response = response[property];
        }
        return response;
    };

    Store.prototype.setState = function (newState, callback) {
        callback = callback || null;
        if (callback && !Types.isFunction(callback)) {
            throw new TypeError('setState second parameter (callback) must be a function');
        }
        var updatedFields = [];
        var newStateKeys = Object.keys(newState);
        // only change the store current state if there are any keys added to it
        if (newStateKeys.length) {
            newStateKeys.forEach(function (stateKey) {
                if (!this._state.hasOwnProperty(stateKey)) {
                    throw new Error('Trying to set a invalid stateKey in the current Store:', stateKey);
                }
                // update only different fields
                if (this._state[stateKey] === newState[stateKey]) {
                    delete newState[stateKey];
                } else {
                    // if the is different, push it to the updatedFields list
                    updatedFields.push(stateKey);
                }
            }.bind(this));
            this._rollbackState = assign({}, this._state);
            this._state = assign({}, this._state, newState);
            // this._storage.setAll(tempNewState); // local storage cache
        }
        if (callback) callback(updatedFields.length ? true : false, updatedFields);
    };

    Store.prototype.rollback = function () {
        this._state = assign({}, this._rollbackState);
    };

    Store.prototype.register = function (action, handler) {
        if (!Types.isFunction(handler)) {
            throw new Error('Handler for actionId must be of type function');
        }
        this._handlers[action._id] = handler;
    };

    Store.prototype.registerAsync = function (action, handlerStart, handlerComplete) {
        if (!Types.isFunction(handlerStart) || !Types.isFunction(handlerComplete)) {
            throw new Error('handlerStart and handlerComplete for actionId must be of type function');
        }
        this._handlers[action._id + '-begin'] = handlerStart;
        this._handlers[action._id + '-complete'] = handlerComplete;
    };

    Store.prototype.handler = function (payload) {

        var data = payload.data.params;
        var asyncState = payload.async;
        var actionId = payload.data.action;

        actionId += asyncState ? asyncState === 'begin' ? '-begin' : '-complete' : '';

        if (this._handlers.hasOwnProperty(actionId)) {
            this._handlers[actionId].call(this, data);
            this.emit('change');
        }
    };

    Store.prototype.listenTo = function (callback) {
        this.on('change', callback);
    };

    Store.prototype.unlistenTo = function (callback) {
        this.removeListener('change', callback);
    };

    assign(Store.prototype, extend, EventEmitter.prototype);
    return Store;
}

function FluxFactory(extend) {
    function Flux() {
        this.dispatcher = new Dispatcher();
        this.queue = Queue({concurrency:1});
        this._stores = {};
        this._actions = {};
    }
    Flux.prototype.toString = function () { // not working as expect :(
        return '[object Flux]';
    };
    Flux.prototype._dispatchQueue = function (task, callback) {
        var payload = {
            source: task.source, // origin from the SERVER or VIEW
            data: task.payload,
            async: task.async
        };
        this.dispatcher.dispatch(payload);
        callback(); // finished async, callback..
    };

    Flux.prototype.dispatch = function (origin, actionId, result, asyncState) { // by default add to the queue
        origin = origin || 'SERVER_ACTION'; // the other possibility should be VIEW_ACTION
        asyncState = asyncState || null;
        var payload = {
            action: actionId,
            params: result
        };
        this.queue.stop();
        this.queue.push(this._dispatchQueue.bind(this, {source: origin, payload: payload, async: asyncState}));
        this.queue.start();
    };

    Flux.prototype.dispatchAsync = function (origin, actionId, asyncCallback) {
        origin = origin || 'SERVER_ACTION';
        this.dispatch(origin, actionId, asyncCallback.params, 'begin');
        // bellow we call the callback registered with the action with the dispatch
        // function to be executed with the result of the function asyncCallback method
        asyncCallback.method( function (result) {
            // result is the resulting valu after the callback was executed
            if (Types.isError(result)) {
                this.dispatch(origin, actionId, result, 'error');
            } else {
                this.dispatch(origin, actionId, result, 'success');
            }
        }.bind(this));
    };

    Flux.prototype.createStore = function (key, Store) {
        if (!Types.isStoreFlux(Store)) {
            throw new Error('Trying to add a Store that does not have the Store class in its prototype chain');
        }
        if (this._stores.hasOwnProperty(key) && this._stores[key]) {
            throw new Error('Attempted to create multiple Store with same key ${key}, they must be unique');
        }
        this._stores[key] = new Store(key, this);
        return this._stores[key];
    };

    Flux.prototype.createAction = function (key, Actions) {
        if (!Types.isActionFlux(Actions)) {
            throw new Error('Trying to add a Action that does not have the Action class in its prototype chain');
        }
        if (this._actions.hasOwnProperty(key) && this._actions[key]) {
            throw new Error('Attempted to create multiple actions with the same ${key}, they must be unique');
        }
        this._actions[key] = new Actions(this);
        return this._actions[key];
    };

    Flux.prototype.getStore = function (key) {
        key = key || null;
        if (key) return this._stores.hasOwnProperty(key) ? this._stores[key] : undefined;
        return this._stores;
    };

    Flux.prototype.getActions = function (key) {
        key = key || null;
        if (key) return this._actions.hasOwnProperty(key) ? this._actions[key] : undefined;
        return this._actions;
    };

    Flux.prototype.waitFor = function (tokens) {
        this.dispatcher.waitFor(tokens);
    };

    assign(Flux.prototype, extend);
    return Flux;
}

module.exports = {
    createAction: function (extend) {
        return ActionFactory(extend);
    },
    createStore: function (extend) {
        return StoreFactory(extend);
    },
    createFlux: function (extend) {
        return FluxFactory(extend);
    }
};
