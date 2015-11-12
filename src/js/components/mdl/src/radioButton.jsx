
/**
 *      REFERENCE http://www.getmdl.io/components/index.html#toggles-section/radio
 *
 */
var React = require('react'),
    PureRenderMixin = require('react/addons').addons.PureRenderMixin,
    classNames = require('classnames'),
    assign = require('object-assign'),
    UpgradeMixin = require('../upgradeMixin.jsx'),
    RadioButton;

RadioButton = React.createClass({

    displayName: 'RadioButton',

    propTypes: {
        className: React.PropTypes.string,
        style: React.PropTypes.shape({
            base: React.PropTypes.object,
            input: React.PropTypes.object,
            label: React.PropTypes.object
        }),
        onChange: React.PropTypes.func.isRequired,
        id: React.PropTypes.string,
        checked: React.PropTypes.oneOfType([    // TODO maybe remove all those possible types
            React.PropTypes.string,
            React.PropTypes.number,
            React.PropTypes.bool
        ]),
        value: React.PropTypes.oneOfType([
            React.PropTypes.string,
            React.PropTypes.number,
            React.PropTypes.bool
        ]),
        label: React.PropTypes.string.isRequired
    },

    mixins: [PureRenderMixin, UpgradeMixin('radio')],

    defaultStyles: {
        base: {},
        input: {},
        label: {}
    },

    _handleChange: function (event) {
        this.props.onChange(event.target.value);
    },

    render: function () {

        var {
            className,
            style,
            onChange,
            id,
            checked,
            value,
            label,
            ...otherProps
        } = this.props;

        var classes,
            currentId,
            baseStyle,
            inputStyle,
            labelStyle;

        classes = classNames({
            'mdl-radio': true,
            'mdl-js-radio': true,
            'mdl-js-ripple-effect': true
        }, className);

        currentId = id || this.theRef();

        baseStyle = style && style.base ? assign({}, this.defaultStyles.base, style.base) : this.defaultStyles.base;
        inputStyle = style && style.input ? assign({}, this.defaultStyles.input, style.input) : this.defaultStyles.input;
        labelStyle = style && style.label ? assign({}, this.defaultStyles.label, style.label) : this.defaultStyles.label;

        return (
            <label ref={this.theRef()} style={baseStyle} className={classes} htmlFor={currentId} {...otherProps}>
                <input
                    style={inputStyle}
                    type="radio"
                    id={currentId}
                    value={value}
                    className="mdl-radio__button"
                    onChange={this._handleChange}
                    checked={checked === value ? true : false} />
                <span style={labelStyle} className="mdl-radio__label">{label}</span>
            </label>
        );
    }
});

module.exports = RadioButton;
