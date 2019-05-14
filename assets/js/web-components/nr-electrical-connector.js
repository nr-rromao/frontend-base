const NR_ELECTRICAL_CONNECTOR_NAMESPACE = "nr-electrical-connector"

import styles from '../../css/web-components/nr-electrical-connector'
import pluggedImg from '../../img/plugged.svg'
import unpluggedImg from '../../img/unplugged.svg'

const nrElectricalConnector = (() => {
    'use strict'

    const Constructor = customOptions => {

        let publicMethods = {}

        // Default options
        const defaultOptions = {
            pluggedImgSrc: pluggedImg,
            unpluggedImgSrc: unpluggedImg
        }

        const options = {...defaultOptions, ...customOptions}

        // Throw an error if required preconditions violated
        const isCalledProperly = () => {

            // Checking selector is passed
            if (options.selector === '') {

                throw NR_ELECTRICAL_CONNECTOR_NAMESPACE+' | Error: the "selector" parameter is empty. A selector is needed to attach this plugin to.'

            } else if (document.querySelectorAll(options.selector).length === 0) {

                throw NR_ELECTRICAL_CONNECTOR_NAMESPACE+' | Error: there is no DOM items with "' + options.selector + '" selector. A valid DOM element is needed to attach this plugin to.'

            }

            return true
        }

        // Check if element is the expected type, otherwise create a warning and ignore the element
        const elementIsAnInputCheckbox = element => {

            if (element.tagName.toLowerCase() !== 'input' || element.getAttribute('type').toLowerCase() !== 'checkbox') {
                console.warn(NR_ELECTRICAL_CONNECTOR_NAMESPACE+' | Error: this element is not an input of checkbox type')
                return false
            }
            return true
        }

        const elementIsAlreadyComponent = element => {
            return (element.parentNode.tagName.toLowerCase() === 'label' &
                    element.parentNode.classList.contains(styles.nrElectricalConnector))
        }

        // Main entry point
        const init = () => {

            if (isCalledProperly()) {

                document.querySelectorAll(options.selector).forEach((element) => {
                    if (elementIsAnInputCheckbox(element) && !elementIsAlreadyComponent(element)) {
                        createMarkUp(element)
                        defineBehavior(element)
                        addGetters(element)
                        addSetters(element)
                    }
                })
            }
        }

        // Create plugin HTML elements and behavior
        const createMarkUp = (checkboxElement) => {

            let elementID = checkboxElement.getAttribute('id'),
                elementIsChecked = checkboxElement.hasAttribute('checked'),
                markup, parentLabelElement

            markup = elementIsChecked ? '<img src="'+ options.pluggedImgSrc +'" />':'<img src="'+ options.unpluggedImgSrc +'" />'

            parentLabelElement = document.createElement('label')
            parentLabelElement.classList.add(styles.nrElectricalConnector)

            if (elementID) {
                parentLabelElement.setAttribute('for', elementID)
            }

            checkboxElement.parentNode.replaceChild(parentLabelElement,checkboxElement)
            parentLabelElement.appendChild(checkboxElement)
            parentLabelElement.insertAdjacentHTML('beforeend', markup)

        }

        // Register listeners and set appropriate reactions
        const defineBehavior = checkboxElement => {
            if(!checkboxElement.hasAttribute("disabled")){
                let elements = checkboxElement.parentNode.querySelectorAll('img')
                for(let i=0;i<elements.length; i++)
                {
                    elements[i].addEventListener('click',changeState,false)
                }
            }
        }

        const changeState = event => {

            let clickedElement = event.target,
                inputElement = clickedElement.parentNode.getElementsByTagName("input")[0],
                isOn = inputElement.hasAttribute('checked')

            setNewState(inputElement, !isOn)

            if(options.callback !== undefined){
                options.callback(options.caller, getState(inputElement))
            }

        }

        const setNewState = (element, newState) => {
            if (newState) {
                element.setAttribute('checked',true)
                element.parentNode.getElementsByTagName("img")[0].src = options.pluggedImgSrc
            } else {
                element.removeAttribute('checked')
                element.parentNode.getElementsByTagName("img")[0].src = options.unpluggedImgSrc
            }
        }

        const getState = element => element.hasAttribute('checked')

        const addGetters = element => {

            element.getPlugState = () => getState(element)

        }

        const addSetters = element => {

            element.setPlugState = newState => {
                setNewState(element, newState)
            }

        }

        init()

        return publicMethods
    }

    return Constructor

})()

export default nrElectricalConnector