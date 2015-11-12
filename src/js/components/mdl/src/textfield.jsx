
/**
 *      REFERENCE http://www.getmdl.io/components/index.html#textfields-section
 *      React Events - https://facebook.github.io/react/docs/events.html
 *
 */
var React = require('react'),
    PureRenderMixin = require('react/addons').addons.PureRenderMixin,
    classNames = require('classnames'),
    assign = require('object-assign'),
    UpgradeMixin = require('../upgradeMixin.jsx'),
    TextField;

TextField = React.createClass({

    displayName: 'TextField',

    propTypes: {
        className: React.PropTypes.string,
        style: React.PropTypes.shape({
            base: React.PropTypes.object,
            input: React.PropTypes.object,
            disabledInput: React.PropTypes.object,
            label: React.PropTypes.object,
            disabledLabel: React.PropTypes.object,
            error: React.PropTypes.object
        }),
        key: React.PropTypes.string,
        name: React.PropTypes.string,
        disabled: React.PropTypes.bool,
        password: React.PropTypes.bool,
        multipleLines: React.PropTypes.bool,
        rows: React.PropTypes.number,
        expandable: React.PropTypes.bool,
        floatingLabel: React.PropTypes.bool,
        label: React.PropTypes.string,
        errorText: React.PropTypes.string
    },

    mixins: [PureRenderMixin, UpgradeMixin('textfield')],

    getDefaultProps: function () {
        return {
            disabled: false,
            password: false,
            multipleLines: false,
            rows: 2,
            expandable: false,
            floatingLabel: true,
            errorText: ''
        };
    },

    defaultStyles: {
        base: {
            width: '100%'
        },
        input: {
            textAlign: 'left'
        },
        disabledInput: { // TODO remove once the MDL is updated to it's newer version
            backgroundColor: 'transparent',
            borderBottom: '1px dotted rgba(0,0,0,.26)',
            color: 'rgba(0,0,0,.26)'
        },
        label: {},
        disabledLabel: { // TODO remove once the MDL is updated to it's newer version
            color: 'rgba(0,0,0,.26)'
        },
        error: {
            fontSize: 12,
            color: 'red'
        }
    },

    render: function () {
        var {
            className,
            style,
            key,    // react reference, this component is the only exception... reasons..
            name,
            disabled,
            password,
            multipleLines,
            rows,
            expandable,
            floatingLabel,
            label,
            errorText,
            ...otherProps
        } = this.props;

        var classes,
            inputComponent,
            labelComponent,
            errorComponent,
            baseStyle,
            inputStyle,
            labelStyle,
            errorStyle;

        baseStyle = style && style.base ? assign({}, this.defaultStyles.base, style.base) : this.defaultStyles.base;
        inputStyle = disabled ?
            assign({}, this.defaultStyles.input, this.defaultStyles.disabledInput) : this.defaultStyles.input;
        inputStyle = style && style.input ? assign({}, inputStyle, style.input) : inputStyle;
        labelStyle = disabled ?
            assign({}, this.defaultStyles.label, this.defaultStyles.disabledLabel) : this.defaultStyles.label;
        labelStyle = style && style.label ? assign({}, labelStyle, style.label) : labelStyle;
        errorStyle = style && style.error ? assign({}, this.defaultStyles.error, style.error) : this.defaultStyles.error;

        if (multipleLines) {
            inputComponent = (
                <textarea
                    name={name}
                    disabled={disabled}
                    style={inputStyle}
                    className="mdl-textfield__input"
                    type="text"
                    rows={rows}
                    id={this.theRef()}
                    {...otherProps} ></textarea>
            );
        } else {
            inputComponent = (
                <input
                    name={name}
                    disabled={disabled}
                    style={inputStyle}
                    className="mdl-textfield__input"
                    type={password ? 'password' : 'text'}
                    id={this.theRef()}
                    {...otherProps} />
            );
        }

        classes = classNames(['mdl-textfield', 'mdl-js-textfield'], {
            'mdl-textfield--floating-label': label ? floatingLabel ? true : false : false,
            'mdl-textfield--expandable': expandable,
            'is-dirty': inputComponent.props && inputComponent.props.valueLink ? inputComponent.props.valueLink.value : false        // fix for readonly fields and when the component uns remounted
        }, className);

        // if a label wasn't provided, use the name as the default one..
        label = label ? label : name;
        if (label) {
            labelComponent = (
                <label style={labelStyle} className="mdl-textfield__label" htmlFor={this.theRef()}>
                    {label}
                </label>
            );
        }

        if (errorText) {
            errorComponent = (
                <span style={errorStyle}>{errorText}</span>
            );
        }

        return (
            <div ref={this.theRef()} style={baseStyle} className={classes} key={key}>
                {inputComponent}
                {labelComponent}
                {errorComponent}
            </div>
        );
    }
});

module.exports = TextField;
