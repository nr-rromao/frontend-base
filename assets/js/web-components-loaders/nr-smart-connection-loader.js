import nrSmartConnection from '../web-components/nr-smart-connection';

let nrSmartConnectionsView = (function(){

    var Constructor = function(customOptions){

        // Default options
        var defaultOptions = {};

        var options = Object.assign({}, defaultOptions, customOptions);

        let mySmartConnection = new nrSmartConnection({selector:'[class^="js-smart-connection-"]'});

    }

    return Constructor;

})();

export default nrSmartConnectionsView;