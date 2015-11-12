
var React = require('react'),
    Immutable = require('immutable'),
    PureRenderMixin = require('react/addons').addons.PureRenderMixin,
    Link = require('react-router').Link,
    assign = require('object-assign'),
    AddToCart = require('./addToCart.jsx'),
    UpdateQuantity = require('./updateQuantity.jsx'),
    Price = require('./price.jsx'),
    Img = require('../../common').Img,
    Card = require('../../mdl').Card,
    CardMedia = require('../../mdl').CardMedia,
    CardTitle = require('../../mdl').CardTitle,
    CardSupportingText = require('../../mdl').CardSupportingText,
    CardActions =require('../../mdl').CardActions,
    ProductGridBlock;

ProductGridBlock = React.createClass({

    displayName: 'ProductGridBlock',

    propTypes: {
        className: React.PropTypes.string,
        style: React.PropTypes.object,
        readOnly: React.PropTypes.bool,
        title: React.PropTypes.string.isRequired,
        slug: React.PropTypes.string.isRequired,
        description: React.PropTypes.string,
        image: React.PropTypes.string.isRequired,
        price: React.PropTypes.string.isRequired,
        onAdd: React.PropTypes.func,
        onUpdate: React.PropTypes.func
    },

    mixins: [PureRenderMixin],

    getDefaultProps: function () {
        return {
            readOnly: true
        };
    },

    defaultStyles: {
        base: {},
        media: {
            textAlign: 'center'
        },
        actions: {
            display: 'flex',
            justifyContent: 'space-around',
            alignItems: 'center',
            WebkitAlignItems: 'center',
            textAlign: 'center'
        }
    },

    _handleAddQuantity: function () {
        if (this.props.onUpdate) this.props.onUpdate(1);
    },

    _handleSubtractQuantity: function () {
        if (this.props.onUpdate) this.props.onUpdate(-1);
    },

    _handleUpdateQuantity: function (quantity) {
        if (this.props.onUpdate) this.props.onUpdate(parseInt(quantity));
    },

    _handleAddToCart: function () {
        if (this.props.onAdd) this.props.onAdd();
    },

    render: function () {

        var {
            className,
            style,
            readOnly,
            title,
            slug,
            description,
            image,
            price,
            onAdd,
            onUpdate,
            ...otherProps
        } = this.props;

        var supportingText,
            updateQuantity,
            baseStyle,
            mediaStyle,
            actionsStyle;

        baseStyle = style && style.base ? assign({}, this.defaultStyles.base, style.base) : this.defaultStyles.base;
        mediaStyle = style && style.media ? assign({}, this.defaultStyles.media, style.media) : this.defaultStyles.media;
        actionsStyle = style && style.actions ? assign({}, this.defaultStyles.actions, style.actions) : this.defaultStyles.actions;

        if (!readOnly) {
            updateQuantity = (
                <UpdateQuantity
                    onAdd={this._handleAddQuantity}
                    onSubtract={this._handleSubtractQuantity}
                    onChange={this._handleUpdateQuantity} />
            );
        }

        if (description) {
            supportingText = (
                <CardSupportingText>
                    {description}
                </CardSupportingText>
            );
        }

        return (
            <Card style={baseStyle} shadow={4} {...otherProps}>
                <CardMedia style={mediaStyle}>
                    <Link to="product" params={{ slug : slug }}>
                        <Img src={image} alt={title} title={title} />
                    </Link>
                </CardMedia>
                <CardTitle>
                    {title}
                </CardTitle>
                {supportingText}
                <CardActions style={actionsStyle}>
                    <Price style={{fontSize: 20}}>{price}</Price>
                    {updateQuantity}
                    <AddToCart onAdd={this._handleAddToCart} />
                </CardActions>
            </Card>
        );
    }
});

module.exports = ProductGridBlock;
