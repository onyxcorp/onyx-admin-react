
var React = require('react'),
    Immutable = require('immutable'),
    PureRenderMixin = require('react/addons').addons.PureRenderMixin,
    ImmutableFormMixin = require('../../../mixin/ImmutableForm'),
    Form = require('../../../common').Form,
    FormActions = require('../../../common').FormActions,
    Avatar = require('../../../common').UserAvatar,
    Col = require('../../../mdl').Col,
    Grid = require('../../../mdl').Grid,
    Slider = require('../../../mdl').Slider,
    Button = require('../../../mdl').Button,
    TextField = require('../../../mdl').TextField,
    Paper = require('../../../mdl').Paper,
    Card = require('../../../mdl').Card,
    CardTitle = require('../../../mdl').CardTitle,
    CardActions = require('../../../mdl').CardActions,
    CardSupportingText = require('../../../mdl').CardSupportingText,
    CardHeader = require('../../../mdl').CardHeader,
    ReviewForm;

ReviewForm = React.createClass({

    contextTypes: {
        flux: React.PropTypes.object
    },

    propTypes: {
        user: React.PropTypes.instanceOf(Immutable.Record).isRequired,
        review: React.PropTypes.instanceOf(Immutable.Record).isRequired,
        productReviewed: React.PropTypes.instanceOf(Immutable.Record).isRequired,
        userReviewer: React.PropTypes.instanceOf(Immutable.Record),
        editMode: React.PropTypes.oneOfType([ React.PropTypes.bool ])
    },

    mixins: [PureRenderMixin, ImmutableFormMixin(['review'])],

    getInitialState: function() {
        return {
            editMode: this.props.editMode || false
        };
    },

    _changeScore: function (value) {
       this.setLinkedState('review', this.getLinkedState('review').set('score', value));
    },

    _setEdit: function () {
       if (this.props.user.get('uid') && this.props.user.get('provider') === 'anonymous') {
           this.context.flux.getActions('app').modal('login');
           this.setState({
               editMode: false
           });
       } else {
           this.setState({
               editMode: true
           });
       }
    },

    _unsetEdit: function () {
       this.context.flux.getActions('review').createReview();
       this.setState({
           editMode: false
       });
    },

    _handleSubmit: function () {
       // we do it here because this data is part of the current review being written.
       // If the user id and product id were fields of the form they would be set here
       // so by doing this here we are keeping things in a transient component
       // state before being submitted to the action, the difference is that it is
       // being automatically set on submit
       var currentReview = this.getLinkedState('review');
       if (!currentReview.product_id) currentReview = currentReview.set('product_id', this.props.productReviewed.get('id'));
       if (!currentReview.uid) currentReview = currentReview.set('uid', this.props.user.get('uid'));

       var invalidState = currentReview.invalidateSchema('productReview');
       if (invalidState.isInvalid()) {
           this.setErrorState('review', invalidState);
       } else {
           // since this form can add/update the review we call for updateReview action
           this.context.flux.getActions('review').updateReview(currentReview);
           this._unsetEdit();
       }
    },

    render: function () {
       var output,
            content,
            reviewScore;

        var style= {
            width: '100%'
        };

        var scoreStyles = {
            everyone: {
                fontSize: 24,
                fontWeight: 'bold'
            },

            awful:{
                color: '#b71c1c'
            },

            bad:{
                color: '#ff9800'
            },

            medium:{
                color: '#cddc39'
            },

            good:{
                color: '#8bc34a'
            },

            topkek:{
                color: '#4caf50'
            }
        };

        function getReviewScore(currentReview) {
            var output = {};
            switch(currentReview.get('score')){
                case 1:
                    output.review = 'Pessimo';
                    output.color = scoreStyles.awful.color;
                    break;

                case 2:
                    output.review = 'Ruim';
                    output.color = scoreStyles.bad.color;
                    break;

                default:
                case 3:
                    output.review = 'Regular';
                    output.color = scoreStyles.medium.color;
                    break;

                case 4:
                    output.review = 'Bom';
                    output.color = scoreStyles.good.color;

                    break;
                case 5:
                    output.review = 'Excelente';
                    output.color = scoreStyles.topkek.color;

                    break;
            }
            return output;
        }

        if (this.state.editMode) {

            reviewScore = getReviewScore(this.getLinkedState('review'));

            content = (
                <Form onSubmit={this._handleSubmit}>
                    <Grid noSpacing>
                        <Col style={{textAlign: 'center'}} cd={6} ct={6} cp={4}>
                            <h3>Arraste para dar uma Nota</h3>
                            <Slider defaultValue={3} max={5} min={1} onChange={this._changeScore} />
                        </Col>
                        <Col style={{textAlign: 'center'}} cd={6} ct={6} cp={4}>
                            <h3>Acho este produto...</h3>
                            <span style={scoreStyles.everyone}>
                                <span style={{color:reviewScore.color}}>{reviewScore.review}</span>
                            </span>
                        </Col>
                    </Grid>
                    <TextField
                        name={this.setFieldName('review', 'title')}
                        valueLink={this.linkState('review', 'title')}
                        label="Titulo"
                        onFocus={this.clearErrorState}
                        errorText={this.getErrorStateMessage('review', 'title')} />
                    <TextField
                        name={this.setFieldName('review', 'description')}
                        valueLink={this.linkState('review', 'description')}
                        label="Que achou deste produto?"
                        multiLine={true}
                        onFocus={this.clearErrorState}
                        errorText={this.getErrorStateMessage('review', 'description')} />
                    <FormActions>
                        <Button onClick={this._unsetEdit}>Cancelar</Button>
                        <Button type="submit" colored={true}>Salvar</Button>
                    </FormActions>
                </Form>
            );
        } else if (this.props.review.get('uid')) {

            reviewScore = getReviewScore(this.props.review);

            var fullName,
                subtitle;

            fullName = this.props.userReviewer.get('name') + ' ' + this.props.userReviewer.get('lastName');
            subtitle = reviewScore.review + ' ' + this.props.review.getReviewDateFromNow();

            content = (
                <Card style={{marginBottom: '10px'}}>
                    <CardHeader
                        title={fullName}
                        subtitle={subtitle}
                        subtitleColor={reviewScore.color}
                        avatar={<Avatar style={{marginRight: 20}} size={40} user={this.props.userReviewer} />} />
                    <CardTitle>{this.props.review.get('title')}</CardTitle>
                    <CardSupportingText>{this.props.review.get('description')}</CardSupportingText>
                    <CardActions>
                        <Button iconButton={true} icon="create" onClick={this._setEdit}/>
                    </CardActions>
                </Card>
            );
        } else {
            content = (
                <Button raised={true} colored={true} icon="comment" onClick={this._setEdit}>
                    Enviar um Review
                </Button>
            );
        }

        return (
            <div>
                {content}
            </div>
        );
    }
});

module.exports = ReviewForm;
