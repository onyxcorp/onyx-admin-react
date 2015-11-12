
/**
 *      REFERENCES
 *      http://www.getmdl.io/components/index.html#layout-section
 *
 */

var React = require('react'),
    PureRenderMixin = require('react/addons').addons.PureRenderMixin,
    classNames = require('classnames'),
    assign = require('object-assign'),
    UpgradeMixin = require('../../upgradeMixin.jsx'),
    ListItem;

ListItem = React.createClass({

    displayName: 'ListItem',

    propTypes: {
        className: React.PropTypes.string,
        style: React.PropTypes.shape({
            base: React.PropTypes.object,
            inner: React.PropTypes.object,
            primaryText: React.PropTypes.object,
            secondaryText: React.PropTypes.object,
            leftIcon: React.PropTypes.object,
            alternateLeftIcon: React.PropTypes.object,
            rightIcon: React.PropTypes.object
        }),
        leftIcon: React.PropTypes.element,      // react element
        leftIconStyleType: React.PropTypes.oneOf(['primary', 'alternate']),
        rightIcon: React.PropTypes.element,
        primaryText: React.PropTypes.string,
        secondaryText: React.PropTypes.string
    },

    mixins: [PureRenderMixin, UpgradeMixin('listItem')],

    getDefaultProps: function () {
        return {
            leftIconStyleType: 'alternate'
        };
    },

    defaultStyles: {
        base: {
            border: '10px',
            boxSizing: 'border-box',
            fontStyle: 'inherit',
            fontVariant: 'inherit',
            fontWeight: 'inherit',
            fontStretch: 'inherit',
            fontFamily: 'Roboto, sans-serif',
            display: 'block',
            WebkitFlexShrink: 0,
            MsFlexNegative: 0,
            flexShrink: 0,
            fontSize: '16px',
            lineHeight: '16px',
            position: 'relative',
            margin: 0,
            cursor: 'pointer',
            color: '#757575',
            textDecoration: 'none'
        },
        inner: {
            marginLeft: 0,
            paddingLeft: '72px',
            paddingRight: '16px',
            paddingBottom: '16px',
            paddingTop: '20px',
            position: 'relative'
        },
        primaryText: {
            display: 'inline-block'
        },
        secondaryText: {
            fontSize: '14px',
            lineHeight: '16px',
            height: '16px',
            margin: 0,
            marginTop: '4px',
            color: 'rgba(0, 0, 0, 0.54)',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap'
        },
        leftIcon: {
            height: '40px',
            width: '40px',
            WebkitUserSelect: 'none',
            borderRadius: '50%',
            display: 'inline-block',
            backgroundColor: '#bdbdbd',
            textAlign: 'center',
            lineHeight: '40px',
            fontSize: '24px',
            color: '#ffffff',
            top: '8px',
            left: '16px'
        },
        alternateLeftIcon: {
            WebkitUserSelect: 'none',
            display: 'inline-block',
            top: '-12px',
            left: '4px',
            padding: '12px',
            color: '#757575',
            fill: '#757575'
        },
        rightIcon: {
            display: 'inline-block',
            WebkitUserSelect: 'none',
            transition: 'all 450ms cubic-bezier(0.23, 1, 0.32, 1) 0ms',
            position: 'absolute',
            top: '12px',
            padding: '12px',
            color: '#bdbdbd',
            fill: '#bdbdbd',
            right: '4px'
        }
    },

    render: function () {

        var {
            className,
            style,
            leftIcon,
            leftIconStyleType,
            rightIcon,
            primaryText,
            secondaryText,
            ...otherProps,
        } = this.props;

        var baseStyle,
            innerStyle,
            primaryTextStyle,
            secondaryTextStyle,
            leftIconStyle,
            rightIconStyle,
            leftIconComponent,
            rightIconComponent;

        baseStyle = style && style.base ? assign({}, this.defaultStyles.base, style.base) : this.defaultStyles.base;

        innerStyle =
            rightIcon ?
                assign({}, this.defaultStyles.inner, {paddingRight: '56px'}) : this.defaultStyles.inner;
        innerStyle = style && style.inner ? assign({}, innerStyle, style.inner) : innerStyle;

        primaryTextStyle = style && style.primaryText ? assign({}, this.defaultStyles.primaryText, style.primaryText) : this.defaultStyles.primaryText;
        secondaryTextStyle = style && style.secondaryText ? assign({}, this.defaultStyles.secondaryText, style.secondaryText) : this.defaultStyles.secondaryText;
        rightIconStyle = style && style.rightIcon ? assign({}, this.defaultStyles.rightIcon, style.rightIcon) : this.defaultStyles.rightIcon;

        leftIconStyle =
            secondaryText ?
                {top: '16px'} : {};
        leftIconStyle =
            leftIconStyleType === 'primary' ?
                assign({}, this.defaultStyles.leftIcon, leftIconStyle)  :
                assign({}, this.defaultStyles.alternateLeftIcon, leftIconStyle);
        leftIconStyle = style && style.leftIcon ? assign({}, leftIconStyle, style.leftIcon) : leftIconStyle;

        // clone the icon with the new styles from above
        leftIconComponent = leftIcon ? React.cloneElement(leftIcon, { style: leftIconStyle}) : null;
        rightIconComponent = rightIcon ? React.cloneElement(rightIcon, { style: rightIconStyle}) : null;

        return (
            <a ref={this.theRef()} style={baseStyle} className={className} {...otherProps}>
                <div style={innerStyle}>
                    {rightIconComponent}
                    <div style={{position: 'absolute', marginLeft: -60, marginTop: -5}}>{leftIconComponent}</div>
                    <div style={primaryTextStyle}>{primaryText}</div>
                    <div style={secondaryTextStyle}>{secondaryText}</div>
                </div>
            </a>
        );
    }
});

module.exports = ListItem;
