
var React = require('react'),
    PureRenderMixin = require('react/addons').addons.PureRenderMixin,
    classNames = require('classnames'),
    assign = require('object-assign'),
    Avatar;

Avatar = React.createClass({

    displayName: 'Avatar',

    propTypes: {
        className: React.PropTypes.string,
        style: React.PropTypes.object,
        backgroundColor: React.PropTypes.string,
        borderColor: React.PropTypes.string,
        color: React.PropTypes.string,
        icon: React.PropTypes.element,
        size: React.PropTypes.number,
        src: React.PropTypes.string
    },

    mixins: [PureRenderMixin],

    getDefaultProps: function () {
        return {
            backgroundColor: '#ffffff',
            color: '#757575'
        };
    },

    defaultStyles: {
        height: 40,
        width: 40,
        userSelect: 'none',
        borderRadius: '50%',
        display: 'inline-block',
        WebkitUserSelect: 'none',
        border: 'solid 1px rgba(0, 0, 0, 0.08)',
        top: 12,
        left: 4,
        fill: '#757575'
    },

    render: function () {
        var {
            className,
            backgroundColor,
            borderColor,
            color,
            icon,
            size,
            src,
            style,
            children,
            ...otherProps,
        } = this.props,
            newStyles;

        var classes = classNames(className);

        if (src) {
            if (borderColor) {
                size = size || 40;
                newStyles = {
                    height: size - 2,
                    width: size - 2,
                    border: 'solid 1px ' + borderColor
                };
            }

            return (
                <img src={src} className={classes} style={assign({}, this.defaultStyles, newStyles)} />
            );

        } else {

            newStyles = {
                backgroundColor: backgroundColor,
                textAlign: 'center',
                lineHeight: size - 4 + 'px',
                fontSize: size/1.4 ,
                height: size,
                width: size,
                color: color
            };

            var iconElement = icon ? React.cloneElement(icon, {
                color: color,
                style: assign( {margin:8}, icon.props.style)
            }) : null;

            return (
                <div style={assign({}, this.defaultStyles, style, newStyles)} className={classes} {...otherProps}>
                    {iconElement}
                    {children}
                </div>
            );
        }
    }
});

module.exports = Avatar;
