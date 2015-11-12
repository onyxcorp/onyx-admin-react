
var React = require('react'),
    Router = require('react-router'),
    RouteHandler = Router.RouteHandler,
    assign = require('object-assign'),
    Application;


var injectTapEventPlugin = require("react-tap-event-plugin");
//Needed for onTouchTap
//Can go away when react 1.0 release
//Check this repo:
//https://github.com/zilverline/react-tap-event-plugin
injectTapEventPlugin();

Application = React.createClass({

    displayName: 'Application',

    contextTypes: {
        router: React.PropTypes.func
    },

    propTypes: {
        flux: React.PropTypes.object.isRequired,
        route: React.PropTypes.string.isRequired
    },

    childContextTypes: {
        flux: React.PropTypes.object.isRequired
    },

    getChildContext: function() {
        return {
            flux: this.props.flux
        };
    },

    render: function () {
        return (
            <div>
                <RouteHandler />
            </div>
        );
    }
});

module.exports = Application;
