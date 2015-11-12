
// TODO este arquivo pode ser substituido e ir parar inteiro no server side acredito..
// ALL THIS LOGIC BELLOW WAS REPLACED BECAUSE TRACKER.JS OVERRIDES THE DEFAULT CONSOLE.LOG
// FROM THE DOM
// window.development = true; // for console logs output/input
// if we are not in development mode just kill all the console logs and let the polyfill
// bellow do its job
// if (!window.development) {
//     window.console = undefined;
// }
// for older browsers or the ones that do not support console.log
// require('console-polyfill');

require('es5-shim');

var React = require('react'),
    Router = require('react-router'),
    Routes = require('./js/components/impallets/routes'),
    Flux = require('./js/OnyxFlux');

if (typeof window !== 'undefined') {
    // For chrome dev tool support
    window.React = React;
} else {
    // nodejs environment
    // TODO check if this code is really necessary
    GLOBAL.trackJs = function (e) {
        console.error(e);
    };
}

Router.run(Routes, Router.HistoryLocation, function (Root, state) {

    // IF the loop happens before the react.render it will slow down the rendering...
    // maybe do it only on the first time

    /*
     React.render must come first because it only get's executed slower (150-250ms) if
     we use back / next button or on the first load. After that all subsequent
     call's are really fast (approaching 0ms lag).

     If the state.routes.forEach get's called first it will always have a delay around 15-25ms
     (depending on the size of the fetchInitialData function) no matter how the call was done

     */
    try{
        React.render(<Root flux={Flux} route={state.path} />, document.getElementById('main'));
    } catch (e) {
        if (typeof window !== 'undefined' && window.trackJs) window.trackJs.track(e);
    }

    state.routes.forEach(function (route) {
        if (route.handler.fetchInitialData) {
            route.handler.fetchInitialData(Flux, state);
        }
    });
});
