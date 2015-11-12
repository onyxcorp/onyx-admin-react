
/**
 *      REFERENCES
 *      http://www.getmdl.io/components/index.html#layout-section
 *
 */

var React = require('react'),
    PureRenderMixin = require('react/addons').addons.PureRenderMixin,
    classNames = require('classnames'),
    assign = require('object-assign'),
    Spacer = require('./spacer.jsx'),
    UpgradeMixin = require('../upgradeMixin.jsx'),
    HeaderRow;

HeaderRow  = React.createClass({

    displayName: 'HeaderRow',

    propTypes: {
        className: React.PropTypes.string,
        style: React.PropTypes.object,
        title: React.PropTypes.oneOfType([
            React.PropTypes.string, React.PropTypes.element
        ])
    },


    mixins: [PureRenderMixin, UpgradeMixin('headerRow')],

    defaultStyles: {},

    render: function() {
        var {
            className,
            style,
            title,
            children,
            ...otherProps
        } = this.props;

        var classes = classNames('mdl-layout__header-row', className);

        return (
            <div ref={this.theRef()} style={assign({}, this.defaultStyles, style)} className={classes} {...otherProps}>
                {title ? <span className="mdl-layout-title">{title}</span> : null}
                <Spacer />
                {children}
            </div>
        );
    }
});

module.exports = HeaderRow ;
