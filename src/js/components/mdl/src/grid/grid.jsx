
/**
 *      REFERENCE http://www.getmdl.io/components/index.html#cards-section
 *
 */
var React = require('react'),
    PureRenderMixin = require('react/addons').addons.PureRenderMixin,
    classNames = require('classnames'),
    assign = require('object-assign'),
    Grid;

Grid = React.createClass({

    displayName: 'Grid',

    propTypes: {
        className: React.PropTypes.string,
        style: React.PropTypes.object,
        noSpacing: React.PropTypes.bool,
        maxWidth: React.PropTypes.number
    },

    mixins: [PureRenderMixin],

    getDefaultProps: function () {
        return {
            maxWidth: 1280,
            noSpacing: false
        };
    },

    defaultStyles: {},

    render: function () {
        var {
            className,
            noSpacing,
            style,
            maxWidth,
            children,
            ...otherProps
        } = this.props;

        var classes = classNames(['mdl-grid'], {
            'mdl-grid--no-spacing': noSpacing
        }, className);

        return (
            <div style={assign({}, this.defaultStyles, style, {maxWidth: maxWidth})} className={classes} {...otherProps}>
                {children}
            </div>
        );
    }
});

module.exports = Grid;
