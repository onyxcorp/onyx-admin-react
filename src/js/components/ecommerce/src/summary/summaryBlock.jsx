
var React = require('react'),
    PureRenderMixin = require('react/addons').addons.PureRenderMixin,
    assign = require('object-assign'),
    BasketButton = require('../basketButton.jsx'),
    Card = require('../../../mdl').Card,
    CardTitle = require('../../../mdl').CardTitle,
    CardSupportingText = require('../../../mdl').CardSupportingText,
    CardActions = require('../../../mdl').CardActions,
    List = require('../../../mdl').List,
    ListItem = require('../../../mdl').ListItem,
    SummaryItem = require('./summaryItem.jsx'),
    ProductSummary;

ProductSummary = React.createClass({

    displayName: 'ProductSummary',

    propTypes: {
        className: React.PropTypes.string,
        style: React.PropTypes.object,
        currency: React.PropTypes.string,
        subTotal: React.PropTypes.string,
        shipping: React.PropTypes.string,
        total: React.PropTypes.string,
        subHeaderText: React.PropTypes.string,
        buttonText: React.PropTypes.string,
        showEmpty: React.PropTypes.bool,
        children: React.PropTypes.arrayOf(function(props, propName, componentName) {
            if(props[propName].type !== SummaryItem) {
                return new Error('`' + componentName + '` only accepts `SummaryItem` as children.');
            }
        }),
        onCheckout: React.PropTypes.func
    },

    mixins: [PureRenderMixin],

    getDefaultProps: function () {
        return {
            currency: 'R$',
            subHeaderText: 'Produtos',
            buttonText: 'Ver carrinho',
            showEmpty: true
        };
    },

    defaultStyles: {
        base: {
            marginTop: 0,
            border: 0
        },
        summaryBoxes: {
            display: 'flex',
            boxSizing: 'border-box',
            WebkitAlignItems: 'center',
            alignItems: 'center',
            WebkitJustifyContent: 'space-between',
            justifyContent: 'space-between',
            margin: '15px 0',
            padding: '8px 16px'
        }
    },

    _handleCheckout: function () {
        if (this.props.onCheckout) this.props.onCheckout();
    },

    render: function () {
        var {
            className,
            style,
            currency,
            subTotal,
            shipping,
            total,
            subHeaderText,
            buttonText,
            showEmpty,
            onCheckout,
            children,
            ...otherProps
        } = this.props;

        var products,
            subTotalSummary,
            shippingSummary,
            totalSummary,
            summary,
            checkoutButton,
            baseStyle,
            subTotalStyle,
            shippingStyle,
            totalStyle;

        baseStyle = style && style.base ? assign({}, this.defaultStyles.base, style.base) : this.defaultStyles.base;
        subTotalStyle = style && style.subTotal ? assign({}, this.defaultStyles.summaryBoxes, style.subTotal) : this.defaultStyles.summaryBoxes;
        shippingStyle = style && style.shipping ? assign({}, this.defaultStyles.summaryBoxes, style.shipping) : this.defaultStyles.summaryBoxes;
        totalStyle = style && style.total ? assign({}, this.defaultStyles.summaryBoxes, style.total) : this.defaultStyles.summaryBoxes;

        if (React.Children.count(this.props.children)) {
            products = (
                <CardSupportingText style={{
                        width: '100%',
                        padding: 0
                    }}>
                    <List subHeader={subHeaderText} style={{list: baseStyle}} className={className} {...otherProps}>
                        {children}
                    </List>
                </CardSupportingText>
            );
            checkoutButton = (
                <BasketButton onClick={this._handleCheckout}>{buttonText}</BasketButton>
            );
        } else if (showEmpty) {
            products = (
                <ListItem primaryText='Carrinho vazio' />
            );
            checkoutButton = (
                <BasketButton disabled={true} onClick={this._handleCheckout}>{buttonText}</BasketButton>
            );
        }

        if (subTotal) {
            subTotalSummary = (
                <p style={subTotalStyle}>
                    <strong>Subtotal</strong>
                    <span>{currency} {subTotal}</span>
                </p>
            );
        }

        if (shipping) {
            shippingSummary = (
                <p style={shippingStyle}>
                    <strong>Frete</strong>
                    <span>{currency} {shipping}</span>
                </p>
            );
        }

        if (total) {
            totalSummary = (
                <p style={totalStyle}>
                    <strong>Total</strong>
                    <strong>{currency} {total}</strong>
                </p>
            );
        }

        return (
            <Card>
                <CardTitle>Orçamento</CardTitle>
                {products}
                <CardSupportingText style={{
                        width: '100%',
                        padding: 0
                    }}>
                    {subTotalSummary}
                    {shippingSummary}
                    {totalSummary}
                </CardSupportingText>
                <CardActions>
                    {checkoutButton}
                </CardActions>
            </Card>
        );
    }
});

module.exports = ProductSummary;
