
/**
 *      REFERENCES
 *      http://www.getmdl.io/components/index.html#sliders-section
 *
 */

var React = require('react'),
    PureRenderMixin = require('react/addons').addons.PureRenderMixin,
    classNames = require('classnames'),
    assign = require('object-assign'),
    UpgradeMixin = require('../upgradeMixin.jsx'),
    Slider;

Slider = React.createClass({

    displayName: 'Slider',

    propTypes: {
        className: React.PropTypes.string,
        style: React.PropTypes.shape({
            base: React.PropTypes.object,
            input: React.PropTypes.object
        }),
        min: React.PropTypes.number.isRequired,
        max: React.PropTypes.number.isRequired,
        onChange: React.PropTypes.func.isRequired,
        defaultValue: React.PropTypes.number,
        disabled: React.PropTypes.bool
    },

    getDefaultProps: function () {
        return {
            min: 0,
            max: 100,
            defaultValue: 50,
            disabled: false
        };
    },

    getInitialState: function () {
        return {
            value: this.props.defaultValue
        };
    },

    mixins: [PureRenderMixin, UpgradeMixin('slider')],

    defaultStyles: {
        base: {
            width: '100%'
        },
        input: {}

    },

    _handleChange: function (event) {
        var currentValue = parseFloat(event.target.value);
        this.setState({
            value: currentValue
        });
        this.props.onChange(currentValue);
    },

    render: function () {
        var {
            className,
            style,
            min,
            max,
            onChange,
            defaultValue,
            disabled,
            ...otherProps,
        } = this.props;

        var classes,
            baseStyle,
            inputStyle;

        classes = classNames(['mdl-slider', 'mdl-js-slider'], className);

        baseStyle = style && style.base ? assign({}, this.defaultStyles.base, style.base) : this.defaultStyles.base;
        inputStyle = style && style.input ? assign({}, this.defaultStyles.input, style.input) : this.defaultStyles.input;

        return (
            <p style={baseStyle} {...otherProps}>
                <input
                    ref={this.theRef()}
                    style={inputStyle}
                    className={classes}
                    type="range"
                    min={min}
                    max={max}
                    value={this.state.value}
                    tabIndex="0"
                    disabled={disabled}
                    onChange={this._handleChange} />
            </p>
        );
    }
});

module.exports = Slider;
