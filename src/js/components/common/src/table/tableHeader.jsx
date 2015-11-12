
var React = require('react'),
    Immutable = require('immutable'),
    PureRenderMixin = require('react/addons').addons.PureRenderMixin,
    assign = require('object-assign'),
    CommonTableHeader;

CommonTableHeader = React.createClass({

    displayName: 'CommonTableHeader',

    propTypes: {
        className: React.PropTypes.string,
        style: React.PropTypes.object
    },

    mixins: [PureRenderMixin],

    defaultStyles: {},

    render: function () {

        return (
            <h1>Table Header</h1>
        );
    }
});

module.exports = CommonTableHeader;
