var React = require('react'),
    PureRenderMixin = require('react/addons').addons.PureRenderMixin,
    classNames = require('classnames'),
    assign = require('object-assign'),
    UpgradeMixin = require('../upgradeMixin.jsx'),
    Checkbox;

Checkbox = React.createClass({

    displayName: 'Checkbox',

    propTypes: {
        className: React.PropTypes.string,
        style: React.PropTypes.shape({
            base: React.PropTypes.object,
            input: React.PropTypes.object,
            label: React.PropTypes.object
        }),
        label: React.PropTypes.string,
        onChange: React.PropTypes.func.isRequired,
        id: React.PropTypes.string,
        checked: React.PropTypes.bool,
        disabled: React.PropTypes.bool,
        ripple: React.PropTypes.bool
    },

    mixins: [PureRenderMixin, UpgradeMixin('checkbox')],

    defaultStyles: {
        base: {},
        input: {},
        label: {}
    },

    _handleChange: function (event) {
        this.props.onChange(event.target.checked);
    },

    render: function () {
        var {
            className,
            style,
            label,
            onChange,
            id,
            checked,
            disabled,
            ripple,
            ...otherProps
        } = this.props;

        var classes,
            currentId,
            baseStyle,
            inputStyle,
            labelStyle;

        classes = classNames(['mdl-checkbox', 'mdl-js-checkbox'], {
            'mdl-js-ripple-effect': ripple
        });

        currentId = id || this.theRef();

        baseStyle = style && style.base ? assign({}, this.defaultStyles.base, style.base) : this.defaultStyles.base;
        inputStyle = style && style.input ? assign({}, this.defaultStyles.input, style.input) : this.defaultStyles.input;
        labelStyle = style && style.label ? assign({}, this.defaultStyles.label, style.label) : this.defaultStyles.label;

        return (
            <label ref={this.theRef()} style={baseStyle} className={classes} htmlFor={currentId} {...otherProps}>
                <input
                    style={labelStyle}
                    type="checkbox"
                    id={currentId}
                    className="mdl-checkbox__input"
                    checked={checked}
                    disabled={disabled}
                    onChange={this._handleChange} />

                {label ? <span style={labelStyle} className="mdl-checkbox__label">{label}</span> : null}

            </label>
        );
    }
});

module.exports = Checkbox;
