var React = require('react'),
    PureRenderMixin = require('react/addons').addons.PureRenderMixin,
    Immutable = require('immutable'),
    assign = require('object-assign'),
    FacebookButton = require("react-social").FacebookButton,
    FacebookCount = require("react-social").FacebookCount,
    Button = require('../../../mdl').Button,
    CommonFacebookButton;

CommonFacebookButton = React.createClass({

    displayName: 'CommonFacebookButton',

    propTypes: {
        className: React.PropTypes.string,
        style: React.PropTypes.shape({
            base: React.PropTypes.object,
            button: React.PropTypes.object,
            icon: React.PropTypes.object,
            counter: React.PropTypes.object
        }),
        url: React.PropTypes.string.isRequired
    },

    mixins: [PureRenderMixin],

    defaultStyles: {
        base: {
            marginRight: 10
        },
        button: {
            backgroundColor: '#3c4c84',
            width: 80
        },
        icon: {
            float: 'left',
            paddingLeft: 2,
            paddingTop: 1,
            display: 'inline-block'
        },
        counter: {
            float: 'right',
            paddingLeft: 7,
            paddingRight: 7,
            background: '#fff',
            display: 'inline-block',
            marginLeft: 25,
            borderRadius: 5,
            height: 21,
            verticalAlign: 'middle',
            marginTop: -21,
            fontWeight: 300,
            lineHeight: 1.5
        }
    },

    render: function () {
        var {
            className,
            style,
            url,
            ...otherProps
        } = this.props;

        var baseStyle,
            buttonStyle,
            iconStyle,
            counterStyle;

        baseStyle = style && style.base ? assign({}, this.defaultStyles.base, style.base) : this.defaultStyles.base;
        buttonStyle = style && style.button ? assign({}, this.defaultStyles.button, style.button) : this.defaultStyles.button;
        iconStyle = style && style.icon ? assign({}, this.defaultStyles.icon, style.icon) : this.defaultStyles.icon;
        counterStyle = style && style.counter ? assign({}, this.defaultStyles.counter, style.counter) : this.defaultStyles.counter;

        return (
            <FacebookButton style={baseStyle} element='span' url={url} className={className} {...otherProps}>
                <Button style={buttonStyle}>
                    <i style={iconStyle} className='social- socialIcon'>b</i>
                    <FacebookCount style={counterStyle} url={url} />
                </Button>
            </FacebookButton>
        );
    }
});

module.exports = CommonFacebookButton;
