
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
    Post;

Post =
    React.createClass({

        contextTypes: {
            flux: React.PropTypes.object
        },

        propTypes: {
            post: React.PropTypes.instanceOf(Immutable.Record).isRequired,
            type: React.PropTypes.oneOf(['pages', 'blogs']).isRequired,
            pending: React.PropTypes.oneOfType([ React.PropTypes.string, React.PropTypes.bool ])
        },

        mixins: [PureRenderMixin, ImmutableFormMixin(['post']),titleSetMixin],

        _clearPostPropertyError: function (event) {
            if (event.target && event.target.name && event.target.name === 'title') {
                this.clearErrorState('post', 'slug');
            }
            this.clearErrorState('post', event);
        },

        _handleSubmit: function (event) {
            event.preventDefault();
            if (document.activeElement) document.activeElement.blur();

           var currentPost = this.getLinkedState('post');
           if (!currentPost.type) currentPost = currentPost.set('type', this.props.type);

            var invalidState = currentPost.invalidateSchema('register');
            if (invalidState.isInvalid()) {
                this.setErrorState('post', invalidState);
            } else {
                this.context.flux.getActions('post').updatePost(currentPost);
            }
        },

        render: function () {

            var isLoading = this.props.pending ? this.props.pending.containsOr('isLoading') : false;

            return (
                <Grid style={{margin: '0 auto', maxWidth: 1280}}>
                    <Progress loading={isLoading} size={2}>
                        <Paper shadow={2} style={{zIndex: 2}}>
                            <form id="productForm" onSubmit={this._handleSubmit}>
                                <TextField name="title"
                                    valueLink={this.linkState('post', 'title', 'setTitleWithSlug')}
                                    label='Titulo'
                                    onFocus={this._clearPostPropertyError}
                                    errorText={this.getErrorStateMessage('post', 'title')} />
                                <TextField name="slug"
                                    valueLink={this.linkState('post', 'slug')}
                                    label='slug'
                                    disabled={true}
                                    errorText={this.getErrorStateMessage('post', 'slug')} />
                                <TextField name="content"
                                    valueLink={this.linkState('post', 'content')}
                                    label='Conteúdo'
                                    multiLine={true}
                                    onFocus={this._clearPostPropertyError}
                                    errorText={this.getErrorStateMessage('post', 'content')} />
                                <br/>
                                <Button type="submit" colored={true}>Salvar</Button>
                            </form>
                        </Paper>
                    </Progress>
                </Grid>
            );
        }
    });

module.exports = Post;
