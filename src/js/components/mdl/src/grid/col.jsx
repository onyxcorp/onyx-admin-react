
/**
 *      REFERENCE http://www.getmdl.io/components/index.html#cards-section
 *
 */
var React = require('react'),
    PureRenderMixin = require('react/addons').addons.PureRenderMixin,
    classNames = require('classnames'),
    assign = require('object-assign'),
    Col;

Col = React.createClass({

    displayName: 'Col',

    propTypes: {
        className: React.PropTypes.string,
        style: React.PropTypes.object,
        ca: React.PropTypes.oneOf([1,2,3,4,5,6,7,8,9,10,11,12]).isRequired,     // cell All
        cd: React.PropTypes.oneOf([1,2,3,4,5,6,7,8,9,10,11,12]).isRequired,     // cell Desktop
        ct: React.PropTypes.oneOf([1,2,3,4,5,6,7,8]).isRequired,                // cell Tablet
        cp: React.PropTypes.oneOf([1,2,3,4]).isRequired,                        // cell Phone
        hd: React.PropTypes.bool,                                               // hide Desktop
        ht: React.PropTypes.bool,                                               // hide Tablet
        hp: React.PropTypes.bool,                                               // hide Phone
        align: React.PropTypes.oneOf(['top', 'middle', 'bottom']),
        stretch: React.PropTypes.bool
    },

    getDefaultProps: function () {
        return {
            ca: 4,
            cd: 4,
            ct: 8,
            cp: 4,
            hd: false,
            ht: false,
            hp: false,
            align: 'top',
            stretch: false
        };
    },

    mixins: [PureRenderMixin],

    defaultStyles: {},

    render: function () {
        var {
            className,
            style,
            ca,
            cd,
            ct,
            cp,
            hd,
            ht,
            hp,
            align,
            stretch,
            children,
            ...otherProps
        } = this.props;

        var classes,
            cellSizeAll,
            cellSizeDesktop,
            cellSizeTablet,
            cellSizePhone,
            cellAlign;

        cellSizeAll = ' mdl-cell--'+ca+'-col';
        cellSizeDesktop = ' mdl-cell--'+cd+'-col-desktop';
        cellSizeTablet = ' mdl-cell--'+ct+'-col-tablet';
        cellSizePhone = ' mdl-cell--'+cp+'-col-phone';
        cellAlign = ' mdl-cell--'+align;

        classes = classNames(['mdl-cell'], {
            'mdl-cell--hide-desktop': hd,
            'mdl-cell--hide-tablet': ht,
            'mdl-cell--hide-phone': hp,
            'mdl-cell--stretch': stretch
        });

        classes = classes.concat(cellSizeAll, cellSizeDesktop, cellSizeTablet, cellSizePhone, cellAlign);

        return (
            <div style={assign({}, this.defaultStyles, style)} className={classes} {...otherProps}>
                {children}
            </div>
        );
    }
});

module.exports = Col;
