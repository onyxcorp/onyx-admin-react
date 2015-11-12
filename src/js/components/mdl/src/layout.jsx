
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
    Layout;

Layout = React.createClass({

    displayName: 'Layout',

    propTypes: {
        className: React.PropTypes.string,
        style: React.PropTypes.object,
        fixedDrawer: React.PropTypes.bool,
        fixedHeader: React.PropTypes.bool,
        fixedTabs: React.PropTypes.bool
    },

    mixins: [PureRenderMixin, UpgradeMixin('layout')],

    defaultStyles: {},

    render: function () {
        var {
            className,
            style,
            fixedDrawer,
            fixedHeader,
            fixedTabs,
            children,
            ...otherProps
        } = this.props;

        var classes = classNames(['mdl-layout', 'mdl-js-layout'], {
            'mdl-layout--fixed-drawer': fixedDrawer,
            'mdl-layout--fixed-header': fixedHeader,
            'mdl-layout--fixed-tabs': fixedTabs
        }, className);

        return (
            <div ref={this.theRef()} style={assign({}, this.defaultStyles, style)} className={classes} {...otherProps}>
                {children}
            </div>
        );
    }
});

module.exports = Layout;
