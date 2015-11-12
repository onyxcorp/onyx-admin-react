var MiniFlux = require('../utils/MiniFlux'),
    MessageStore;

MessageStore = MiniFlux.createStore({

    _init: function (flux) {

        // cart messages
        this.register(flux.getActions('cart').addProduct, this._handleAddProduct);

        // product messages
        this.registerAsync(flux.getActions('product').updateProduct, this._handleUpdateProduct, this._handleUpdateProductCompleted);

        // order messages
        this.registerAsync(flux.getActions('order').createOrderFromCart, this._handleCreateOrderFromCart, this._handleCreateOrderFromCartCompleted);

        // review messages
        this.registerAsync(flux.getActions('review').updateReview, this._handleUpdateReview, this._handleUpdateReviewCompleted);

        // post messages
        this.registerAsync(flux.getActions('post').updatePost, this._handleUpdatePost, this._handleUpdatePostCompleted);

        // contact messages
        this.registerAsync(flux.getActions('contact').updateContact, this._handleUpdateContact, this._handleUpdateContactCompleted);

        // user message
        this.registerAsync(flux.getActions('app').register, this._handleRegister, this._handleRegisterCompleted);
        this.registerAsync(flux.getActions('app').login, this._handleLogin, this._handleLoginCompleted);
        this.registerAsync(flux.getActions('app').updateUserData, this._handleUserUpdateData, this._handleUserUpdateDataCompleted);
        this.registerAsync(flux.getActions('app').updateUserProductListData, this._handleUserUpdateProductListData, this._handleUserUpdateProductListDataCompleted);
    },

    initialState: {
        message: null,
        lastMessage: null
    },

    // internal method, wrapper that dont respond to any outside actions
    _handleSetMessage: function () {
        var newState = {};
        newState.lastMessage = this.getState('message');
        newState.message = [].splice.call(arguments,0).join(' ');
        if (newState.lastMessage !== newState.message) {
            this.setState(newState);
        }
    },

    _handleAddProduct: function (Cart) {
        this._handleSetMessage('Produto ' + Cart.get('products').get('lastUpdated').get('title') + ' adicionado ao carrinho');
    },

    _handleUpdatedUser: function () { this._handleSetMessage('Atualizando User...');},
    _handleUpdatedUserCompleted: function (dataSnapshot) {
        if (this.types.isError(dataSnapshot)) {
            this._handleSetMessage('Ocorreu um erro ao tentar atualizar o user:', dataSnapshot.message);
        } else {
            this._handleSetMessage('User atualizado com sucesso!');
        }
    },

    _handleUpdateProduct: function (Product) { this._handleSetMessage('Salvando produto...');},
    _handleUpdateProductCompleted: function (error) {
        if (this.types.isError(error)) {
            this._handleSetMessage('Ocorreu um erro ao tentar atualizar o produto:', error.message);
        } else {
            this._handleSetMessage('Produto atualizado com sucesso!');
        }
    },

    _handleUpdateReview: function () { this._handleSetMessage('Salvando Review...');},
    _handleUpdateReviewCompleted: function (dataSnapshot) {
        if (this.types.isError(dataSnapshot)) {
            this._handleSetMessage('Ocorreu um erro ao tentar enviar o Review:', dataSnapshot.message);
        } else {
            this._handleSetMessage('Review Enviado com sucesso!');
        }
    },

    _handleUpdatePost: function () { this._handleSetMessage('Salvando post...');},
    _handleUpdatePostCompleted: function (dataSnapshot) {
        if (this.types.isError(dataSnapshot)) {
            this._handleSetMessage('Ocorreu um erro ao tentar salvar o post:', dataSnapshot.message);
        } else {
            this._handleSetMessage('Post salvo com sucesso!');
        }
    },

    _handleUpdateContact: function (Contact) { this._handleSetMessage('Enviando contato...'); },
    _handleUpdateContactCompleted: function (dataSnapshot) {
        if (this.types.isError(dataSnapshot)) {
            this._handleSetMessage('Ocorreu um erro ao tentar enviar o contato:', dataSnapshot.message);
        } else {
            this._handleSetMessage('Contato enviado com sucesso =)');
        }
    },

    _handleCreateOrderFromCart: function (Order) { this._handleSetMessage('Finalizando pedido...'); },
    _handleCreateOrderFromCartCompleted: function (error) {
        if (this.types.isError(error)) {
            this._handleSetMessage('Ocorreu um erro durante o fechamento do pedido:', error.message);
        } else {
            this._handleSetMessage('Pedido finalizado com sucesso!');
        }
    },

    _handleRegister: function (User) { this._handleSetMessage('Registrando...'); },
    _handleRegisterCompleted: function (authData) {
        if (this.types.isError(authData)) {
            this._handleSetMessage('Ocorreu um erro durante o registro:', authData.message);
        } else {
            this._handleSetMessage('Usuário registrado com sucesso!');
        }
    },

    _handleLogin: function (User) { this._handleSetMessage('Acessando, por favor aguarde...');},
    _handleLoginCompleted: function (authData) {
        if (this.types.isError(authData)) {
            this._handleSetMessage('Ocorreu um erro durante o login:', authData.message);
        } else if (authData && authData.provider) {
            if (authData.provider !== 'anonymous') {
                this._handleSetMessage('Usuário logado com sucesso!');
            }
        }
    },

    _handleUserUpdateData: function (User) { this._handleSetMessage('Atualizando informações...');},
    _handleUserUpdateDataCompleted: function (error) {
        if (this.types.isError(error)) {
            this._handleSetMessage('Ocorreu um erro durante a atualização:', error.message);
        } else {
            this._handleSetMessage('Informações atualizadas com sucesso!');
        }
    },

    _handleUserUpdateProductListData: function (User) { this._handleSetMessage('Atualizando lista...');},
    _handleUserUpdateProductListDataCompleted: function (error) {
        if (this.types.isError(error)) {
            this._handleSetMessage('Ocorreu um erro atualizando a lista de produtos:', error.message);
        } else {
            this._handleSetMessage('Lista de produtos atualizada com sucesso!');
        }
    }
});

module.exports = MessageStore;
