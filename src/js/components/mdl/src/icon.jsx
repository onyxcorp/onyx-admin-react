
/**
 *      REFERENCE https://github.com/google/material-design-lite/tree/master/src/shadow
 *
 */
var React = require('react'),
    PureRenderMixin = require('react/addons').addons.PureRenderMixin,
    classNames = require('classnames'),
    assign = require('object-assign'),
    UpgradeMixin = require('../upgradeMixin.jsx'),
    Icon;

Icon = React.createClass({

    displayName: 'Icon',

    propTypes: {
        className: React.PropTypes.string,
        style: React.PropTypes.object,
        name: React.PropTypes.string.isRequired,
        size: React.PropTypes.number
    },

    getDefaultProps: function () {
        return {
            size: 22
        };
    },

    mixins: [PureRenderMixin, UpgradeMixin('icon')],

    defaultStyles: {},

    render: function () {
        var {
            className,
            style,
            name,
            size,
            ...otherProps
        } = this.props;

        var classes = classNames(['material-icons'], className);

        return (
            <i ref={this.theRef()} style={assign({}, this.defaultStyles, style, {fontSize: size})} className={classes} {...otherProps}>
                {name}
            </i>
        );
    }
});

module.exports = Icon;
