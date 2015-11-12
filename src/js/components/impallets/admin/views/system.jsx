
var React = require('react'),
    PureRenderMixin = require('react/addons').addons.PureRenderMixin,
    Grid = require('../../../mdl').Grid,
    List = require('../../../mdl').List,
    ListItem = require('../../../mdl').ListItem,
    Divider = require('../../../mdl').Divider,
    Icon = require('../../../mdl').Icon,
    System;

System =
    React.createClass({

        displayName: 'Informações do Sistema',

        contextTypes: {
            flux: React.PropTypes.object
        },

        mixins: [PureRenderMixin],

        _handleTrackClick: function (methods, event) {
            event.preventDefault();
            if (!methods.length) return;
            methods.forEach(function (method) {
                method();
            });
        },

        render: function () {
            var registeredActions,
                actionsCreators,
                actionCreatorReference,
                configuration,
                actions;

            registeredActions = this.context.flux.getActions();

            // generate the actions list tree map
            actionsCreators = Object.keys(registeredActions).map(function (actionCreator, index) {

                if (!registeredActions.hasOwnProperty(actionCreator)) throw new Error('Invalid registeredActions property for actionCreator "' + actionCreator + '"');

                actionCreatorReference = registeredActions[actionCreator];
                configuration = actionCreatorReference.getConfiguration();
                if (!configuration) throw new Error('ActionCreator "' + actionCreator + '" with configuration property missing');
                actions = actionCreatorReference.getActionNames().map(function (action, subIndex) {

                    if (!configuration.hasOwnProperty(action)) throw new Error('Invalid configuration property for action "' + action + '"');

                    var actionTrackMethods = [];
                    var trackersStringified = [];

                    if (configuration[action].track) {
                        // analytics, predictionIO, etc
                        var trackers = Object.keys(configuration[action].track);
                        trackers.forEach( function (tracker) {
                            // sendEvent, addProduct, etc..
                            var trackerEvents = Object.keys(configuration[action].track[tracker]);
                            trackerEvents.forEach( function (eventName, liIndex) {
                                // the event parameters
                                var eventParameters = configuration[action].track[tracker][eventName];
                                var stringifedParameters = JSON.stringify(eventParameters);
                                trackersStringified.push(<li key={liIndex}>{tracker}.{eventName}({stringifedParameters})</li>);
                                actionTrackMethods.push(actionCreatorReference.track.bind(actionCreatorReference, action, tracker, eventName, eventParameters));
                            });
                        });
                    }

                    var actions = (
                        <div>
                            <p>{action}</p>
                            <p> Trackers:
                                <ul>{trackersStringified}</ul>
                            </p>
                        </div>
                    );

                    return (
                        <div key={subIndex}>
                            <ListItem leftIcon={<Icon name='foward' />}
                                primaryText={actions}
                                secondaryText={<p>arguments: {configuration[action].params || 'null'}</p>}
                                onClick={this._handleTrackClick.bind(this, actionTrackMethods)} />
                            <Divider />
                        </div>
                    );

                }.bind(this));

                return (
                    <div key={index}>
                        <List subheader={actionCreator}>
                            {actions}
                        </List>
                    </div>
                );
            }.bind(this));

            // generate the stores list tree map
            var stores = Object.keys(this.context.flux._stores).map(function (store, index) {

                return (
                    <div key={index}>
                        <ListItem leftIcon={<Icon name='store' />}
                            primaryText={store} />
                        <Divider />
                    </div>
                );

            });

            // TODO This should be a script and the data should come from the API
            // firebase, otherwise anyone will be able to see all the flux archiecture (BAD BAD)
            // TODO finish later
            return (
                <Grid>
                    <h1>System Information Settings</h1>
                    <h2>Actions</h2>
                    <List>
                        {actionsCreators}
                    </List>
                    <h2>Stores</h2>
                    <List>
                        {stores}
                    </List>
                </Grid>
            );
        }
    });

module.exports = System;
