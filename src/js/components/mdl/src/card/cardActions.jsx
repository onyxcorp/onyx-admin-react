
/**
 *      REFERENCE http://www.getmdl.io/components/index.html#cards-section
 *
 */
var React = require('react'),
    PureRenderMixin = require('react/addons').addons.PureRenderMixin,
    classNames = require('classnames'),
    assign = require('object-assign'),
    UpgradeMixin = require('../../upgradeMixin.jsx'),
    CardActions;

CardActions = React.createClass({

    displayName: 'CardActions',

    propTypes: {
        className: React.PropTypes.string,
        style: React.PropTypes.object
    },

    mixins: [PureRenderMixin, UpgradeMixin('cardActions')],

    defaultStyles: {},

    render: function () {
        var {
            className,
            style,
            children,
            ...otherProps
        } = this.props;

        var classes = classNames(['mdl-card__actions', 'mdl-card--border'], className);

        return (
            <div ref={this.theRef()} style={assign({}, this.defaultStyles, style)} className={classes} {...otherProps}>
                {children}
            </div>
        );
    }
});

module.exports = CardActions;
