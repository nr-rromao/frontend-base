import nrElectricalConnector from './nr-electrical-connector';
import styles from '../../css/web-components/nr-smart-connection'

const NR_SMART_CONNECTION_NAMESPACE = "nr-smart-connection";

let nrSmartConnection = (function (){
    'use strict';

    var Constructor = function(customOptions){

        var publicMethods = {};

        // Default options
        var defaultOptions = {};

        var options = Object.assign({}, defaultOptions, customOptions);

        var smartConnectionObj = {};

        // Throw an error if required preconditions violated
        var isCalledProperly = function () {

            // Checking selector is passed
            if (options.selector === '') {

                throw NR_SMART_CONNECTION_NAMESPACE+' | Error: the "selector" parameter is empty. A selector is needed to attach this plugin to.';

            } else if (document.querySelectorAll(options.selector).length == 0) {

                throw NR_SMART_CONNECTION_NAMESPACE+' | Error: there is no DOM items with "' + options.selector + '" selector. A valid DOM element is needed to attach this plugin to.';

            }

            return true;
        };

        // Check if element is the expected type, otherwise create a warning and ignore the element
        var elementIsAnArticle = function(element) {

            if (element.tagName.toLowerCase() !== 'article') {
                console.warn(NR_SMART_CONNECTION_NAMESPACE+' | Error: this element is not an article tag');
                return false;
            }

            return true;
        }

        var changeState = function(smartConnectionElement, newState){
            smartConnectionElement.setSmartConnectionState(newState);
        }

        // Main entry point
        var init = function () {

            if (isCalledProperly()) {

                var elements = document.querySelectorAll(options.selector);

                elements.forEach(function(element, index){
                    if (elementIsAnArticle(element)) {
                        fetch('http://localhost:3000/smart-connections/'+element.getAttribute('data-smart-connection-id'))
                            .then(response => response.json())
                            .then(data => {
                                smartConnectionObj = data;
                                createMarkUp(element);
                                new nrElectricalConnector({
                                    selector:'[class^="js-electrical-connector-"]',
                                    callback: changeState,
                                    caller: element
                                });
                                addSetters(element);
                            });
                    }
                })
            }
        };

        // Create plugin HTML elements
        var createMarkUp = function(articleElement) {

            var elementID = articleElement.getAttribute('id'),
                isConnected = articleElement.classList.contains('is-connected'),
                markup;

            articleElement.classList.add(styles.nrSmartConnection);

            var markup = `
                    <figure class="${styles.nrSmartConnection__productInfoContainer} ${smartConnectionObj['is-connected'] ? styles.isConnected:""}">
                        <img src="${smartConnectionObj['own-product-img-src']}">
                        <figcaption>
                            <h3>${smartConnectionObj['own-product-title']}</h3>
                            <h4>Precio: ${smartConnectionObj['own-product-currency-symbol']}${smartConnectionObj['own-product-price']}</h4>
                        </figcaption>
                    </figure>
                    <input type="checkbox" class="js-electrical-connector-${smartConnectionObj['id']}" ${smartConnectionObj['is-connected'] ? "checked":""}>
                    <figure class="${styles.nrSmartConnection__productInfoContainer} ${smartConnectionObj['is-connected'] ? styles.isConnected:""}"">
                        <img src="${smartConnectionObj['rival-product-img-src']}">
                        <figcaption>
                            <h3>${smartConnectionObj['rival-product-title']}</h3>
                            <h4>Precio: ${smartConnectionObj['rival-product-currency-symbol']}${smartConnectionObj['rival-product-price']}</h4>
                        </figcaption>
                    </figure>`;

            articleElement.insertAdjacentHTML('beforeend', markup);

        }

        var addSetters = function(element) {

            element.setSmartConnectionState = function(newState){
                setNewState(element, newState);
            };

        }

        var setNewState = function(element, newState){
            if (newState) {
                element.getElementsByTagName("figure")[0].classList.add(styles.isConnected);
                element.getElementsByTagName("figure")[1].classList.add(styles.isConnected);
            } else {
                element.getElementsByTagName("figure")[0].classList.remove(styles.isConnected);
                element.getElementsByTagName("figure")[1].classList.remove(styles.isConnected);
            }
        }

        init();

        return publicMethods;
    };

    return Constructor;

})();

export default nrSmartConnection;