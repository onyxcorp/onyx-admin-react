
/**
 *      REFERENCE http://www.getmdl.io/components/index.html#cards-section
 *
 */
var React = require('react'),
    PureRenderMixin = require('react/addons').addons.PureRenderMixin,
    classNames = require('classnames'),
    assign = require('object-assign'),
    UpgradeMixin = require('../../upgradeMixin.jsx'),
    CardSupportingText;

CardSupportingText = React.createClass({

    displayName: 'CardSupportingText',

    propTypes: {
        className: React.PropTypes.string,
        style: React.PropTypes.object
    },

    mixins: [PureRenderMixin, UpgradeMixin('cardSupportingText')],

    defaultStyles: {},

    render: function () {
        var {
            className,
            style,
            children,
            ...otherProps
        } = this.props;

        var classes = classNames(['mdl-card__supporting-text'], className);

        return (
            <div ref={this.theRef()} className={classes} style={assign({}, this.defaultStyles, style)} {...otherProps}>
                {children}
            </div>
        );
    }
});

module.exports = CardSupportingText;
