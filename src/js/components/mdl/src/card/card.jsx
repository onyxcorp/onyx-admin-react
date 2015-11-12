
/**
 *      REFERENCE http://www.getmdl.io/components/index.html#cards-section
 *
 */
var React = require('react'),
    PureRenderMixin = require('react/addons').addons.PureRenderMixin,
    classNames = require('classnames'),
    assign = require('object-assign'),
    UpgradeMixin = require('../../upgradeMixin.jsx'),
    Paper = require('../paper.jsx'),
    Card;

Card = React.createClass({

    displayName: 'Card',

    propTypes: {
        className: React.PropTypes.string,
        shadow: React.PropTypes.number,
        style: React.PropTypes.object
    },

    mixins: [PureRenderMixin, UpgradeMixin('card')],

    getDefaultProps: function () {
        return {
            shadow: 2
        };
    },

    defaultStyles: {
        base: {
            padding: 0
        },
        card: {
            width: '100%'
        }
    },

    render: function () {
        var {
            className,
            shadow,
            style,
            children,
            ...otherProps
        } = this.props;

        var classes,
            baseStyle,
            cardStyle;

        classes = classNames(['mdl-card'], className);
        baseStyle = style && style.base ? assign({}, this.defaultStyles.base, style.base) : this.defaultStyles.base;
        cardStyle = style && style.card ? assign({}, this.defaultStyles.card, style.card) : this.defaultStyles.card;

        return (
            <Paper shadow={shadow} style={baseStyle} {...otherProps}>
                <div ref={this.theRef()} style={cardStyle} className={classes}>
                    {children}
                </div>
            </Paper>
        );
    }
});

module.exports = Card;
