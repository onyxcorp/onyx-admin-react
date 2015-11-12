const React = require('react');
const CssEvent = require('./utils/css-event');
const Events = require('./utils/events');
const Transitions = require('./utils/transitions');
const Button = require('./button.jsx');
const Dom = require('./utils/dom');
const ImmutabilityHelper = require('./utils/immutability-helper');

const Snackbar = React.createClass({

    manuallyBindClickAway: true,

    // ID of the active timer.
    _autoHideTimerId: undefined,

    propTypes: {
        message: React.PropTypes.string.isRequired,
        action: React.PropTypes.string,
        autoHideDuration: React.PropTypes.number,
        onActionTouchTap: React.PropTypes.func,
        onShow: React.PropTypes.func,
        onDismiss: React.PropTypes.func,
        openOnMount: React.PropTypes.bool
    },


    getInitialState() {
        return {
            open: this.props.openOnMount || false
        };
    },

    componentDidMount() {
        if (this.props.openOnMount) {
            this._setAutoHideTimer();
            this._bindClickAway();
        }
    },

    componentClickAway() {
        this.dismiss();
    },

    componentDidUpdate(prevProps, prevState) {
        if (prevState.open !== this.state.open) {
            if (this.state.open) {
                this._setAutoHideTimer();

                //Only Bind clickaway after transition finishes
                CssEvent.onTransitionEnd(React.findDOMNode(this), () => {
                    this._bindClickAway();
                });
            }
            else {
                this._unbindClickAway();
            }
        }
    },

    componentWillUnmount() {
        this._clearAutoHideTimer();
        this._unbindClickAway();
    },


    _checkClickAway(event) {
        let el = React.findDOMNode(this);

        // Check if the target is inside the current component
        if (event.target !== el &&
            !Dom.isDescendant(el, event.target) &&
            document.documentElement.contains(event.target)) {
            if (this.componentClickAway) this.componentClickAway();
        }
    },


    _bindClickAway() {
        // On touch-enabled devices, both events fire, and the handler is called twice,
        // but it's fine since all operations for which the mixin is used
        // are idempotent.
        Events.on(document, 'mouseup', this._checkClickAway);
        Events.on(document, 'touchend', this._checkClickAway);
    },

    _unbindClickAway() {
        Events.off(document, 'mouseup', this._checkClickAway);
        Events.off(document, 'touchend', this._checkClickAway);
    },

    getStyles() {
        const styles = {
            root: {
                color: '#ffffff',
                backgroundColor: '#323232',
                borderRadius: 2,
                padding: 24,
                height: 'auto',
                lineHeight:14+'px',
                minWidth: 288,
                maxWidth: 800,
                position: 'fixed',
                zIndex: 12,
                bottom: 24,
                marginLeft: 24,

                left: 0,
                opacity: 0,
                visibility: 'hidden',
                transform: 'translate3d(0, 20px, 0)',
                transition:
                Transitions.easeOut('0ms', 'left', '400ms') + ',' +
                Transitions.easeOut('400ms', 'opacity') + ',' +
                Transitions.easeOut('400ms', 'transform') + ',' +
                Transitions.easeOut('400ms', 'visibility')
            },
            rootWhenOpen: {
                color: '#ffffff',
                opacity: 1,
                visibility: 'visible',
                transform: 'translate3d(0, 0, 0)',
                transition:
                Transitions.easeOut('0ms', 'left', '0ms') + ',' +
                Transitions.easeOut('400ms', 'opacity', '0ms') + ',' +
                Transitions.easeOut('400ms', 'transform', '0ms') + ',' +
                Transitions.easeOut('400ms', 'visibility', '0ms')
            }
        };

        return styles;
    },

        mergeStyles() {
        return ImmutabilityHelper.merge.apply(this, arguments);
    },

    render() {
        const { message, style, ...otherProps } = this.props;
        const styles = this.getStyles();

        const rootStyles = this.state.open ?
            this.mergeStyles(styles.root, styles.rootWhenOpen, style) :
            this.mergeStyles(styles.root, style);

        return (
            <span {...otherProps} style={rootStyles}>
        <span style={{color: 'white!important'}}>{message}</span></span>
        );
    },

    show() {
        this.setState({ open: true });
        if (this.props.onShow) this.props.onShow();
    },

    dismiss() {
        this._clearAutoHideTimer();
        this.setState({ open: false });
        if (this.props.onDismiss) this.props.onDismiss();
    },

    _clearAutoHideTimer() {
        if (this._autoHideTimerId !== undefined) {
            this._autoHideTimerId = clearTimeout(this._autoHideTimerId);
        }
    },

    _setAutoHideTimer() {
        if (this.props.autoHideDuration > 0) {
            this._clearAutoHideTimer();
            this._autoHideTimerId = setTimeout(() => { this.dismiss(); }, this.props.autoHideDuration);
        }
    }

});

module.exports = Snackbar;
