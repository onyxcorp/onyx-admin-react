var React = require('react'),
    PureRenderMixin = require('react/addons').addons.PureRenderMixin,
    assign = require('object-assign'),
    Button = require('../../mdl').Button,
    BasketButton;

BasketButton = React.createClass({

    displayName: 'BasketButton',

    propTypes: {
        className: React.PropTypes.string,
        style: React.PropTypes.object
    },

    mixins: [PureRenderMixin],

    defaultStyles: {},

    render: function () {

        var {
            className,
            style,
            children,
            ...otherProps
        } = this.props;

        return (
            <Button style={assign({}, this.defaultStyles, style)} className={className} raised={true} colored={true} fullWidth={true} icon='shopping_basket' {...otherProps} >
                {children}
            </Button>
        );
    }
});

module.exports = BasketButton;
