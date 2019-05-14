const NR_ELECTRICAL_CONNECTOR_NAMESPACE = "nr-electrical-connector";

import styles from '../../css/web-components/nr-electrical-connector'
import pluggedImg from '../../img/plugged.svg'
import unpluggedImg from '../../img/unplugged.svg'

let nrElectricalConnector = (function (){
    'use strict';

    var Constructor = function(customOptions){

        var publicMethods = {};

        // Default options
        var defaultOptions = {
            pluggedImgSrc: pluggedImg,
            unpluggedImgSrc: unpluggedImg,
        };

        var options = Object.assign({}, defaultOptions, customOptions);

        // Throw an error if required preconditions violated
        var isCalledProperly = function () {

            // Checking selector is passed
            if (options.selector === '') {

                throw NR_ELECTRICAL_CONNECTOR_NAMESPACE+' | Error: the "selector" parameter is empty. A selector is needed to attach this plugin to.';

            } else if (document.querySelectorAll(options.selector).length == 0) {

                throw NR_ELECTRICAL_CONNECTOR_NAMESPACE+' | Error: there is no DOM items with "' + options.selector + '" selector. A valid DOM element is needed to attach this plugin to.';

            }

            return true;
        };

        // Check if element is the expected type, otherwise create a warning and ignore the element
        var elementIsAnInputCheckbox = function(element) {

            if (element.tagName.toLowerCase() !== 'input' || element.getAttribute('type').toLowerCase() !== 'checkbox') {
                console.warn(NR_ELECTRICAL_CONNECTOR_NAMESPACE+' | Error: this element is not an input of checkbox type');
                return false;
            }
            return true;
        }

        var elementIsAlreadyComponent = function(element) {
            return (element.parentNode.tagName.toLowerCase() === 'label' &
                    element.parentNode.classList.contains(styles.nrElectricalConnector));
        }

        // Main entry point
        var init = function () {

            if (isCalledProperly()) {

                document.querySelectorAll(options.selector).forEach(function(element) {
                    if (elementIsAnInputCheckbox(element) && !elementIsAlreadyComponent(element)) {
                        createMarkUp(element);
                        defineBehavior(element);
                        addGetters(element);
                        addSetters(element);
                    }
                })
            }
        };

        // Create plugin HTML elements and behavior
        var createMarkUp = function(checkboxElement) {

            var elementID = checkboxElement.getAttribute('id'),
                elementIsChecked = checkboxElement.hasAttribute('checked'),
                markup, parentLabelElement;

            markup = elementIsChecked ? '<img src="'+ options.pluggedImgSrc +'" />':'<img src="'+ options.unpluggedImgSrc +'" />';

            parentLabelElement = document.createElement('label');
            parentLabelElement.classList.add(styles.nrElectricalConnector);

            if (elementID) {
                parentLabelElement.setAttribute('for', elementID);
            }

            checkboxElement.parentNode.replaceChild(parentLabelElement,checkboxElement);
            parentLabelElement.appendChild(checkboxElement);
            parentLabelElement.insertAdjacentHTML('beforeend', markup);

        }

        // Register listeners and set appropiate reactions
        var defineBehavior = function(checkboxElement){
            if(!checkboxElement.hasAttribute("disabled")){
                var elements = checkboxElement.parentNode.querySelectorAll('img');
                for(var i=0;i<elements.length; i++)
                {
                    elements[i].addEventListener('click',changeState,false);
                }
            }
        }

        var changeState = function(e) {

            var clickedElement = e.target,
                inputElement = clickedElement.parentNode.getElementsByTagName("input")[0],
                isOn = inputElement.hasAttribute('checked');

            setNewState(inputElement, !isOn);

            if(options.callback !== undefined){
                options.callback(options.caller, getState(inputElement));
            }

        }

        var setNewState = function(element, newState){
            if (newState) {
                element.setAttribute('checked',true);
                element.parentNode.getElementsByTagName("img")[0].src = options.pluggedImgSrc;
            } else {
                element.removeAttribute('checked');
                element.parentNode.getElementsByTagName("img")[0].src = options.unpluggedImgSrc;
            }
        }

        var getState = function(element){
            return element.hasAttribute('checked');
        }

        var addGetters = function(element) {

            element.getPlugState = function(){
                return getState(element);
            };

        }

        var addSetters = function(element) {

            element.setPlugState = function(newState){
                setNewState(element, newState);
            };

        }

        init();

        return publicMethods;
    };

    return Constructor;

})();

export default nrElectricalConnector;