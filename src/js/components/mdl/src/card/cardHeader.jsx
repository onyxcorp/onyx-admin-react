var React = require('react'),
    classNames = require('classnames'),
    assign = require('object-assign'),
    CardHeader;


CardHeader = React.createClass({

    displayName: 'CardHeader',

    propTypes: {
        className: React.PropTypes.string,
        style: React.PropTypes.shape({
            base: React.PropTypes.object,
            text: React.PropTypes.object,
            title: React.PropTypes.object,
            subtitle: React.PropTypes.object
        }),
        avatar: React.PropTypes.element,
        title: React.PropTypes.string,
        subtitle: React.PropTypes.string
    },

    defaultStyles: {
        base: {
            height: 72,
            padding: 16,
            fontWeight: 18,
            boxSizing: 'border-box',
            position: 'relative'
        },
        text: {
            display: 'inline-block',
            verticalAlign: 'top'
        },
        title: {
            color: 'rgb(33, 33, 33)',       // #212121
            display: 'block',
            fontSize: 20,
            lineHeight: '30px'
        },
        subtitle: {
            color: 'rgb(117, 117, 117)',    // #757575
            display: 'block',
            fontSize: 15,
            lineHeight: '20px'
        }
    },

    render: function () {

        var {
            className,
            style,
            avatar,
            title,
            subtitle,
            children,
            ...otherProps
        } = this.props;

        var textContent,
            titleContent,
            subtitleContent,
            baseStyle,
            textStyle,
            titleStyle,
            subtitleStyle;

        baseStyle = style && style.base ? assign({}, this.defaultStyles.base, style.base) : this.defaultStyles.base;
        textStyle = style && style.text ? assign({}, this.defaultStyles.text, style.text) : this.defaultStyles.text;
        titleStyle = style && style.title ? assign({}, this.defaultStyles.title, style.title) : this.defaultStyles.title;
        subtitleStyle = style && style.subtitle ? assign({}, this.defaultStyles.subtitle, style.subtitle) : this.defaultStyles.subtitle;

        if (title || subtitle) {
            if (title) {
                titleContent = (
                    <span style={titleStyle}>{title}</span>
                );
            }

            if (subtitle) {
                subtitleContent = (
                    <span style={subtitleStyle}>{subtitle}</span>
                );
            }

            textContent = (
                <div style={textStyle}>
                    {titleContent}
                    {subtitleContent}
                </div>
            );
        }

        return (
            <div style={baseStyle} className={className} {...otherProps}>
                {avatar}
                {textContent}
                {children}
            </div>
        );
    }
});

module.exports = CardHeader;
