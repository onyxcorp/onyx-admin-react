
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
    Drawer;

Drawer = React.createClass({

    displayName: 'Drawer',

    propTypes: {
        className: React.PropTypes.string,
        title: React.PropTypes.oneOfType([React.PropTypes.string, React.PropTypes.element]),
        style: React.PropTypes.object
    },

    mixins: [PureRenderMixin, UpgradeMixin('drawer')],

    defaultStyles: {},

    render: function () {

        var {
            className,
            title,
            style,
            children,
            ...otherProps
        } = this.props;

        var classes = classNames('mdl-layout__drawer', className);

        return (
            <div ref={this.theRef()} style={assign({}, this.defaultStyle, style)} className={classes} {...otherProps}>
                {title ? <span className="mdl-layout-title">{title}</span> : null}
                {children}
            </div>
        );
    }
});

module.exports = Drawer;
