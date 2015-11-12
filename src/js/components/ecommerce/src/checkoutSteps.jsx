var React = require('react'),
    PureRenderMixin = require('react/addons').addons.PureRenderMixin,
    assign = require('object-assign'),
    classNames = require('classnames'),
    Grid = require('../../mdl').Grid,
    Col = require('../../mdl').Col,
    CheckoutSteps;

CheckoutSteps =  React.createClass({

    displayName: 'CheckoutSteps',

    propTypes: {
        className: React.PropTypes.string,
        style: React.PropTypes.object,
        onChangeStep: React.PropTypes.func,
        step: React.PropTypes.number
    },

    getDefaultProps: function () {
        return {
            step: 1
        };
    },

    mixins: [PureRenderMixin],

    defaultStyles: {
        // main: {
        //     width: '100%',
        //     maxWidth: '768px',
        //     padding: '0.5em 1em',
        //     margin: '1em auto',
        //     backgroundColor: '#689f38',
        //     content: '',
        //     display: 'table',
        //     clear: 'both'
        // },
        item: {
            textAlign: 'center'
        }
    },

    _handleChangeStep: function (step) {
        if (this.props.onChangeStep) this.props.onChangeStep(step);
    },

    render: function () {

        var {
            className,
            style,
            onChangestep,
            step,
            ...otherProps
        } = this.props;

        var currentClass = {};

        if (step === 1) {
            currentClass.first = 'stepCol current animated rubberBand clickable';
        } else if (step === 2) {
            currentClass.first = 'visited clickable';
            currentClass.second = 'stepCol current animated rubberBand clickable';
        } else {
            currentClass.first = 'visited clickable';
            currentClass.second = 'visited clickable';
            currentClass.third = 'stepCol current animated rubberBand clickable';
        }

        var classes = classNames(['cd-multi-steps', 'text-center', 'checkoutSteps'], className);

        return (
            <Grid style={assign({}, this.defaultStyles.main, style)} className={classes} {...otherProps}>
                <Col cd={4} ct={2} cp={1} ref="1-step" style={this.defaultStyles.item} className={currentClass.first}>
                    <em onClick={this._handleChangeStep.bind(this, 1)}>Carrinho</em>
                </Col>
                <Col cd={4} ct={4} cp={2} ref="2-step" style={this.defaultStyles.item} className={currentClass.second}>
                    <em onClick={this._handleChangeStep.bind(this, 2)}>Entrega</em>
                </Col>
                <Col cd={4} ct={2} cp={1} ref="3-step" style={this.defaultStyles.item} className={currentClass.third}>
                    <em onClick={this._handleChangeStep.bind(this, 3)}>Confirmar</em>
                </Col>
            </Grid>
        );
    }

});

module.exports = CheckoutSteps;
