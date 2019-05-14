const NR_SMART_CONNECTION_NAMESPACE = "nr-smart-connection"

import nrElectricalConnector from './nr-electrical-connector'
import styles from '../../css/web-components/nr-smart-connection'

const nrSmartConnection = (() => {
    'use strict'

    const Constructor = customOptions => {

        let publicMethods = {}

        // Default options
        const defaultOptions = {}

        const options = {...defaultOptions, ...customOptions}

        // Throw an error if required preconditions violated
        const isCalledProperly = () => {

            // Checking selector is passed
            if (options.selector === '') {

                throw NR_SMART_CONNECTION_NAMESPACE+' | Error: the "selector" parameter is empty. A selector is needed to attach this plugin to.'

            } else if (document.querySelectorAll(options.selector).length === 0) {

                throw NR_SMART_CONNECTION_NAMESPACE+' | Error: there is no DOM items with "' + options.selector + '" selector. A valid DOM element is needed to attach this plugin to.'

            }

            return true
        }

        // Check if element is the expected type, otherwise create a warning and ignore the element
        const elementIsAnArticle = element => {

            if (element.tagName.toLowerCase() !== 'article') {
                console.warn(NR_SMART_CONNECTION_NAMESPACE+' | Error: this element is not an article tag')
                return false
            }

            return true
        }

        const changeState = (smartConnectionElement, newState) => {
            smartConnectionElement.setSmartConnectionState(newState)
            fetch('http://localhost:3000/smart-connections/'+smartConnectionElement.getAttribute('data-smart-connection-id'),
                {
                        method: 'PUT',
                        headers: {
                            'Accept': 'application/json',
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            ...smartConnectionElement.smartConnectionObj,
                            'is-connected': newState
                        })
                    }
                )
                .then(response => response.json())
                .then(data => {
                    // Manage response errors here
                    console.log(data)
                })
        }

        // Main entry point
        const init = () => {

            if (isCalledProperly()) {

                const elements = document.querySelectorAll(options.selector)

                elements.forEach((element, index) => {
                    if (elementIsAnArticle(element)) {
                        fetch('http://localhost:3000/smart-connections/'+element.getAttribute('data-smart-connection-id'))
                            .then(response => response.json())
                            .then(data => {
                                element.smartConnectionObj = data
                                createMarkUp(element)
                                new nrElectricalConnector({
                                    selector:'[class^="js-electrical-connector-"]',
                                    callback: changeState,
                                    caller: element
                                })
                                addSetters(element)
                            })
                    }
                })
            }
        }

        // Create plugin HTML elements
        const createMarkUp = articleElement => {

            articleElement.classList.add(styles.nrSmartConnection)

            let markup = `
                    <figure class="${styles.productInfoContainer} ${articleElement.smartConnectionObj['is-connected'] ? styles.isConnected:""}">
                        <img src="${articleElement.smartConnectionObj['own-product-img-src']}">
                        <figcaption>
                            <h3>${articleElement.smartConnectionObj['own-product-title']}</h3>
                            <h4>Precio: ${articleElement.smartConnectionObj['own-product-currency-symbol']}${articleElement.smartConnectionObj['own-product-price']}</h4>
                        </figcaption>
                    </figure>
                    <input type="checkbox" class="js-electrical-connector-${articleElement.smartConnectionObj['id']}" ${articleElement.smartConnectionObj['is-connected'] ? "checked":""}>
                    <figure class="${styles.productInfoContainer} ${articleElement.smartConnectionObj['is-connected'] ? styles.isConnected:""}"">
                        <img src="${articleElement.smartConnectionObj['rival-product-img-src']}">
                        <figcaption>
                            <h3>${articleElement.smartConnectionObj['rival-product-title']}</h3>
                            <h4>Precio: ${articleElement.smartConnectionObj['rival-product-currency-symbol']}${articleElement.smartConnectionObj['rival-product-price']}</h4>
                        </figcaption>
                    </figure>`

            articleElement.insertAdjacentHTML('beforeend', markup)

        }

        const addSetters = element => {

            element.setSmartConnectionState = function(newState){
                setNewState(element, newState)
            }

        }

        const setNewState = (element, newState) => {
            if (newState) {
                element.getElementsByTagName("figure")[0].classList.add(styles.isConnected)
                element.getElementsByTagName("figure")[1].classList.add(styles.isConnected)
            } else {
                element.getElementsByTagName("figure")[0].classList.remove(styles.isConnected)
                element.getElementsByTagName("figure")[1].classList.remove(styles.isConnected)
            }
        }

        init()

        return publicMethods
    }

    return Constructor

})()

export default nrSmartConnection