import nrSmartConnection from '../web-components/nr-smart-connection'

let nrSmartConnectionsView = (() => {

    const Constructor = customOptions => {

        const defaultOptions = {}

        const options = {...defaultOptions, ...customOptions};

        let mySmartConnection = new nrSmartConnection({selector:'[class^="js-smart-connection-"]'})

    }

    return Constructor

})()

export default nrSmartConnectionsView