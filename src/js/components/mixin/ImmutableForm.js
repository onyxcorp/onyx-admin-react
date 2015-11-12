/**
 *
 *      ImmutableForm should be to keep sync of model state
 *      and to obtain a two way databind, and only that
 *
 *      SHould control only the data flow in/outside the model and not the HOW
 *      the data are validate or transformed
 *
 */
var ReactLink = require("react/lib/ReactLink"),
    Immutable = require('immutable'),
    Types = require('../../utils/Types'),
    FormMixin;

function createFormMixin(propsModelArr) {

    // constant form prefix naming
    var FORM_PREFIX = 'formError';

    // the current field being edited
    var editingField = null;

    // the raw value of the input
    var rawValue = null;

    if (!Types.isArray(propsModelArr)) {
        throw new TypeError('ImmutableForm only accept array as an argument');
    }

    // easier helper since we were calling everywhere the combination FORM_prefix..
    function getErrorStateKey(model, property) {
        return FORM_PREFIX + model + property;
    }

    function initLinkedState() {
        var initialState = {};
        propsModelArr.forEach(function (propModel) {
            var model;
            if (Types.isObject(propModel)) {
                // if the model is an object we need to iterate over it
                var prop = Object.keys(propModel)[0];
                model = propModel[prop];
                initialState[model] = this.props[prop].get(model);
            } else {
                // default, just need the model name to set
                model = propModel;
                initialState[model] = this.props[model];
            }
            if (!(initialState[model] instanceof Immutable.Record)) {
                throw new Error('ImmutableForm.js - ImmutableForm only accepts Immutable.Record as initialState model');
            }
            // set the initial render state (always initialize with null)
            var modelProperties = initialState[model].getProperties();
            modelProperties.forEach( function (property) {
                initialState[getErrorStateKey(model, property)] = null;
            });
        }.bind(this));
        return initialState;
    }

    FormMixin = {

        // get the initial data
        getInitialState: function () {
            return initLinkedState.call(this);
        },

        // make sure that the current object state is kept in sync with the store
        // todo maybe add some check with the data that the user changed before trying to set it again
        // to avoid overriding what have been changed so far..
        componentWillReceiveProps: function (nextProps) {
            var newState = {};
            propsModelArr.forEach(function (propModel) {
                var prop;
                if (Types.isObject(propModel)) {
                    prop = Object.keys(propModel)[0];
                } else {
                    prop = propModel;
                }
                if (this.props[prop] !== nextProps[prop]) {
                    if (prop !== propModel) {
                        var model = propModel[prop];
                        newState[model] = nextProps[prop].get(model);
                    } else {
                        newState[prop] = nextProps[prop];
                    }
                }
            }.bind(this));
            if (Object.keys(newState).length) {
                editingField = null;
                this.setState(newState);
            }
        },

        // this function is really usefl for immutable form with more than one
        // model,  when the properties of this model might colide.
        // Anyway this is also the only way now to keep track of the error messages
        // at the input fields since the error will also keep track of the fields
        // using the model name
        setFieldName: function (model, property) {
            return model + property;
        },

        getErrorStateMessage: function (model, property) {
            return this.state[getErrorStateKey(model, property)];
        },

        setErrorState: function (model, invalidState) {
            var newState = {},
                invalidMessages = invalidState.getMessages() || [];
            Object.keys(invalidMessages).forEach(function (property) {
                newState[getErrorStateKey(model, property)] = invalidMessages[property];
            });
            this.setState(newState);
        },

        // a wrapper, since we are abstracting the logic of the state
        // it's fair that we put the way the state should be get here
        getLinkedState: function (model) {
            if (this.state.hasOwnProperty(model)) {
                return this.state[model];
            } else {
                throw new Error('ImmutableForm - Trying to get a invalid state model property');
            }
        },
        // used to manually update the object when initialized throught ImmutableForm
        setLinkedState: function (modelName, modelData) {
            if (this.state.hasOwnProperty(modelName)) {
                this.setState(this.state[modelName] = modelData);
            } else {
                throw new Error('ImmutableForm - Trying to set a invalid state model property');
            }
        },
        // reset the linked state to it's default value (the one received throught props)
        resetLinkedState: function () {
            this.setState(initLinkedState.call(this));
        },

        linkState: function (model, key, setter, getter) {
            getter = getter === null ? null : 'getMasked';
            if (getter && !Types.isFunction(this.state[model][getter])) throw new Error('getter must be null or a valid model function');

            // this will be the component in question
            // Partial state is allocated outside of the function closure so it can be
            // reused with every call, avoiding memory allocation when this function
            // is called.
            var partialState = {};
            return new ReactLink(
                // if the value is not set, it will come as undefined which will make the input uncontrolled
                // so that's why we try to get the value, but if not we set it as empty
                // more at https://facebook.github.io/react/docs/forms.html
                getter === null ? null : this.state[model][getter].call(this.state[model], key, (editingField === key), rawValue) || '',
                function stateKeySetter(value) {

                    rawValue = event.target.files || value || event.target.value;
                    editingField = key = key || event.target.name;

                    // do some double check, don't know if it is really necessary but i want this to be very explicty
                    function callback(newState) {
                        if (newState) {
                            partialState = {};
                            partialState[model] = newState;
                            this.setState(partialState);
                        }
                    }

                    // immutable form always set the records data through a callback and not through return
                    if (this.state[model][setter] && Types.isFunction(this.state[model][setter])) {
                        callback.call(this, this.state[model][setter](rawValue, callback.bind(this)));
                    } else {
                        // setAsync is the default method called for setting Record attributes
                        callback.call(this, this.state[model].setAsync(key, rawValue, callback.bind(this)));
                    }
                }.bind(this)
            );
        },
        // there should be a more elegant way..
        linkRadioState: function (model, key) {
            return function bindedFunction () {
                var partialState = {};
                rawValue = event.target.value || null;
                editingField = key = key || event.target.name;
                if (this.state[model][key] && Types.isFunction(this.state[model][key])) {
                    partialState[model] = this.state[model][key](rawValue);
                } else {
                    partialState[model] = this.state[model].set(key, rawValue);
                }

                this.setState(partialState);
            }.bind(this);
        },

        clearErrorState: function (event) {

            // we don't use the function getErrorState here because we are dealing
            // if the input field event attributes, which already come transformed
            // since the developer should have used the setFieldName method for that job
            var nextState = {},
                errorStateKey;
            if (Types.isString(event)) {
                errorStateKey = FORM_PREFIX + event;
            } else if ( Types.isFunction(event.preventDefault) && event.target) {
                event.preventDefault();
                if (!event.target.name) {
                    throw new Error('clearErrorState need a input with a valid name attribute');
                }
                errorStateKey = FORM_PREFIX + event.target.name;
            } else {
                throw new TypeError('clearErrorState second argument must be either an event or a string');
            }
            nextState[errorStateKey] = null;
            this.setState(nextState);
        },
    };

    return FormMixin;
}

module.exports = createFormMixin;
