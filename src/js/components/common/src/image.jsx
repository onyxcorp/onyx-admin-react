var React = require('react'),
    ReactModal = require('react-modal'),
    PureRenderMixin = require('react/addons').addons.PureRenderMixin,
    assign = require('object-assign'),
    Img;

Img = React.createClass({

    displayName: 'Img',

    propTypes: {
        className: React.PropTypes.string,
        style: React.PropTypes.object,
        src: React.PropTypes.string.isRequired,
        title: React.PropTypes.string,
        alt: React.PropTypes.string,
        type: React.PropTypes.oneOf(['rounded', 'circle', 'thumbnail'])
    },

    mixins: [PureRenderMixin],

    defaultStyles: {
        base :{
            maxWidth: '100%',
            margin: '0 auto',
            height: 'auto',
            display: 'block',
            verticalAlign: 'middle'
        },
        rounded: {          // baed on http://getbootstrap.com/css/#images-responsive
            borderRadius: '6px'
        },
        circle: {
            borderRadius: '50%'
        },
        thumbnail: {
            display: 'inline-block',
            maxWidth: '100%',
            height: 'auto',
            padding: '4px',
            lineHeight: '1.42857143',
            backgroundColor: '#fff',
            border: '1px solid #ddd',
            borderRadius: '4px',
            WebkitTransition: 'all .2s ease-in-out',
            OTransition: 'all .2s ease-in-out',
            transition: 'all .2s ease-in-out'
        }
    },

    render: function () {

        var {
            className,
            style,
            src,
            title,
            alt,
            type,
            ...otherProps
        } = this.props;

        var baseStyle;

        baseStyle = style && style.base ? assign({}, this.defaultStyles.base, style.base) : this.defaultStyles.base;

        if (type) {
            baseStyle = assign({}, baseStyle, this.defaultStyles[type], style && style[type] ? style[type] : {});
        }

        return (
            <img style={baseStyle} src={src} alt={alt} title={title} className={className} {...otherProps} />
        );
    }

});

module.exports = Img;
