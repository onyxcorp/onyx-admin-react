
var React = require('react'),
    PureRenderMixin = require('react/addons').addons.PureRenderMixin,
    assign = require('object-assign'),
    ListItem = require('../../../mdl').ListItem,
    Button = require('../../../mdl').Button,
    Avatar = require('../../../mdl').Avatar,
    ProductItem;

ProductItem = React.createClass({

    displayName: 'ProductItem',

    propTypes: {
        className: React.PropTypes.string,
        style: React.PropTypes.object,
        readOnly: React.PropTypes.bool,
        currency: React.PropTypes.string,
        onRemove: React.PropTypes.func,
        tooltip: React.PropTypes.string,
        title: React.PropTypes.string.isRequired,
        image: React.PropTypes.string.isRequired,
        quantity: React.PropTypes.number.isRequired,
        price: React.PropTypes.string,
        total: React.PropTypes.string
    },

    getDefaultProps: function () {
        return {
            readOnly: false,
            currency: 'R$',
            tooltip: 'Remover da Lista'
        };
    },

    mixins: [PureRenderMixin],

    defaultStyles: {},

    _handleRemove: function () {
        if (this.props.onRemove) this.props.onRemove();
    },

    render: function () {

        var {
            className,
            style,
            readOnly,
            currency,
            tooltip,
            onRemove,
            title,
            image,
            quantity,
            price,
            total,
            ...otherProps
        } = this.props;

        var rightIcon,
            secondaryText;

        if (price && total) {
            secondaryText = currency + ' ' + price + ' x ' + quantity + ' = ' + currency + ' ' + total;
        } else if (total) {
            secondaryText = 'x ' + quantity + ' - Total ' + currency + ' ' + total;
        } else {
            secondaryText = 'x ' + quantity;
        }

        if (readOnly) {
            // rightIcon = (
            //
            // );
        } else {
            rightIcon = (
                <Button iconButton={true} icon="remove_circle_outline" onClick={this._handleRemove} tooltip={tooltip} />
            );
        }

        return (
            <ListItem
                style={assign({}, this.defaultStyles, style)}
                className={className}
                leftIcon={<Avatar src={image} />}
                rightIcon={rightIcon}
                primaryText={title}
                secondaryText={secondaryText}
                {...otherProps} />
        );
    }
});

module.exports = ProductItem;
