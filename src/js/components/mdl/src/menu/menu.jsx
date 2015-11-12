
/**
 *      REFERENCES
 *      http://www.getmdl.io/components/index.html#layout-section
 *      https://github.com/tleunen/react-mdl/blob/master/src/Menu.js
 *
 */

var React = require('react'),
    PureRenderMixin = require('react/addons').addons.PureRenderMixin,
    classNames = require('classnames'),
    assign = require('object-assign'),
    UpgradeMixin = require('../../upgradeMixin.jsx'),
    Menu;

Menu = React.createClass({

    displayName: 'Menu',

    propTypes: {
        className: React.PropTypes.string,
        style: React.PropTypes.object,
        align: React.PropTypes.oneOf(['left', 'right']),
        ripple: React.PropTypes.bool,
        target: React.PropTypes.string.isRequired,
        valign: React.PropTypes.oneOf(['bottom', 'top'])
    },

    mixins: [PureRenderMixin, UpgradeMixin('menu')],

    defaultStyle: {},

    render: function () {
        var {
            className,
            style,
            align,
            ripple,
            target,
            valign,
            children,
            ...otherProps
        } = this.props;

        align = align || 'right';
        valign = valign || 'bottom';
        // enable ripple by default
        ripple = ripple !== false;

        var classes = classNames(['mdl-menu', 'mdl-js-menu'], {
            ['mdl-menu--'+valign+'-'+align]: true,
            'mdl-js-ripple-effect': ripple
        }, className);

        return (
            <ul ref={this.theRef()} className={classes} style={assign({}, this.defaultStyle, style)} htmlFor={target} {...otherProps}>
                {children}
            </ul>
        );
    }
});

module.exports = Menu;
