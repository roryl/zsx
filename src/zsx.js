
/**
 * @namespace ZsxJs
 */

/**
 * @typedef {(Document|Element|DocumentFragment)} DOMQueryable
 */

/**
 * @typedef {Object<string, string>} ZeroSyncParams
 */

var _ZsxJs = {};
_ZsxJs.ZsxJs = class ZsxJs {

	constructor(){
	}

	/**
	 * Parses the past document and sets up zero.js features
	 * @param {Document} dom
	 * @param {object} options - Configuration options for initializing zero.js features
	 */
	init(dom, options={}){

		if (typeof options === 'undefined') {
			this.options = {};
		} else {
			this.options = options;
		}

		this._rootDocument = dom;

		//on document ready
		var self = this;
		if (dom.readyState !== 'loading') {
			// Dialog must come first because it can interrupt the swap
			this._setupDialog(dom);
			this._setupSwap(dom);
		} else {
			dom.addEventListener('DOMContentLoaded', function(){
				self._setupDialog(dom);
				self._setupSwap(dom);
			});
		}

		window.onpopstate = function(event) {


			if(event.state) {
				// event.state is equal to the data-attribute of the last pushState
				// var path = event.state.path;

				// perform the AJAX call again to get the link content
				fetch(event.state.uri).then(response => {
					if (!response.ok) {
						throw new Error('Network response was not ok');
					}
					return response;
				}).then(response => {

					console.warn(event.state);
					self._handleLinkResponse(
						response,
						dom,
						event.state.swapSelectors,
						event.state.uri,
						event.state.zeroSyncParams,
						event.state.triggerAnchorElement,
						false
					);

				}).catch(error => {
					throw new Error('ZsxJs: There was a problem with the fetch operation: ' + error.message);
				});

			}

		};

	}

	/**
	 * Parses the past document and sets up dialog elements. When the links or buttons are clicked
	 * then the dialog will be displayed before the action is continued
	 * @param {DOMQueryable} dom
	 */
	_setupDialog(dom){

		//Get all a links and forms with zx-dialog-confirm attribute
		var dialogElements = dom.querySelectorAll('a[zx-dialog-confirm], button[zx-dialog-confirm]');

		dialogElements.forEach((element) => {
			// If we are a HTMLAnchorElement or HTMLButtonElement
			if(element instanceof HTMLAnchorElement || element instanceof HTMLButtonElement){
				this._decorateZeroDialog(dom, element);
			} else {
				throw new Error('ZsxJs: target is not an anchor link or button. We should not be here');
			}
		});

	}

	/**
	 * Parses the past document and sets up zero.js features
	 * @param {DOMQueryable} dom
	 */
	_setupSwap(dom){

		//Get all a links and forms with zx-swap attribute
		var elementsToSwap = [];
		var zeroSwapElements = dom.querySelectorAll('a[zx-swap], form[zx-swap]');

		zeroSwapElements.forEach((element) => {
			elementsToSwap.push(element);
		});

		//If the dom is an HTMLAnchorElement or HTMLFormElement that itself contains a zx-swap attribute
		//then we are updating ourself and so we will add it into zeroSwapElements
		if(dom instanceof HTMLAnchorElement || dom instanceof HTMLFormElement){
			if(dom.hasAttribute('zx-swap')){
				elementsToSwap.push(dom);
			}
		}

		elementsToSwap.forEach((target) => {
			// If the target is an anchor link we are gong to intercept the click event
			// with an ajax call and load the content into the target
			if(target instanceof HTMLAnchorElement) {
				this._decorateZeroSwapLink(dom, target);
			} else if(target instanceof HTMLFormElement){
				this._decorateZeroSwapForm(dom, target);
			} else {
				throw new Error('ZsxJs: target is not an anchor link or form. We should not be here');
			}
		});
	}


	/**
	 * Syncs the given parameters with other links on the page
	 * that match the same path. This ensures that all links with the same path
	 * have the same parameter state.
	 * @param {DOMQueryable} dom
	 * @param {string} link
	 * @param {ZeroSyncParams} syncParams
	 */
	_syncLinkParams(dom, link, syncParams){

		// this.log('sync link params: ' + link + ' ' + syncParams.toString());
		var linkBasePath = link.split('?')[0];
		var linkParamString = link.split('?')[1];
		var linkParams = new URLSearchParams(linkParamString);

		var aLinks = dom.querySelectorAll('a');

		// For each alink, we need to loop through the trackUrlParams and update the values
		// to match those provided in the linkParams
		aLinks.forEach((aLink) => {

			// this.log("link" + aLink);
			var href = aLink.href;


			// If the href is null, then we are going to skip this link
			if(href === null){
				// this.log('href is null');
				return;
			}

			var hrefBasePath = href.split('?')[0];

			//The linkBasePath and hrefBasePath should be the same
			if(linkBasePath !== hrefBasePath){
				// this.log('href does not match linkBasePath: ' + hrefBasePath + ' ' + linkBasePath);
				return;
			}

			var hrefParamString = href.split('?')[1];
			var urlParams = new URLSearchParams(hrefParamString);
			var hasZeroSyncParams = aLink.hasAttribute('zx-sync-params');
			var zeroSyncParams = aLink.getAttribute('zx-sync-params') || '';
			var anyLinksTouched = false;

			for(var syncParam in syncParams){

				// If the link has zx-sync-params and the syncParam is in the list
				// then we are going to skip this param because the presense of the param
				// in the zx-sync-params list means that we do not want to sync it
				if(hasZeroSyncParams && zeroSyncParams.includes(syncParam)){
					// this.log('skip because matching zx-sync-params');
					continue;
				}

				if(linkParams.has(syncParam)){
					var paramToSet = linkParams.get(syncParam);

					if(paramToSet == null){
						urlParams.delete(syncParam);
					} else {
						urlParams.set(syncParam, paramToSet);
					}

				} else {
					urlParams.delete(syncParam);
				}

				anyLinksTouched = true;
			}

			// this.log(urlParams.toString());
			if(anyLinksTouched){
				var newHref = hrefBasePath + '?' + urlParams.toString();
				aLink.setAttribute('href', newHref);
			}

		});
	}

	/**
	 * Given an anchor or button element that was swapped, we are going to parse the element
	 * for zx-scroll-to and scroll to the position
	 * @param {string} priorLocation - The location before the swap
	 * @param {string} currentLocation - The location after the swap
	 * @param {HTMLAnchorElement|HTMLButtonElement} clickedElement - The element that was clicked
	 * @param {HTMLFormElement|null} submittedForm - The form that was submitted, if any
	 */
	_parseAndExecuteElementScrollTo(priorLocation, currentLocation, clickedElement, submittedForm){

		// var hasScrollTo = false;
		if(clickedElement.hasAttribute('zx-scroll-to')){
			var hasScrollTo = true;
			var scrollTo = clickedElement.getAttribute('zx-scroll-to') || '';
		} else {

			//Pasrse the currentLocation URL
			var currentURL = new URL(currentLocation);

			//Check if we have a fragement identifier
			if(currentURL.hash){
				var hasScrollTo = true;
				var scrollTo = currentURL.hash;
			} else {
				var hasScrollTo = false;
				scrollTo = '';
			}
		}

		if(hasScrollTo){

			var scrollToIsBoolean = scrollTo === 'true' || scrollTo === 'false';
			var scrollToIsTargetId = scrollTo.includes('#');
			var scrollToIsClass = scrollTo.includes('.');
			var scrollToIsTop = scrollTo === 'top';
			var scrollToIsIfNeeded = scrollTo === 'if-needed';

			if(scrollToIsBoolean){
				if(scrollTo === 'true'){

					if(clickedElement.hasAttribute('zx-swap')){
						var swapSelector = clickedElement.getAttribute('zx-swap');
					} else {
						if(submittedForm !== null){
							var swapSelector = submittedForm.getAttribute('zx-swap');
						} else {
							throw new Error('ZsxJs: zx-swap is null when zx-scroll-to is true');
						}
					}

					if(swapSelector === null){
						throw new Error('ZsxJs: zx-swap is null when zx-scroll-to is true');
					}

					// @ts-ignore
					var targetElement = document.querySelector(swapSelector);
					if(targetElement !== null && targetElement !== undefined){
						targetElement.scrollIntoView({behavior: 'auto'});
					}
				}
			} else if (scrollToIsTargetId || scrollToIsClass){
				var targetElement = document.querySelector(scrollTo);
				if(targetElement !== null && targetElement !== undefined){
					targetElement.scrollIntoView({behavior: 'auto'});
				}
			} else if (scrollToIsTop){
				window.scrollTo({top: 0, behavior: 'auto'});
			}
		} else {

			// We are going to check if the priorLocation and currentLocation have different base path and if they do, we scroll to the top
			var priorURL = new URL(priorLocation);
			var currentURL = new URL(currentLocation);

			if(priorURL.pathname !== currentURL.pathname){
				window.scrollTo({top: 0, behavior: 'instant'});
			}

		}
	}

	/**
	 * Given a document object, a response string and a comma separated list of selectors we are going
	 * to swap the matching elements in the document with the elements in the response. The selectors
	 * are a comma separated list of selectors. This function merely loops over them and is a wrapper
	 * @param {DOMQueryable} dom
	 * @param {string} response
	 * @param {string} selectorsToSwap
	 */
	_parseResponseAndSwapSelectors(dom, response, selectorsToSwap){
		var selectorArray = selectorsToSwap.split(',');
		selectorArray.forEach((selector) => {
			this._parseResponseAndSwapSelector(dom, response, selector);
		});
	}

	/**
	 * Given a document object, a response string and a selector, swaps the matching elements
	 * in the document with the elements in the response
	 * @param {DOMQueryable} dom
	 * @param {string} response
	 * @param {string} selector
	 */
	_parseResponseAndSwapSelector(
		dom,
		response,
		selector,
	){

		this.log('start _parseResponseAndSwapSelector');

		if(selector === null){
			throw new Error('ZsxJs: selector is null');
		}

		// If the selector is a comma separated list, throw an error
		if(selector.includes(',')){
			throw new Error('ZsxJs: selector is a comma separated list. You can only pass a single selector to _parseResponseAndSwapSelector. Use _parseResponseAndSwapSelectors for multiple selectors');
		}

		// TODO: The document object should be passed in as a parameter but for now we are going to use the global
		// document object because for some reason what is being passed in is not working when the
		// tag is the body
		var originalSelectedElements = document.querySelectorAll(selector);

		// this.log(originalSelectedElements);
		// this.log(`selector: ${selector}`);
		// this.log(`originalSelectedElements.length: ${originalSelectedElements.length}`);

		if(originalSelectedElements.length === 0){
			throw new Error(`ZsxJs: No elements found with selector "${selector}"`);
		}

		// If we have more than one element with the selector, then we are going to
		// need an Id to target the specific element. Check to see if each element
		// has an id, if not, then we are going to throw an error
		var allHasId = true;
		var useId = false;
		if(originalSelectedElements.length > 1){
			useId = true;
			originalSelectedElements.forEach((element) => {
				// this.log('id:' + element.id);
				if(element.id === ''){
					allHasId = false;
				}
			});
		}

		if(useId && !allHasId){
			throw new Error(`ZsxJs: Multiple elements found with selector "${selector}" but no id found to disambiguate them.`);
		}

		originalSelectedElements.forEach((originalTargetElement) => {

			// this.log('_parseResponseAndSwapSelectors: replacing target element');

			var parser = new DOMParser();
			var responseDom = parser.parseFromString(response, 'text/html');

			if(useId){
				var responseSelector = '#' + originalTargetElement.id;
			} else {
				var responseSelector = selector;
			}

			var newTargetElement = responseDom.querySelector(responseSelector);

			if(newTargetElement !== null){
				this._doSwap(dom, originalTargetElement, newTargetElement, responseSelector);
			}

		});

		// this.log('end _parseResponseAndSwapSelectors');
	}

	/**
	 * Swaps the oldElement with the newElement and uses the selector to find the
	 * new element added
	 * @param {DOMQueryable} dom
	 * @param {Element} oldElement
	 * @param {Element} newElement
	 * @param {string} selector
	 */
	_doSwap(dom, oldElement, newElement, selector){

		var keepElements = oldElement.querySelectorAll('[zx-keep]');

		var scrollPositions = new Map();
		// Capture scroll position for each keepElement if it is scrollable
		keepElements.forEach((keepElement) => {
			if (keepElement.scrollHeight > keepElement.clientHeight || keepElement.scrollWidth > keepElement.clientWidth) {
				scrollPositions.set(keepElement, {
					scrollTop: keepElement.scrollTop,
					scrollLeft: keepElement.scrollLeft
				});
			}
		});

		// Create a document fragment to hold these elements temporarily
		var fragment = document.createDocumentFragment();
		keepElements.forEach((keepElement) => {
			fragment.appendChild(keepElement);
		});

		// Get the height of the oldElement that we will replace that is currently in the body
		var oldElementHeight = oldElement.scrollHeight;

		// Get or create spacer div #zeroViewportSpacer to end of body
		var zeroViewportSpacer = document.getElementById('zeroViewportSpacer');
		if (!zeroViewportSpacer) {
			zeroViewportSpacer = document.createElement('div');
			zeroViewportSpacer.id = 'zeroViewportSpacer';
			document.body.appendChild(zeroViewportSpacer);
		}

		// Add the oldElementHeight to the spacer min-height to keep the body from collapsing
		var currentMinHeight = parseInt(zeroViewportSpacer.style.minHeight || '0') + oldElementHeight;
		zeroViewportSpacer.style.minHeight = currentMinHeight + 'px';

		oldElement.outerHTML = newElement.outerHTML;

		var finalNewElement = document.querySelector(selector);

		//If the finalNewElement is null, then we are going to throw an error
		if(finalNewElement === null){
			throw new Error('ZsxJs: finalNewElement is null');
		}

		this._setupDialog(finalNewElement);
		this._setupSwap(finalNewElement);

		//Execute any inline scripts within the doc
		var scripts = finalNewElement.getElementsByTagName('script');
		for (var i = 0; i < scripts.length; i++) {

			var newScript = document.createElement('script');

			//If the script tag contains a type attribute and it is not text/javascript then we are going to skip it
			if(scripts[i].hasAttribute('type')){
				if(scripts[i].getAttribute('type') !== 'text/javascript'){
					continue;
				}
			}

			if(scripts[i].src){
				newScript.src = scripts[i].src;
			} else {
				newScript.innerHTML = scripts[i].innerHTML;
			}

			document.body.appendChild(newScript);
		}

		keepElements.forEach((keepElement) => {

			if(newElement !== null){

				var idSelector = `#${keepElement.id}`;
				var oldKeep = document.querySelector(idSelector);

				if(oldKeep !== null){
					// replace oldKeep nodes with keepElement not using outerHTML
					// because it will remove the event listeners
					var parentNode = oldKeep.parentNode;

					if(parentNode !== null){
						parentNode.replaceChild(keepElement, oldKeep);

						// Restore scroll position after element is re-inserted
						const savedPosition = scrollPositions.get(keepElement);
						if (savedPosition) {
							keepElement.scrollTop = savedPosition.scrollTop;
							keepElement.scrollLeft = savedPosition.scrollLeft;
						}
					}
				}
			}
		});

		// Get there the top of the spacer is in relation to the viewport
		var zeroViewportSpacerTop = zeroViewportSpacer.getBoundingClientRect().top;

		// If the spacer is below the viewport, then we can set its hight to 0
		// because it is not needed
		if(zeroViewportSpacerTop >= window.innerHeight){
			zeroViewportSpacer.style.minHeight = '0px';
		} else {
			// If the spacer is above the viewport, then we need to set its height at least
			// the height of the viewport minus the top of the spacer so that the page
			// does not collapse
			var newSpacerHeight = window.innerHeight - zeroViewportSpacerTop;
			zeroViewportSpacer.style.minHeight = newSpacerHeight + 'px';
		}

		this.emitEvent('zsx.zx-swap.after', {
			oldElement: oldElement,
			newElement: finalNewElement,
			selector: selector
		});
	}

	/**
	 *
	 * @param {HTMLAnchorElement|HTMLButtonElement} element
	 */
	_startLoader(element){

		//If we are an HTMLAnchorElement
		if(element instanceof HTMLAnchorElement){

			var loader = element.getAttribute('zx-loader');
			var loaderIsBoolean = loader === 'true' || loader === 'false';

			if(loaderIsBoolean){
				if(loader === 'true'){

					var linkLoaderClass = 'zx-loader-link';

					//Add the linkLoaderClass to the anchor element
					element.classList.add(linkLoaderClass);

					var loadingSpan = `<span class="zx-loader-progress-bar"></span>`;

					//Prepend the loader span to the link
					element.innerHTML = loadingSpan + element.innerHTML;

				}
			}
		}

		if(element instanceof HTMLButtonElement){

			var loader = element.getAttribute('zx-loader');
			var loaderIsBoolean = loader === 'true' || loader === 'false';

			if(loaderIsBoolean){
				if(loader === 'true'){

					var buttonLoaderClass = 'zx-loader-button';

					//Add the buttonLoaderClass to the button
					element.classList.add(buttonLoaderClass);

					var loaderSpan = '<span class="zx-loader-progress-bar"></span>'
					// var loaderSpan = '<span class="zx-spinner"></span>'

					// Prepend the loaderSpan to the button
					element.innerHTML = loaderSpan + element.innerHTML;

					// Disable the button so that it can't be clicked again
					element.setAttribute('disabled', 'true');

				}
			}
		}
	}

	/**
	 * @param {HTMLAnchorElement|HTMLButtonElement} element
	 *
	 */
	_stopLoader(element){

		//If we are an HTMLAnchorElement
		if(element instanceof HTMLAnchorElement){

			var loader = element.querySelector('.zx-loader-progress-bar');
			if(loader !== null){
				element.removeChild(loader);
			}

			// Remove the dislabled attribute
			element.removeAttribute('disabled');

			//If the element contains .zx-spinner-button then we are going to remove it
			element.classList.remove('zx-loader-link');

		}

		if(element instanceof HTMLButtonElement){
			//If the element contains .zx-spinner then we are going to remove it
			var loader = element.querySelector('.zx-loader-progress-bar');
			if(loader !== null){
				element.removeChild(loader);
			}

			// Remove the dislabled attribute
			element.removeAttribute('disabled');

			//If the element contains .zx-spinner-button then we are going to remove it
			element.classList.remove('zx-loader-button');
		}

		// If the element contains any objects with class .zx-loader then we
		// are going to add the class .zx-loading
		var loader = element.querySelector('.zx-loading');
		if(loader !== null){
			loader.classList.remove('zx-loading');
			loader.classList.add('zx-loader');
		}
	}

	/**
	 * Given a document object and an element, we are going to decorate the element with a click handler that interrupts
	 * the click event and displays a dialog before continuing
	 * @param {DOMQueryable} dom
	 * @param {HTMLAnchorElement|HTMLButtonElement} element
	 */
	_decorateZeroDialog(dom, element){

		element.addEventListener('click', (e) => {

			var dialogText = element.getAttribute('zx-dialog-confirm');
			var dialogTitle = element.getAttribute('zx-dialog-confirm-title') || 'Confirm';
			var dialogOk = element.getAttribute('zx-dialog-confirm-yes') || 'OK';
			var dialogCancel = element.getAttribute('zx-dialog-confirm-no') || 'Cancel';
			var dialogIsConfirmed = element.getAttribute('data-dialog-confirmed') || 'false';

			if(dialogIsConfirmed === 'false'){

				// this.log('zeroDialogClick');
				e.preventDefault();
				e.stopImmediatePropagation();

				var dialogTemplate = `
					<dialog>
						<h2>${dialogTitle}</h2>
						<p>${dialogText}</p>
						<button class="zx-dialog-confirm-yes">${dialogOk}</button>
						<button class="zx-dialog-confirm-no">${dialogCancel}</button>
					</dialog>
				`;

				var parser = new DOMParser();
				var dialogDom = parser.parseFromString(dialogTemplate, 'text/html');
				var dialog = dialogDom.querySelector('dialog');

				if(dialog === null){
					throw new Error('ZsxJs: dialog is null');
				}

				// Append the dialog to the body
				document.body.appendChild(dialog);

				dialog.showModal();

				dialog.querySelector('.zx-dialog-confirm-yes')?.addEventListener('click', (e) => {
					element.setAttribute('data-dialog-confirmed', 'true');
					dialog?.close();
					element.click();
					element.setAttribute('data-dialog-confirmed', 'false');
				});

				dialog.querySelector('.zx-dialog-confirm-no')?.addEventListener('click', (e) => {
					element.setAttribute('data-dialog-confirmed', 'false');
					dialog?.close();

					// Remove the dialog from the body
					if(dialog !== null){
						document.body.removeChild(dialog); // Optional, to clean up the document
					}
				});
			}

		});

	}

	/**
	 * Given a form element, we are going to intercept the submit event and perform an ajax request
	 * @param {DOMQueryable} dom
	 * @param {HTMLFormElement} form
	 */
	_decorateZeroSwapForm(dom, form){
		form.addEventListener('submit', (e) => {
			e.preventDefault();

			var self = this;
			var action = form.action;
			var method = form.method;
			var formData = new FormData(form);
			var clickedButton = e.submitter;
			var locationPriorToFetch = window.location.href;

			var selectorsToSwap = form.getAttribute('zx-swap');

			// Append the button's name and value if they exist
			if (clickedButton !== null) {

				//If the clickedButton has a formAction then we need to set the action to the formAction
				if(clickedButton.hasAttribute('formaction')){
					var formAction = clickedButton.getAttribute('formaction');
					if(formAction !== null){
						action = formAction;
					}
				}

				//If the clickedButton has a formMethod then we need to set the method to the formMethod
				if(clickedButton.hasAttribute('formmethod')){
					var formMethod = clickedButton.getAttribute('formmethod');
					if(formMethod !== null){
						method = formMethod;
					}
				}

				if(clickedButton.hasAttribute('name') && clickedButton.hasAttribute('value')){
					var name = clickedButton.getAttribute('name');
					var value = clickedButton.getAttribute('value') || '';

					if (name !== null){
						formData.append(name, value);
					}
				}
			}

			// this.log(e);

			if(clickedButton !== null && clickedButton instanceof HTMLButtonElement){
				this._startLoader(clickedButton);
			}

			var requestData = {
				method: method,
			}

			if(method == 'post'){
				// @ts-ignore
				requestData.body = formData;
			}

			/**
			 * @param {Response} response
			 */
			var successFunc = function(response){

				// If the response was a redirect then the path that we want to push
				// to the history is the redirect path
				if(response.redirected){
					var path = response.url;
				} else {
					var path = action;
				}

				response.text().then(content => {

					if(selectorsToSwap === null){
						throw new Error('ZsxJs: selectorsToSwap is null');
					}

					self._parseResponseAndSwapSelectors(dom, content, selectorsToSwap);

					if(clickedButton !== null && clickedButton instanceof HTMLButtonElement){
						self._parseAndExecuteElementScrollTo(
							locationPriorToFetch,
							path,
							clickedButton,
							form
						);
					}

					return content;
				});

				//Add the target.href to the history
				window.history.pushState({path: path}, '', path);

				if(clickedButton !== null && clickedButton instanceof HTMLButtonElement){
					self._stopLoader(clickedButton);
				}
				// callback(null, body); // Success: call the callback with no error and the body
			}

			fetch(action, requestData).then(response => {

				if (!response.ok) {
					throw new Error('Network response was not ok');
				}
				return response;

			}).then(response => {

				successFunc(response);

			}).catch(error => {
				throw new Error('ZsxJs: There was a problem with the fetch operation: ' + error.message);
			});

			// alert('submitted');

		});
	}

	/**
	 * Success function to parse the response, perform a swap and update the history
	 * @param {Response} response
	 * @param {DOMQueryable} dom
	 * @param {string} swapSelectors
	 * @param {string} uri
	 * @param {HTMLAnchorElement} triggerAnchorElement,
	 * @param {ZeroSyncParams} zeroSyncParams
	 * @param {boolean} shouldPushHistory
	 */
	_handleLinkResponse(response, dom, swapSelectors, uri, triggerAnchorElement, zeroSyncParams, shouldPushHistory=true){

		response.text().then(content => {

			if(swapSelectors === null){
				throw new Error('ZsxJs: swapSelectors is null');
			}

			this._parseResponseAndSwapSelectors(dom, content, swapSelectors);
			this._parseAndExecuteElementScrollTo(
				window.location.href,
				uri,
				triggerAnchorElement,
				null
			);

			//Add the uri to the history
			if(shouldPushHistory){
				window.history.pushState({
					uri: uri,
					swapSelectors: swapSelectors,
					zeroSyncParams: zeroSyncParams
				}, '', uri);

				this._stopLoader(triggerAnchorElement);
			}

			//if not undefined
			if(zeroSyncParams !== null){
				this._syncLinkParams(dom, uri, zeroSyncParams);
			}

			// callback(null, body); // Success: call the callback with no error and the body
		});

	}

	/**
	 * Parses the past document and sets up zero.js features
	 * @param {DOMQueryable} dom
	 * @param {HTMLAnchorElement} triggerAnchorElement
	 */
	_decorateZeroSwapLink(dom, triggerAnchorElement){

		//If the link has zx-link-mode="app" then we are going to disable the default .href
		// and set the cursor to pointer
		if(triggerAnchorElement.hasAttribute('zx-link-mode')){

			var linkMode = triggerAnchorElement.getAttribute('zx-link-mode');

			if(linkMode === 'app'){
				triggerAnchorElement.setAttribute('data-href', triggerAnchorElement.href);
				triggerAnchorElement.style.cursor = 'pointer';
				triggerAnchorElement.removeAttribute('href');
			}
		}

		triggerAnchorElement.addEventListener('click', (e) => {

			this.log('zeroSwapClick');
			e.preventDefault();

			var swapSelectors = triggerAnchorElement.getAttribute('zx-swap');

			if(swapSelectors === null){
				throw new Error('ZsxJs: swapSelectors is null');
			}

			if(triggerAnchorElement.hasAttribute('data-href')){
				var uri = triggerAnchorElement.getAttribute('data-href') || '';
			} else {
				var uri = triggerAnchorElement.href;
			}


			this._startLoader(triggerAnchorElement);

			fetch(uri).then(response => {
				if (!response.ok) {
					throw new Error('Network response was not ok');
				}
				return response;
			}).then(response => {

				if(swapSelectors === null){
					throw new Error('ZsxJs: swapSelectors is null');
				}

				this._handleLinkResponse(
					response,
					dom,
					swapSelectors,
					uri,
					triggerAnchorElement,
					this._parseSyncParams(triggerAnchorElement.getAttribute('zx-sync-params'))
				);

			}).catch(error => {
				throw new Error('ZsxJs: There was a problem with the fetch operation: ' + error.message);
			});
			// }

		});
	}

	/**
	 * Parses the zx-sync-params attribute and returns an object with the params
	 * as keys and values
	 * @param {string|null} zeroSyncParams
	 * @returns {ZeroSyncParams}
	 */
	_parseSyncParams(zeroSyncParams){

		if(zeroSyncParams === null){
			return {};
		}

		var syncParams = zeroSyncParams.split(',');

		/** @type {ZeroSyncParams} */
		var syncParamsObject = {};

		syncParams.forEach((param) => {
			syncParamsObject[param] = param;
		});

		return syncParamsObject;
	}

	/**
	 * @param {any} text
	 */
	log(text){
		console.log(text);
	}

	/**
	 * @param {string} text
	 */
	dialog(text){

		// Create a dialog element using the <dialog></dialog> tag
		var dialogTemplate = `
			<dialog>
				<p>${text}</p>
				<button>Close</button>
			</dialog>
		`;

	}

	/**
	 * Emits a custom event when we have swapped content
	 * @param {string} name
	 * @param {*} details
	 */
	emitEvent(name, details) {
		const appUpdateEvent = new CustomEvent(name, {
			detail: details
		});
		document.dispatchEvent(appUpdateEvent);
	}
}

let ZsxJs = new _ZsxJs.ZsxJs();
ZsxJs.init(document);