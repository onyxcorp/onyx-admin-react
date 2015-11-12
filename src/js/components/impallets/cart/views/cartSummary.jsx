var React = require('react'),
    Immutable = require('immutable'),
    PureRenderMixin = require('react/addons').addons.PureRenderMixin,
    ReactResponsiveMixin = require('react-responsive-mixin'),
    Link = require('react-router').Link,
    titleSetMixin = require('../../../mixin/titleMixin'),
    Texts = require('../../texts.js'),
    Img = require('../../../common').Img,
    BasketButton = require('../../../ecommerce').BasketButton,
    Grid = require('../../../mdl').Grid,
    Col = require('../../../mdl').Col,
    Paper = require('../../../mdl').Paper,
    Img = require('../../../common').Img,
    Card = require('../../../mdl').Card,
    CardMedia = require('../../../mdl').CardMedia,
    CardTitle = require('../../../mdl').CardTitle,
    CardActions =require('../../../mdl').CardActions,
    CardTable = require('../../../common').CardTable,
    CardTableHeader = require('../../../common').CardTableHeader,
    CardTableBody = require('../../../common').CardTableBody,
    CardTableRow = require('../../../common').CardTableRow,
    CardTableFoot = require('../../../common').CardTableFoot,
    CardTableActions = require('../../../common').CardTableActions,
    ProductGridBlock = require('../../../ecommerce').ProductGridBlock,
    UpdateQuantity = require('../../../ecommerce').UpdateQuantity,
    Button = require('../../../mdl').Button,
    CartSummary;

CartSummary = React.createClass({

    displayName: 'CartSummary',

    contextTypes: {
        flux: React.PropTypes.object,
        router: React.PropTypes.func
    },

    propTypes: {
        user: React.PropTypes.instanceOf(Immutable.Record).isRequired,
        cart: React.PropTypes.instanceOf(Immutable.Record).isRequired,
        selectedProducts: React.PropTypes.instanceOf(Immutable.Record).isRequired
    },

    mixins: [PureRenderMixin, titleSetMixin, ReactResponsiveMixin],

    getInitialState: function () {
        return {
            device: null
        };
    },

    componentWillMount: function () {
        // the cart will already be set because this component will get mounted
        // only after the isLoading is set to false (meaning the cart data already
        // arrived at the cartStore)
        this.context.flux.getActions('cart').checkout(this.props.cart, 1);
    },

    componentDidMount: function () {

       // this.media callback functions are automatically run on window resize
       // don't know if it is a browser feature or enquire.js feature
       // otherwise we should have done this
       // https://facebook.github.io/react/tips/dom-event-listeners.html

       var tabletBreakpoint = 480,
           desktopBreakpoint = 840;

       this.media({maxWidth: tabletBreakpoint -1}, function () {
           this.setState({
               device: 'phone'
           });
       }.bind(this));

       this.media({minWidth: tabletBreakpoint, maxWidth: desktopBreakpoint -1}, function () {
           this.setState({
               device: 'tablet'
           });
       }.bind(this));

       this.media({minWidth: desktopBreakpoint}, function () {
           this.setState({
               device: 'desktop'
           });
       }.bind(this));

   },

    _onConfirm: function () {
        var shouldProceed = false;

        if (this.props.user.get('uid') && this.props.user.get('provider') === 'anonymous') {
            this.context.flux.getActions('app').modal('login');
        } else {
            shouldProceed = true;
        }
        if (shouldProceed) this.context.router.transitionTo('checkout');
    },

    _onSelectProduct: function (product, checked) {
        this.context.flux.getActions('cart').selectProducts(this.props.selectedProducts, product, checked);
    },

    _onRemoveProducts: function () {
        if (this.props.selectedProducts.total()) {
            this.context.flux.getActions('cart').removeProduct(this.props.cart, this.props.selectedProducts);
        }
    },

    _handleAddQuantity: function (product) {
        this.context.flux.getActions('cart').updateProduct(this.props.cart, product.addQuantity(1));
    },

    _handleSubtractQuantity: function (product) {
        this.context.flux.getActions('cart').updateProduct(this.props.cart, product.addQuantity(-1));
    },

    _handleUpdateQuantity: function (product, quantity) {
        this.context.flux.getActions('cart').updateProduct(this.props.cart, product.set('quantity', quantity));
    },

    render: function () {

        var content;

        if (this.state.device === 'phone' || this.state.device === 'tablet') {

            content = (
                <div>
                    {this.props.cart.get('products').get('list').map( function(product, index) {
                        return (
                            <Col key={index + product.get('id')} cd={12} ct={8} cp={4}>
                                <Card shadow={4}>
                                    <CardMedia>
                                        <Img src={product.get('images').getByType('medium').get('src')} alt={product.get('title')} title={product.get('title')} />
                                    </CardMedia>
                                    <CardTitle>
                                        <Link to="product" params={{ slug : product.get('slug') }}>
                                            {product.get('title')}
                                        </Link>
                                    </CardTitle>
                                    <CardActions>
                                        <div style={{
                                            display: 'flex',
                                            boxSizing: 'border-box',
                                            WebkitAlignItems: 'center',
                                            alignItems: 'center',
                                            WebkitJustifyContent: 'space-between',
                                            JustifyContent: 'space-between',
                                            textAlign: 'center'
                                        }}>
                                            <span>Preço: R$ {product.getFormatted('price')}</span>
                                            <UpdateQuantity
                                                quantity={product.get('quantity')}
                                                onAdd={this._handleAddQuantity.bind(this, product)}
                                                onSubtract={this._handleSubtractQuantity.bind(this, product)}
                                                onChange={this._handleUpdateQuantity.bind(this, product)} />
                                        </div>
                                        <div style={{textAlign: 'center'}}>
                                            Total: R$ {product.getFormatted('total')}
                                        </div>
                                    </CardActions>
                                </Card>
                            </Col>
                        );
                    }.bind(this))}
                    <BasketButton onClick={this._onConfirm}>Confirmar Orçamento</BasketButton>
                </div>
            );

        } else {

            var cartGridProductList = (
                <CardTableBody>
                    {this.props.cart.get('products').get('list').map(function (product, index) {
                        return (
                            <CardTableRow
                                key={index + product.get('id')}
                                onSelect={this._onSelectProduct.bind(this, product)}>

                                <td className='mdl-data-table__cell--non-numeric'>
                                    <Img style={{base:{width: '50px', margin: 0}}} alt={product.get('title')} src={product.getFirstImage().get('src')} />
                                </td>
                                <td className='mdl-data-table__cell--non-numeric'>
                                    <Link className='cartName cartProductColItem' to="product" params={{ slug : product.get('slug') }}>
                                        {product.get('title')}
                                    </Link>
                                </td>
                                <td className='mdl-data-table__cell--non-numeric'>
                                   <span className='cartUnitario cartProductColItem'>R$ {product.getFormatted('price')}</span>
                                </td>
                                <td className='mdl-data-table__cell--non-numeric' style={{paddingTop: 0}}>
                                    <UpdateQuantity
                                        quantity={product.get('quantity')}
                                        onAdd={this._handleAddQuantity.bind(this, product)}
                                        onSubtract={this._handleSubtractQuantity.bind(this, product)}
                                        onChange={this._handleUpdateQuantity.bind(this, product)} />
                                </td>
                                <td className='mdl-data-table__cell--non-numeric'>
                                    <p className='cartPrice cartProductColItem'>
                                        R$ {product.getFormatted('total')}
                                    </p>
                                </td>
                            </CardTableRow>
                        );

                    }.bind(this)).toJS()}
                </CardTableBody>
            );

            var fields = ['', 'Imagem', 'Titulo', 'Preço', 'Quantidade', 'Total'];
            var newColumns = [];
            fields.forEach(function (field, index) {
                newColumns.push({
                    label: field.capitalize(),
                    name: field,
                    numeric: false
                });
            });

            var primaryHeader = (
                <CardTableHeader
                    title='Lista de Produtos'
                    subtitle='Selecione um ou mais produtos para removê-los da lista'>
                </CardTableHeader>
            );

            var secondaryHeader = (
                <CardTableHeader
                    title='Lista de Produtos'>
                    <Button iconButton icon='cancel' onClick={this._onRemoveProducts} />
                </CardTableHeader>
            );

            var foot = (
                <CardTableFoot>
                    <tr>
                        <td colSpan={4}></td>
                        <td className='mdl-data-table__cell'>
                            <strong>Subtotal</strong>
                        </td>
                        <td className='mdl-data-table__cell--non-numeric'>
                            R$ {this.props.cart.getFormatted('total')}
                        </td>
                    </tr>
                    <tr>
                        <td colSpan={4}></td>
                        <td className='mdl-data-table__cell'>
                            <strong>Total</strong>
                        </td>
                        <td className='mdl-data-table__cell--non-numeric'>
                            R$ {this.props.cart.getFormatted('total')}
                        </td>
                    </tr>
                </CardTableFoot>
            );

            var actions = (
                <CardTableActions>
                    <BasketButton onClick={this._onConfirm}>Confirmar Orçamento</BasketButton>
                </CardTableActions>
            );

            content = (
                <CardTable
                    primaryHeader={primaryHeader}
                    secondaryHeader={secondaryHeader}
                    body={cartGridProductList}
                    foot={foot}
                    actions={actions}
                    selectable={true}
                    columns={newColumns}
                    style={{textAlign: 'center'}} >
                </CardTable>
            );
        }

        return (
            <div>
                <div className="page-title-wrapper">
                    <Grid>
                        <div className="page-title">
                            <h2>Carrinho</h2>
                        </div>
                    </Grid>
                </div>
                <Grid>
                    <div className='paperContent'>
                        {content}
                    </div>
                </Grid>
            </div>
        );
    }
});

module.exports = CartSummary;
