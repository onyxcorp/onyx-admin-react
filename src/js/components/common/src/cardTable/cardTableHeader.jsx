var React = require('react'),
    PureRenderMixin = require('react/addons').addons.PureRenderMixin,
    classNames = require('classnames'),
    assign = require('object-assign'),
    CardHeader = require('../../../mdl').CardHeader,
    CardTableHeader;

CardTableHeader = React.createClass({

    displayName: 'CardTableHeader',

    propTypes: {
        className: React.PropTypes.string,
        style: React.PropTypes.shape({
            base: React.PropTypes.object,
            primary: React.PropTypes.object,
            secondary: React.PropTypes.object
        }),
        primary: React.PropTypes.bool
    },

    mixins: [PureRenderMixin],

    getDefaultProps: function () {
        return {
            primary: true
        };
    },

    defaultStyles: {
        base: {
            textDecoration: 'none',
            display: 'flex',
            boxSizing: 'border-box',
            WebkitAlignItems: 'center',
            alignItems: 'center',
            WebkitJustifyContent: 'space-between',
            justifyContent: 'space-between'
        },
        primary: {
            background: 'rgb(255,255,255)'
        },
        secondary: {
            background: 'rgb(220,237,200)'  // lightest color of the current template
        }
    },

    render: function () {
        var {
            className,
            style,
            children,
            primary,
            ...otherProps
        } = this.props;

        var baseStyle,
            primaryStyle,
            secondaryStyle;

        baseStyle = style && style.base ? assign({}, this.defaultStyles.base, style.base) : this.defaultStyles.base;
        primaryStyle = style && style.primary ? assign({}, this.defaultStyles.primary, style.primary) : this.defaultStyles.primary;
        secondaryStyle = style && style.secondary ? assign({}, this.defaultStyles.secondary, style.secondary) : this.defaultStyles.secondary;

        baseStyle = primary ?
            assign({}, baseStyle, primaryStyle) :
            assign({}, baseStyle, secondaryStyle);

        return (
            <CardHeader
                style={{
                    base: baseStyle,
                    title: primary ? primaryStyle : secondaryStyle,
                    subtitle: primary ? primaryStyle : secondaryStyle}}
                    className={className}
                    {...otherProps}>
                {children}
            </CardHeader>
        );
    }
});

module.exports = CardTableHeader;
