
/**
 *      REFERENCES
 *      http://www.getmdl.io/components/index.html#layout-section
 *
 */

var React = require('react'),
    PureRenderMixin = require('react/addons').addons.PureRenderMixin,
    classNames = require('classnames'),
    assign = require('object-assign'),
    UpgradeMixin = require('../../upgradeMixin.jsx'),
    Paper = require('../paper.jsx'),
    List;

List = React.createClass({

    displayName: 'List',

    propTypes: {
        className: React.PropTypes.string,
        style: React.PropTypes.shape({
            base: React.PropTypes.object,
            subHeader: React.PropTypes.object,
            list: React.PropTypes.object
        }),
        shadow: React.PropTypes.number,
        subHeader: React.PropTypes.string
    },

    mixins: [PureRenderMixin, UpgradeMixin('list')],

    getDefaultProps: function () {
        return {
            shadow: 2
        };
    },

    defaultStyles: {
        base: {
            padding: 0
        },
        subHeader: {
            color: 'rgba(0, 0, 0, 0.54)',
            fontSize: '14px',
            fontWeight: 500,
            lineHeight: '26px',
            paddingLeft: '16px',
            paddingTop: '10px'
        },
        list: {
            backgroundColor: '#fff',
            marginTop: '10px',
            border: 'solid 1px #d9d9d9',
            overflow: 'hidden'
        }
    },

    render: function () {
        var {
            className,
            style,
            shadow,
            subHeader,
            children,
            ...otherProps
        } = this.props;

        var classes,
            baseStyle,
            subHeaderStyle,
            listStyle;

        classes = classNames(className);

        baseStyle = style && style.base ? assign({}, this.defaultStyles.base, style.base) : this.defaultStyles.base;
        subHeaderStyle = style && style.subbHeader ? assign({}, this.defaultStyles.subbHeader, style.subbHeader) : this.defaultStyles.subHeader;
        listStyle = style && style.list ? assign({}, this.defaultStyles.list, style.list) : this.defaultStyles.list;

        return (
            <Paper style={baseStyle} shadow={shadow} {...otherProps}>
                <div ref={this.theRef()} style={listStyle} className={classes}>
                    {subHeader ? <div style={subHeaderStyle}>{subHeader}</div> : null}
                    {children}
                </div>
            </Paper>
        );
    }
});

module.exports = List;
