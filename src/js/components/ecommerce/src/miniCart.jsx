var React = require('react'),
    PureRenderMixin = require('react/addons').addons.PureRenderMixin,
    assign = require('object-assign'),
    Button = require('../../mdl').Button,
    Badge = require('../../mdl').Badge,
    MiniCart;

MiniCart = React.createClass({

    displayName: 'MiniCart',

    propTypes: {
        className: React.PropTypes.string,
        classNameBadge: React.PropTypes.string,
        classNameButton: React.PropTypes.string,
        style: React.PropTypes.object,
        total: React.PropTypes.number,
        icon: React.PropTypes.string,
        onClick: React.PropTypes.func
    },

    getDefaultProps: function () {
        return {
            total: 0,
            icon: 'shopping_basket'
        };
    },

    mixins: [PureRenderMixin],

    defaultStyles: {
        base: {},
        badge: {
            textAlign: 'right'
        },
        button: {
            color: '#767777'
        }
    },

    render: function () {
        var {
            className,
            classNameBadge,
            classNameButton,
            style,
            total,
            icon,
            onClick,
            ...otherProps
        } = this.props;

        var baseStyle,
            badgeStyle,
            buttonStyle;

        baseStyle = style && style.base ? assign({}, this.defaultStyles.base, style.base) : this.defaultStyles.base;
        badgeStyle = style && style.badge ? assign({}, this.defaultStyles.badge, style.badge) : this.defaultStyles.badge;
        buttonStyle = style && style.button ? assign({}, this.defaultStyles.button, style.button) : this.defaultStyles.button;

        return (
            <div style={baseStyle} className={className} {...otherProps}>
                <Badge style={badgeStyle} data={total} classNames={classNameBadge}>
                     <Button style={buttonStyle} classNames={classNameButton} iconButton={true} icon={icon} onClick={onClick} />
                </Badge>
            </div>
        );
    }

});

module.exports = MiniCart;
