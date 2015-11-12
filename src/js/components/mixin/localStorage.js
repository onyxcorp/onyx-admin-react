/*
    This file is a simpe mixin that allow the react modules to work with
    local browser cache, this mixin uses the Storage service created at the
    utils folder and can and should be used in any component that use some
    non-permanent data to set it's states. It will also automatically set
    ALL of the component state to the browser local cache.

    Some common uses of this mixin would be:
    - Tabs/Panels
    - Open/Closed boxes
    - Modals (some cases)

*/

var React = require('react'),
    invariant = require('react/lib/invariant'),
    Storage = require('../../utils/Storage.js'),
    storage,
    localStorageMixin;

storage = new Storage('react');

localStorageMixin = {

    propTypes: {
        localStorageKey: React.PropTypes.string.isRequired
    },

    getDefaultProps: function () {
        return {
            // set some default storage name
            localStorageKey: this.displayName || 'react-localstorage'
        };
    },

    componentDidUpdate: function(prevProps, prevState) {

        var prevStoredState;

        if (!storage.exists) return;

        // the previous stored state is the last data that was stored by this mixin
        // and that there should still be the same at the browser local cache
        prevStoredState = storage.get('react', this.props.localStorageKey);

        if (prevStoredState) {
            // this invariant checks the current prevState with the prevStoredState
            // if they don't match it means that some other component are using the same
            // key
            invariant(
                prevStoredState === prevState,
                'While component ' + this.props.displayName + ' was saving state to localStorage, ' +
                'the localStorage entry was modified by another actor. This can happen when multiple ' +
                'components are using the same localStorage key. Set the property `localStorageKey` ' +
                'on ' + this.props.displayName + '.'
            );
        }
        // everything went fine, let's update the current browser local cache with the current state
        storage.set('react', this.props.localStorageKey, this.state);
    },

    componentWillMount: function() {

        var storedState;

        if(!storage.exists) return;

        storedState = storage.get(this._storageKey);

        if (storedState) {
            try {
                this.setState(storedState);
            } catch(e) {
                console.log("Unable to load state for " + this.props.displayName + " from localStorage.");
            }
        }
    }
};

module.exports = localStorageMixin;
