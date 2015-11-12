
var React = require('react'),
    PureRenderMixin = require('react/addons').addons.PureRenderMixin,
    assign = require('object-assign'),
    Button = require('../../mdl').Button,
    AddToCart;

AddToCart = React.createClass({

    displayName: 'AddToCart',

    propTypes : {
        className: React.PropTypes.string,
        style: React.PropTypes.object,
        raised: React.PropTypes.bool,
        colored: React.PropTypes.bool,
        fullWidth: React.PropTypes.bool,
        type: React.PropTypes.string
    },

    mixins: [PureRenderMixin],

    getDefaultProps: function () {
        return {
            type: 'add'
        };
    },

    defaultStyle: {
        padding: 0
    },

    render: function () {

        var {
            className,
            style,
            color,
            raised,
            colored,
            fullWidth,
            type,
            ...otherProps
        } = this.props;

        var icon = type === 'add' ? 'add' : 'remove';

        return (
            <Button style={assign({}, this.defaultStyle, style)} colored={colored} raised={raised} icon={icon} iconButton fullWidth={fullWidth} className={className} {...otherProps} />
        );
    }
});

module.exports = AddToCart;
