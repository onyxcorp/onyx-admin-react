
var React = require('react'),
    PureRenderMixin = require('react/addons').addons.PureRenderMixin,
    assign = require('object-assign'),
    FormActions;

FormActions = React.createClass({

    displayName: 'FormActions',

    propTypes: {
        className: React.PropTypes.string,
        style: React.PropTypes.object,
        vAlign: React.PropTypes.oneOf([     // more info at http://www.w3schools.com/cssref/playit.asp?filename=playcss_align-items&preval=stretch
            'top', 'bottom', 'stretch', 'baseline', 'center'
        ]),
        hAlign: React.PropTypes.oneOf([
            'left', 'right', 'center', 'between', 'around'
        ]),
        divider: React.PropTypes.bool
    },

    mixins: [PureRenderMixin],  // automatically uses shouldComponentUpdate

    getDefaultProps: function () {
        return {
            divider: false,
            vAlign: 'center',
            hAlign: 'center'
        };
    },

    defaultStyles: {
        borderTop: '1px solid rgba(0,0,0,.1)',
        fontSize: '16px',
        lineHeight: 'normal',
        backgroundColor: 'transparent',
        marginTop: '20px',
        padding: '8px',
        textDecoration: 'none',
        display: 'flex',
        boxSizing: 'border-box',
        WebkitAlignItems: 'center',     // vertical alignment
        alignItems: 'center',           // vertical alignment
        WebkitJustifyContent: 'center',   // horizontal alignment
        justifyContent: 'center'          // horizontal alignment
    },

    _changeCSSAlignment: function (styles, hAlign, vAlign) {

        var horizontalFlexAlignment,
            verticalFlexAlignment;

        switch(hAlign) {
            case 'left':
                horizontalFlexAlignment = 'flex-start';
                break;
            case 'right':
                horizontalFlexAlignment = 'flex-end';
                break;
            case 'center':
                horizontalFlexAlignment = 'center';
                break;
            case 'between':
                horizontalFlexAlignment = 'space-between';
                break;
            case 'around':
                horizontalFlexAlignment = 'space-around';
                break;
        }

        switch(vAlign) {
            case 'top':
                verticalFlexAlignment = 'flex-start';
                break;
            case 'bottom':
                verticalFlexAlignment = 'flex-end';
                break;
            case 'stretch':
                verticalFlexAlignment = 'stretch';
                break;
            case 'baseline':
                verticalFlexAlignment = 'baseline';
                break;
            case 'center':
                verticalFlexAlignment = 'center';
                break;
        }

        return assign({}, styles, {
            WebkitAlignItems: verticalFlexAlignment,
            alignItems: verticalFlexAlignment,
            WebkitJustifyContent: horizontalFlexAlignment,
            justifyContent: horizontalFlexAlignment
        });
    },

    render: function () {

        var {
            className,
            style,
            vAlign,
            hAlign,
            divider,
            children,
            ...otherProps
        } = this.props;

        var baseStyle = assign({}, this.defaultStyles, style);

        baseStyle = this._changeCSSAlignment(baseStyle, hAlign, vAlign);

        if (!divider) delete baseStyle.borderTop;

        return (
            <div style={baseStyle} className={className} {...otherProps}>
                {children}
            </div>
        );
    }
});

module.exports = FormActions;
