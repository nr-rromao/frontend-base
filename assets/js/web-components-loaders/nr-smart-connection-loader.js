import NrSmartConnection from '../web-components/nr-smart-connection'
import $ from 'jquery'

let NrSmartConnectionsView = (() => {

    const Constructor = customOptions => {

        const defaultOptions = {}

        const options = {...defaultOptions, ...customOptions};

        let mySmartConnection = new NrSmartConnection({selector:'[class^="js-smart-connection-"]'})

        $('#connectionChangedModal').modal({ show: false})

    }

    return Constructor

})()

export default NrSmartConnectionsView