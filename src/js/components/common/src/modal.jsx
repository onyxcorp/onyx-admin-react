var React = require('react'),
    ReactModal = require('react-modal'),
    PureRenderMixin = require('react/addons').addons.PureRenderMixin,
    assign = require('object-assign'),
    Progress = require('./progress.jsx'),
    Modal;

/*
 *   CONTEXT WARNING PROBLEMS, WILL BE FIXED WITH REACT 0.14 AND MODAL UPDATE
 *  for now just ignore it
 *  https://github.com/rackt/react-modal/issues/37
 *
 */

ReactModal.setAppElement(document.getElementById('main'));
ReactModal.injectCSS();

Modal = React.createClass({

    displayName: 'Modal',

    propTypes: {
        className: React.PropTypes.string,
        style: React.PropTypes.shape({
            overlay: React.PropTypes.object,
            content: React.PropTypes.object
        }),
        isOpen: React.PropTypes.bool,
        pending: React.PropTypes.bool,
        onRequestClose: React.PropTypes.func
    },

    getDefaultProps: function () {
        return {
            isOpen: false,
            pending: false
        };
    },

    defaultStyles: {
        overlay: {
            cursor: 'pointer'     // trying to fix the ios click bug
        },
        content: {
            top                   : '50%',
            left                  : '50%',
            right                 : 'auto',
            bottom                : 'auto',
            marginRight           : '-50%',
            transform             : 'translate(-50%, -50%)'
            // maxWidth: null,
            // margin: '0 auto',
            // zIndex: 99,
            // display: 'table'
        }
    },

    _handleRequestClose: function () {
        if (this.props.onRequestClose) this.props.onRequestClose();
    },

    render: function () {
        var {
            className,
            style,
            isOpen,
            onRequestClose,
            children,
            ...otherProps
        } = this.props;

        var overlayStyle,
            contentStyle;

        overlayStyle = style && style.overlay ? assign({}, this.defaultStyles.overlay, style.overlay) : this.defaultStyles.overlay;
        contentStyle = style && style.content ? assign({}, this.defaultStyles.content, style.content) : this.defaultStyles.content;

        return (
            <ReactModal style={{overlay: overlayStyle, content: contentStyle}} isOpen={isOpen} onRequestClose={this._handleRequestClose} className={className} {...otherProps}>
                {children}
            </ReactModal>
        );
    }
});

module.exports = Modal;
