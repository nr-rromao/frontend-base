import NrSmartConnection from '../web-components/nr-smart-connection'

let NrSmartConnectionsView = (() => {

    const Constructor = customOptions => {

        const defaultOptions = {}

        const options = {...defaultOptions, ...customOptions};

        let mySmartConnection = new NrSmartConnection({selector:'[class^="js-smart-connection-"]'})

    }

    return Constructor

})()

export default NrSmartConnectionsView