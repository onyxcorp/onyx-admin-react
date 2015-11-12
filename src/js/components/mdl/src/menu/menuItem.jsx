
/**
 *      REFERENCES
 *      http://www.getmdl.io/components/index.html#layout-section
 *
 */

var React = require('react'),
    PureRenderMixin = require('react/addons').addons.PureRenderMixin,
    classNames = require('classnames'),
    assign = require('object-assign'),
    UpgradeMixin = require('../../upgradeMixin.jsx'),
    MenuItem;

MenuItem = React.createClass({

    displayName: 'MenuItem',

    propTypes: {
        className: React.PropTypes.string,
        style: React.PropTypes.object
    },

    mixins: [PureRenderMixin, UpgradeMixin('menuItem')],

    defaultStyle: {},

    render: function () {
        var {
            className,
            style,
            children,
            ...otherProps
        } = this.props;

        var classes = classNames(['mdl-menu__item'], className);

        return (
            <li ref={this.theRef()} style={assign({}, this.defaultStyle, style)} className={classes} {...otherProps}>
                {children}
            </li>
        );
    }
});

module.exports = MenuItem;
