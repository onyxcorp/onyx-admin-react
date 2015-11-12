
// TODO must estudar nodejs para entender.. enfim

require('node-jsx').install({extension: '.jsx'});
var React = require('react'),
    App = React.createFactory(require('./src/js/app.jsx')),
    ApiHandler = require('./src/js/utils/ApiHandler'),
    Router = require('./src/js/utils/Router'),
    express = require('express');

var server = express();
server.use(require('connect-livereload')());
server.set('state namespace', 'App');

var totalHi = 0;

server.use(function (req, res) {

    totalHi++;
    var route = Router.getRoute(req.path);

    console.log(route);
    //head = React.renderToStaticMarkup(HeadComponent());

    // var html = React.renderToString(App({
    //     route: route
    // }));

    // ApiHandler.getAllProducts();

    // ApiHandler.allSet().then(function (data) {
        console.log('allSet retornou');
        res.write('<html>');
        res.write('<meta charset="UTF-8" />');
        res.write('<title>Document</title>');
        res.write('<body>');
        res.write('hi ' + totalHi);
        res.write('</body>');
        res.write('</html>');
    //     res.write('<html>');
    //     res.write('<link rel="stylesheet" media="scren" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.1/css/bootstrap.min.css" />');
    //     res.write('<link rel="stylesheet" media="screen" href="styles/app.css" />');

    //     res.write('<div id="app">' + html + '</div>');

    //     res.write('<script src="/public/js/client.js" defer></script>');
    //     res.write('</html>');
        res.end();
    // });

});

var port = process.env.PORT || 8080;
server.listen(port);
console.log('Listening on port ' + port);

// @todo realmente preciso fazer uma função estática dentro de Application?

//Application.loadRoute(req, function () {

    // @todo callback do loadRoute

    // @todo todas informações específicas da rota solicitada devem ter sido previamente carregadados dentro do loadRoute

    // @todo preparar as informações que serão inputadas no HTML que servirão de base para a inicialização do react

    // @todo informações estáticas podem ser as da página atual, dados de usuário, etc

//});
// TODO este arquivo pode ser substituido e ir parar inteiro no server side acredito..

require('es5-shim');

var React = require('react'),
    Router = require('react-router'),
    Routes = require('./src/js/Routes'),
    Flux = require('./src/js/Flux');

window.React = React; // For chrome dev tool support

Router.run(Routes, Router.HistoryLocation, function (Root, state) {

    // ASYNC COULD GO HERE
    // Call bellow only when data is ready
    // http://rackt.github.io/react-router/#Router.run
    // var promises = state.routes.filter(function (route) {
    //     return route.handler.fetchData;
    // }).reduce(function (promises, route) {
    //     promises[route.name] = route.handler.fetchData(state.params);
    //     return promises;
    // }, {});
    // console.log(promises);
    state.routes.forEach(function (route) {
        if (route.handler.fetchData) {
            route.handler.fetchData(Flux, state);
        }
    });
    React.render(<Root flux={Flux} />, document.getElementById('main'));
});


module.exports = server;
