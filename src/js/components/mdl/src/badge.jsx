
/**
 *      REFERENCES
 *      http://www.getmdl.io/components/index.html#layout-section
 *
 */

var React = require('react'),
    PureRenderMixin = require('react/addons').addons.PureRenderMixin,
    classNames = require('classnames'),
    assign = require('object-assign'),
    UpgradeMixin = require('../upgradeMixin.jsx'),
    Badge;

Badge  = React.createClass({

    displayName: 'Badge',

    propTypes: {
        className: React.PropTypes.string,
        style: React.PropTypes.object,
        data: React.PropTypes.oneOfType([
            React.PropTypes.string,
            React.PropTypes.number
        ])
    },

    mixins: [PureRenderMixin, UpgradeMixin('badge')],

    defaultStyle: {},

    render: function() {
        var {
            className,
            data,
            style,
            children,
            ...otherProps
        } = this.props;

        var classes = classNames(['mdl-badge'], className);

        return (
            <span ref={this.theRef()} style={assign({}, this.defaultStyle, style)} className={classes} data-badge={data} {...otherProps}>
                {children}
            </span>
        );
    }
});

module.exports = Badge ;
