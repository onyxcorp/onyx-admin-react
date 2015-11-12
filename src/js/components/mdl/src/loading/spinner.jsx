
/**
 *      REFERENCE https://github.com/google/material-design-lite/tree/master/src/shadow
 *
 */
var React = require('react'),
    PureRenderMixin = require('react/addons').addons.PureRenderMixin,
    classNames = require('classnames'),
    assign = require('object-assign'),
    UpgradeMixin = require('../../upgradeMixin.jsx'),
    Spinner;

Spinner = React.createClass({

    displayName: 'Spinner',

    propTypes: {
        className: React.PropTypes.string,
        style: React.PropTypes.object,
        singleColor: React.PropTypes.bool,
        isActive: React.PropTypes.bool
    },

    getDefaultProps: function () {
        return {
            singleColor: false,
            isActive: true
        };
    },

    mixins: [PureRenderMixin, UpgradeMixin('spinner')],

    defaultStyles: {
        margin: 15
    },

    render: function () {
        var {
            className,
            singleColor,
            isActive,
            style,
            ...otherProps
        } = this.props;

        var classes = classNames(['mdl-spinner', 'mdl-js-spinner'], {
            'is-active': isActive,
            'mdl-spinner--single-color': singleColor
        }, className);

        return (
            <div ref={this.theRef()} style={assign({}, this.defaultStyles, style)} className={classes} {...otherProps} />
        );
    }
});

module.exports = Spinner;
