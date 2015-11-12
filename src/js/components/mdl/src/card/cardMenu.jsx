
/**
 *      REFERENCE http://www.getmdl.io/components/index.html#cards-section
 *
 */
var React = require('react'),
    PureRenderMixin = require('react/addons').addons.PureRenderMixin,
    classNames = require('classnames'),
    assign = require('object-assign'),
    UpgradeMixin = require('../../upgradeMixin.jsx'),
    CardMenu;

CardMenu = React.createClass({

    displayName: 'CardMenu',

    propTypes: {
        className: React.PropTypes.string,
        style: React.PropTypes.object
    },

    mixins: [PureRenderMixin, UpgradeMixin('cardMenu')],

    defaultStyles: {},

    render: function () {

        var {
            className,
            style,
            children,
            ...otherProps
        } = this.props;

        var classes = classNames(['mdl-card__menu'], className);

        return (
            <div ref={this.theRef()} className={classes} style={assign({}, this.defaultStyles, style)} {...otherProps}>
                {children}
            </div>
        );
    }
});

module.exports = CardMenu;
