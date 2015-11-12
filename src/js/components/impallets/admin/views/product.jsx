
var React = require('react'),
    Immutable = require('immutable'),
    PureRenderMixin = require('react/addons').addons.PureRenderMixin,
    ImmutableFormMixin = require('../../../mixin/ImmutableForm'),
    titleSetMixin = require('../../../mixin/titleMixin'),
    UploadButton = require('../../../common').UploadButton,
    Progress = require('../../../common').Progress,
    Img = require('../../../common').Img,
    Grid = require('../../../mdl').Grid,
    Paper = require('../../../mdl').Paper,
    TextField = require('../../../mdl').TextField,
    Button = require('../../../mdl').Button,
    Product;

Product =
    React.createClass({

        displayName: 'Adicionar Produto',

        contextTypes: {
            flux: React.PropTypes.object,
            router: React.PropTypes.func
        },

        propTypes: {
            product: React.PropTypes.instanceOf(Immutable.Record).isRequired,
            pending: React.PropTypes.oneOfType([ React.PropTypes.string, React.PropTypes.bool ])
        },

        mixins: [PureRenderMixin, ImmutableFormMixin(['product']),titleSetMixin],

        _removeImage: function (image, event) {
            event.preventDefault();
            this.setLinkedState('product', this.getLinkedState('product').removeImage(image));
        },

        _handleChangeImage: function (event) {
            event.preventDefault();
            this.getLinkedState('product').addImageAsync(event.target.files, function (response) {
                this.setLinkedState('product', response);
            }.bind(this));
        },

        _clearProductPropertyError: function (event) {
            this.clearErrorState('product', event);
        },

        _handleSubmit: function (event) {
            event.preventDefault();
            if (document.activeElement) document.activeElement.blur();
            var invalidState = this.getLinkedState('product').invalidateSchema('register');
            if (invalidState.isInvalid()) {
                this.setErrorState('product', invalidState);
            } else {
                this.context.flux.getActions('product').updateProduct(this.getLinkedState('product'));
            }
        },

        render: function () {

            var isLoading = this.props.pending ? this.props.pending.containsOr('isLoading') : false;

            return (
                <Grid style={{margin: '0 auto', maxWidth: 1280}}>
                    <Progress loading={isLoading} size={2}>
                        <Paper shadow={2} style={{zIndex: 2}}>
                            <form id="productForm" onSubmit={this._handleSubmit}>
                                <TextField
                                    name="title"
                                    valueLink={this.linkState('product', 'title', 'setTitleWithSlug')}
                                    label='Titulo'
                                    onFocus={this._clearProductPropertyError}
                                    errorText={this.getErrorStateMessage('product', 'title')} />
                                <TextField
                                    name="slug"
                                    valueLink={this.linkState('product', 'slug')}
                                    label='Link'
                                    disabled={true}
                                    error={this.getErrorStateMessage('product', 'slug')} />
                                <TextField
                                    name="description"
                                    valueLink={this.linkState('product', 'description')}
                                    label='Descrição'
                                    multipleLines={true}
                                    onFocus={this._clearProductPropertyError}
                                    errorText={this.getErrorStateMessage('product', 'description')} />
                                <TextField
                                    name="price"
                                    valueLink={this.linkState('product', 'price')}
                                    label='Preço'
                                    onFocus={this._clearProductPropertyError}
                                    errorText={this.getErrorStateMessage('product', 'price')} />
                                <TextField
                                    name="weight"
                                    valueLink={this.linkState('product', 'weight')}
                                    label='Peso'
                                    onFocus={this._clearProductPropertyError}
                                    errorText={this.getErrorStateMessage('product', 'weight')} />
                                <TextField
                                    name="width"
                                    valueLink={this.linkState('product', 'width')}
                                    label='Comprimento'
                                    onFocus={this._clearProductPropertyError}
                                    errorText={this.getErrorStateMessage('product', 'width')} />
                                <TextField
                                    name="height"
                                    valueLink={this.linkState('product', 'height')}
                                    label='Altura'
                                    onFocus={this._clearProductPropertyError}
                                    errorText={this.getErrorStateMessage('product', 'height')} />
                                <TextField
                                    name="depth"
                                    valueLink={this.linkState('product', 'depth')}
                                    label='Profundidade'
                                    onFocus={this._clearProductPropertyError}
                                    errorText={this.getErrorStateMessage('product', 'depth')} />
                                <Grid>
                                    {this.getLinkedState('product').get('images').get('list').map( function (image, index) {
                                        return (
                                            <Col cd={4} ct={8} cp={4} key={index}>
                                                <Button fab={true} icon="delete"
                                                    onClick={this._removeImage.bind(this, image)} />
                                                <Img src={image.get('src')} />
                                            </Col>
                                        );
                                    }.bind(this)).toJS()}
                                </Grid>
                                <UploadButton label="upload" inputName="images" button="raised" primary={true} onChange={this._handleChangeImage} />
                                <br/><br/>
                                <Button type="submit" colored={true}>Salvar</Button>
                            </form>
                        </Paper>
                    </Progress>
                </Grid>
            );
        }
    });

module.exports = Product;
