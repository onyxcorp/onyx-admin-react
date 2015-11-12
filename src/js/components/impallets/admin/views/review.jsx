
var React = require('react'),
    Immutable = require('immutable'),
    PureRenderMixin = require('react/addons').addons.PureRenderMixin,
    ImmutableFormMixin = require('../../../mixin/ImmutableForm'),
    titleSetMixin = require('../../../mixin/titleMixin'),
    Progress = require('../../../common').Progress,
    Grid = require('../../../mdl').Grid,
    Paper = require('../../../mdl').Paper,
    TextField = require('../../../mdl').TextField,
    Button = require('../../../mdl').Button,
    Products;

Products =
    React.createClass({

        displayName: 'Adicionar Produto',

        contextTypes: {
            flux: React.PropTypes.object,
            router: React.PropTypes.func
        },

        propTypes: {
            review: React.PropTypes.instanceOf(Immutable.Record).isRequired,
            pending: React.PropTypes.oneOfType([ React.PropTypes.string, React.PropTypes.bool ])
        },

        mixins: [PureRenderMixin, ImmutableFormMixin(['review']),titleSetMixin],

        _clearProductPropertyError: function (event) {
            this.clearErrorState('review', event);
        },

        _handleSubmit: function (event) {
            event.preventDefault();
            if (document.activeElement) document.activeElement.blur();
            var invalidState = this.getLinkedState('review').invalidateSchema();
            if (invalidState.isInvalid()) {
                this.setErrorState('review', invalidState);
            } else {
                this.context.flux.getActions('review').updateReview(this.getLinkedState('review'));
            }
        },

        render: function () {

            var isLoading = this.props.pending ? this.props.pending.containsOr('isLoading', 'isLoadingReview') : false;

            return (
                <Grid style={{margin: '0 auto', maxWidth: 1280}}>
                    <Progress loading={isLoading} size={2}>
                        <Paper shadow={2} style={{zIndex: 2}}>
                            <form id="reviewForm" onSubmit={this._handleSubmit}>
                                <TextField name="title"
                                    valueLink={this.linkState('review', 'title')}
                                    label='Titulo'
                                    onFocus={this._clearProductPropertyError}
                                    errorText={this.getErrorStateMessage('review', 'title')} />
                                <TextField name="description"
                                    valueLink={this.linkState('review', 'description')}
                                    label='Descrição'
                                    multiLine={true}
                                    onFocus={this._clearProductPropertyError}
                                    errorText={this.getErrorStateMessage('review', 'description')} />
                                <br/>
                                <Button type="submit" colored={true}>Salvar</Button>
                            </form>
                        </Paper>
                    </Progress>
                </Grid>
            );
        }
    });

module.exports = Products;
