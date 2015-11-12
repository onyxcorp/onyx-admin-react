
/**
 *      REFERENCE https://github.com/google/material-design-lite/tree/master/src/shadow
 *
 */
var React = require('react'),
    PureRenderMixin = require('react/addons').addons.PureRenderMixin,
    classNames = require('classnames'),
    assign = require('object-assign'),
    UpgradeMixin = require('../upgradeMixin.jsx'),
    Paper;

Paper = React.createClass({

    displayName: 'Paper',

    propTypes: {
        className: React.PropTypes.string,
        style: React.PropTypes.object,
        shadow: React.PropTypes.oneOf([0, 2, 3, 4, 6, 8, 16]).isRequired
    },

    getDefaultProps: function () {
        return {
            shadow: 2
        };
    },

    mixins: [PureRenderMixin, UpgradeMixin('paper')],

    defaultStyles: {
        padding: 15,
        backgroundColor: '#fff'
    },

    render: function () {
        var {
            className,
            style,
            shadow,
            children,
            ...otherProps
        } = this.props;

        var classes = classNames(['mdl-shadow--'+shadow+'dp'], className);

        return (
            <div ref={this.theRef()} style={assign({}, this.defaultStyles, style)} className={classes} {...otherProps}>
                {children}
            </div>
        );
    }
});

module.exports = Paper;
