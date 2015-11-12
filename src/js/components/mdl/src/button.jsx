
var React = require('react'),
    PureRenderMixin = require('react/addons').addons.PureRenderMixin,
    classNames = require('classnames'),
    assign = require('object-assign'),
    UpgradeMixin = require('../upgradeMixin.jsx'),
    Icon = require('./icon.jsx'),
    Button;

Button = React.createClass({

    displayName: 'Button',

    propTypes: {
        className: React.PropTypes.string,
        style: React.PropTypes.object,
        id: React.PropTypes.string,
        icon: React.PropTypes.string,
        iconButton: React.PropTypes.bool,
        fab: React.PropTypes.bool,
        mini: React.PropTypes.bool,
        raised: React.PropTypes.bool,
        colored: React.PropTypes.bool,
        ripple: React.PropTypes.bool,
        fullWidth: React.PropTypes.bool,
        disabled: React.PropTypes.bool
    },

    getDefaultProps: function () {
        return {
            iconButton: false,
            fab: false,
            mini: false,
            raised: false,
            colored: false,
            ripple: true,
            fullWidth: false,
            disabled: false
        };
    },

    mixins: [PureRenderMixin, UpgradeMixin('button')],

    defaultStyles: {
        paddingLeft: 10,
        paddingRight: 10
    },

    render: function () {
        var {
            className,
            style,
            id,
            iconButton,
            fab,
            mini,
            raised,
            colored,
            ripple,
            fullWidth,
            disabled,
            icon,
            children,
            ...otherProps
        } = this.props;

        var classes,
            iconComponent;

        classes = classNames(['mdl-button', 'mdl-js-button'], {
            'mdl-button--fab': fab,
            'mdl-button--mini-fab': fab ? mini : false,
            'mdl-button--icon': fab ? false : iconButton,
            'mdl-button--raised': fab ? false : iconButton ? false : raised,
            'mdl-js-ripple-effect': iconButton ? false : ripple,
            'mdl-button--colored': iconButton ? false : colored,
            'isFullWidth': fab ? false : iconButton ? false : fullWidth
        }, className);

        if (icon) {
            iconComponent = (
                <Icon style={{paddingRight:8, width: 31}} name={icon} />
            );
        }

        // The reason behind the ... type="button" bellow
        // https://github.com/facebook/react/issues/2093
        return (
            <button ref={this.theRef()} style={assign({}, this.defaultStyles, style)} id={id || this.theRef()} type="button" className={classes} disabled={disabled} {...otherProps}>
                {iconComponent}
                {iconButton ? null : children}
            </button>
        );
    }
});

module.exports = Button;
