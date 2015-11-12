
/**
 *      REFERENCE http://www.getmdl.io/components/index.html#tooltips-section
 *
 */
var React = require('react'),
    PureRenderMixin = require('react/addons').addons.PureRenderMixin,
    classNames = require('classnames'),
    assign = require('object-assign'),
    UpgradeMixin = require('../upgradeMixin.jsx'),
    Tooltip;

Tooltip = React.createClass({

    displayName: 'Tooltip',

    propTypes: {
        className: React.PropTypes.string,
        style: React.PropTypes.object,
        children: React.PropTypes.oneOfType([
            React.PropTypes.element,
            React.PropTypes.string
        ]).isRequired,
        label: React.PropTypes.oneOfType([
            React.PropTypes.element,
            React.PropTypes.string
        ]).isRequired,
        large: React.PropTypes.bool
    },

    getDefaultProps: function () {
        return {
            shadow: 2
        };
    },

    mixins: [PureRenderMixin, UpgradeMixin('tooltip')],

    defaultStyles: {
        display: 'inline-block'
    },

    render: function () {

        var {
            className,
            style,
            label,
            large,
            children,
            ...otherProps
        } = this.props;

        var id,
            element;

        id = id || this.theRef();

        if (typeof label === 'string') {
            label = <span>{label}</span>;
        }

        if (typeof children === 'string') {
            element = <span>{children}</span>;
        }
        else {
            element = React.Children.only(children);
        }

        return (
            <div ref={this.theRef()} style={style} {...otherProps}>
                {React.cloneElement(element, { id })}
                {React.cloneElement(label, {
                    htmlFor: id,
                    className: classNames('mdl-tooltip', {
                        'mdl-tooltip--large': large
                    })
                })}
            </div>
        );
    }
});

module.exports = Tooltip;
