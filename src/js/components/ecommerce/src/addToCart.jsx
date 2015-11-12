
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
        color: React.PropTypes.string,
        raised: React.PropTypes.bool,
        colored: React.PropTypes.bool,
        fullWidth: React.PropTypes.bool,
        onAdd: React.PropTypes.func
    },

    mixins: [PureRenderMixin],

    getDefaultProps: function () {
        return {
            raised: false,
            colored: false,
            fullWidth: false
        };
    },

    _handleAdd: function () {
        if (this.props.onAdd) this.props.onAdd();
    },

    render: function () {

        var {
            className,
            style,
            color,
            raised,
            colored,
            fullWidth,
            onAdd,
            ...otherProps
        } = this.props;

        return (
            <Button style={assign({}, style)} colored={colored} raised={raised} icon='shopping_cart_plus' fullWidth={fullWidth} onClick={this._handleAdd} className={className} {...otherProps}>
                Adicionar
            </Button>
        );
    }
});

module.exports = AddToCart;
