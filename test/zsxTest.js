// @ts-nocheck
// @ts-ignore
var expect = chai.expect;
// @ts-ignore
suite('ZsxJs', function() {

	var ZsxJstest = new ZsxJs();

	// @ts-ignore
	setup(function() {
		// @ts-ignore
		window.TestVars = {};
		var bodyTag = document.getElementsByTagName('body')[0];
		// @ts-ignore
		//Create a container div for our tests with id 'testContainer'
		var container = document.createElement('div');
		container.id = 'testContainer';

		// @ts-ignore
		bodyTag.appendChild(container);

	});

	// @ts-ignore
	teardown(function() {

		// @ts-ignore
		// Delete the test container
		var container = document.getElementById('testContainer');
		// @ts-ignore
		container.remove();

	});

	test('_parseZxEvent', function() {

		var parser = new DOMParser();
		var linkElement = parser.parseFromString('<a href="/foo" zx-swap="#testId">Foo</a>', 'text/html').body.firstChild;

		console.log(linkElement);

		var zxEvent = ZsxJstest._normalizeZxTrigger(
			linkElement
		);

		expect(zxEvent.type.isLink).to.be.true;
		expect(zxEvent.type.isForm).to.be.false;
		expect(zxEvent.method).to.equal('get');
		expect(zxEvent.url).to.equal('http://127.0.0.1:51404/foo');

		console.log(zxEvent);
	});

	// @ts-ignore
	test('_parseResponseAndSwapSelectors - Executes inline scripts', function() {

		// @ts-ignore
		window.TestVars.scriptIsExecuted = false;

		var content = '<div id="testId"><script>window.TestVars.scriptIsExecuted = true;</script></div>';
		var holder = document.createElement('div');
		holder.innerHTML = content;

		var bodyTag = document.getElementsByTagName('body')[0];
		// @ts-ignore
		bodyTag.appendChild(holder.firstChild);

		var parser = new DOMParser();
		var linkElement = parser.parseFromString('<a href="/foo" zx-swap="#testId">Foo</a>', 'text/html').body.firstChild;
		var zxTrigger = ZsxJstest._normalizeZxTrigger(
			linkElement
		);

		// zxTrigger = ZsxJstest._normalizeZxTrigger(holder.firstChild);

		ZsxJstest._parseResponseAndSwapSelectors(document, content, '#testId', zxTrigger);
		// @ts-ignore
		expect(window.TestVars.scriptIsExecuted).to.be.true;

	});

	// @ts-ignore
	test('_parseResponseAndSwapSelectors - Multiple selector elements defaults to Id', function() {

		var content = '<div class="replaceMe"><div class="replaceMe" ></div></div>';
		var holder = document.createElement('div');
		holder.innerHTML = content;

		var testContainer = document.getElementById('testContainer');
		// @ts-ignore
		testContainer.appendChild(holder.firstChild);

		// @ts-ignore
		expect(function() {
			ZsxJstest._parseResponseAndSwapSelectors(document, content, '.replaceMe');
		}).to.throw('ZsxJs: Multiple elements found with selector ".replaceMe" but no id found to disambiguate them.');

	});

	//@ts-ignore
	test('_parseResponseAndSwapSelectors - Class selector with Id', function() {

		var content = `
			<div>
				<div id="test1" class="replaceMe1">foo</div>
				<div id="test2" class="replaceMe1">foo</div>
			</div>
		`;

		var originalHolder = document.createElement('div');
		originalHolder.innerHTML = content;

		// @ts-ignore
		var testContainer = document.getElementById('testContainer');

		// @ts-ignore
		testContainer.appendChild(originalHolder);

		var newContent = `
			<div>
				<div id="test1" class="replaceMe1">bar</div>
				<div id="test2" class="replaceMe1">bar</div>
			</div>
		`;

		var parser = new DOMParser();
		var linkElement = parser.parseFromString('<a href="/foo" zx-swap="#testId">Foo</a>', 'text/html').body.firstChild;
		var zxTrigger = ZsxJstest._normalizeZxTrigger(
			linkElement
		);

		// console.log('foo' + document.getElementById('testContainer').innerHTML);

		// @ts-ignore
		ZsxJstest._parseResponseAndSwapSelectors(document, newContent, '.replaceMe1', zxTrigger);

		// alert(document.getElementById('test1').innerHTML);

		// @ts-ignore
		expect(document.getElementById('test1').innerHTML).to.equal('bar');
		// @ts-ignore
		expect(document.getElementById('test2').innerHTML).to.equal('bar');

	});

	//@ts-ignore
	test('_parseResponseAndSwapSelectors - Multiple selectors', function() {

		var content = `
			<div>
				<div id="test1">foo</div>
				<div id="test2">foo</div>
			</div>
		`;

		var originalHolder = document.createElement('div');
		originalHolder.innerHTML = content;

		// @ts-ignore
		var testContainer = document.getElementById('testContainer');

		// @ts-ignore
		testContainer.appendChild(originalHolder);

		var newContent = `
			<div>
				<div id="test1">bar</div>
				<div id="test2">bar</div>
			</div>
		`;

		var parser = new DOMParser();
		var linkElement = parser.parseFromString('<a href="/foo" zx-swap="#testId">Foo</a>', 'text/html').body.firstChild;
		var zxTrigger = ZsxJstest._normalizeZxTrigger(
			linkElement
		);

		// @ts-ignore
		ZsxJstest._parseResponseAndSwapSelectors(document, newContent, '#test1,#test2', zxTrigger);

		// alert(document.getElementById('test1').innerHTML);

		// @ts-ignore
		expect(document.getElementById('test1').innerHTML).to.equal('bar');
		// @ts-ignore
		expect(document.getElementById('test2').innerHTML).to.equal('bar');

	});

	//@ts-ignore
	test('_parseResponseAndSwapSelectors - Zx-Keep', function() {

		var content = `
			<div>
				<div id="subContainer">
					<div id="test1">foo</div>
					<div id="test2" zx-keep="true">foo</div>
				</div>
			</div>
		`;

		var originalHolder = document.createElement('div');
		originalHolder.innerHTML = content;

		// @ts-ignore
		var testContainer = document.getElementById('testContainer');

		// @ts-ignore
		testContainer.appendChild(originalHolder);

		var newContent = `
			<div>
				<div id="subContainer">
					<div id="test1">bar</div>
					<div id="test2" zx-keep="true">bar</div>
				</div>
			</div>
		`;

		var parser = new DOMParser();
		var linkElement = parser.parseFromString('<a href="/foo" zx-swap="#testId">Foo</a>', 'text/html').body.firstChild;
		var zxTrigger = ZsxJstest._normalizeZxTrigger(
			linkElement
		);

		// @ts-ignore
		ZsxJstest._parseResponseAndSwapSelectors(document, newContent, '#subContainer', zxTrigger);

		// @ts-ignore
		console.log(document.getElementById('testContainer').innerHTML);

		// @ts-ignore
		expect(document.getElementById('test1').innerHTML).to.equal('bar');
		// @ts-ignore
		expect(document.getElementById('test2').innerHTML).to.equal('foo');

	});

	//@ts-ignore
	test('_parseResponseAndSwapSelectors - Zx-Keep Maintains Scroll Position', function() {

		var content = `
			<div id="outerContainer">
				<div id="scrollContainer" zx-keep="true" style="height: 100px; overflow-y: scroll;">
					<div style="height: 1000px;">
						<div id="test1">foo</div>
						<div id="test2">foo</div>
					</div>
				</div>
			</div>
		`;

		var originalHolder = document.createElement('div');
		originalHolder.innerHTML = content;

		// @ts-ignore
		var testContainer = document.getElementById('testContainer');

		// @ts-ignore
		testContainer.appendChild(originalHolder);

		// @ts-ignore
		var scrollContainer = testContainer.querySelector('#scrollContainer');

		// Set the scroll of the scrollContainer as if the user scrolled it
		// @ts-ignore
		scrollContainer.scrollTop = 50;

		var newContent = `
			<div id="outerContainer">
				<div id="scrollContainer" zx-keep="true" style="height: 100px; overflow-y: scroll;">
					<div style="height: 1000px;">
						<div id="test1">foo</div>
						<div id="test2">foo</div>
					</div>
				</div>
			</div>
		`;

		var parser = new DOMParser();
		var responseDom = parser.parseFromString(newContent, 'text/html');

		var parser = new DOMParser();
		var linkElement = parser.parseFromString('<a href="/foo" zx-swap="#testId">Foo</a>', 'text/html').body.firstChild;
		var zxTrigger = ZsxJstest._normalizeZxTrigger(
			linkElement
		);

		// @ts-ignore
		ZsxJstest._parseResponseAndSwapSelector(document, responseDom, '#outerContainer', zxTrigger);

		// @ts-ignore
		var testContainer = document.getElementById('testContainer');
		// @ts-ignore
		var scrollContainer = testContainer.querySelector('#scrollContainer');

		expect(scrollContainer.scrollTop).to.equal(50);

	});

	//@ts-ignore
	test('Form test', function() {

		var content = `
			<div id="outerContainer">
				<div id="innerContainer">
					Foo
				</div>
				<form action="/home/echo" method="POST" zx-swap="#innerContainer">
					<input type="hidden" name="goto" value="/ZsxJs/list"/>
					<button type="Submit">Form Swap</button>
				</form>
			</div>
		`;

		var originalHolder = document.createElement('div');
		originalHolder.innerHTML = content;

		// @ts-ignore
		var testContainer = document.getElementById('testContainer');

		// @ts-ignore
		testContainer.appendChild(originalHolder);

		// @ts-ignore
		var formItem = testContainer.querySelector('form');
		var formButton = formItem.querySelector('button');
		// formButton.click();
		// @ts-ignore
		ZsxJstest._decorateZeroSwapForm(testContainer, formItem);

	});

	test('_syncLinkParams', function() {

		var content = `
			<a href="/foo?bar=1" zx-swap="#testId">Foo</a>
			<a href="/foo?bar=2" zx-swap="#testId">Foo</a>
			<a href="/foo?bar=3" zx-swap="#testId">Foo</a>
			<a href="/foo?bar=4" zx-swap="#testId">Foo</a>
		`
		var documentFragment = document.createDocumentFragment();
		var parser = new DOMParser();
		documentFragment.appendChild(parser.parseFromString(content, 'text/html').body);

		var newLink = 'http://127.0.0.1:51404/foo?bar=5';
		var syncParams = ZsxJstest._parseSyncParams("bar");
		// @ts-ignore
		ZsxJstest._syncLinkParams(documentFragment, newLink, syncParams);

		var getLinks = documentFragment.querySelectorAll('a');

		console.log(getLinks);

		// Check that each link bar=5
		// @ts-ignore
		getLinks.forEach(function(link) {
			// @ts-ignore
			expect(link.href).to.equal('http://127.0.0.1:51404/foo?bar=5');
		});
	});

	test('_doSwap - aLink - zx-jump-guard=true', function() {

		var docText = `
			<div id="outerContainer">
			</div>
		`
		var parser = new DOMParser();
		var testDocument = new DocumentFragment();
		testDocument.appendChild(parser.parseFromString(docText, 'text/html').body);
		var oldElement = testDocument.querySelector('#outerContainer');

		var contentText = `
			<div id="outerContainer">foo</div>
			<a id="link" href="/foo" zx-swap="#outerContainer" zx-jump-guard="true">Foo</a>
		`
		var content = new DocumentFragment();
		content.appendChild(parser.parseFromString(contentText, 'text/html').body);
		var newElement = content.querySelector('#outerContainer');
		var linkElement = content.querySelector('#link');

		var zxTrigger = ZsxJstest._normalizeZxTrigger(linkElement);

		// console.log(zxTrigger);

		// zxTrigger = ZsxJstest._normalizeZxTrigger(holder.firstChild);
		ZsxJstest._doSwap(testDocument, oldElement, newElement, '#outerContainer', zxTrigger);

		// @ts-ignore
		expect(testDocument.querySelector('#outerContainer').innerHTML).to.equal('foo');
		//We should have an element called #zeroViewportSpacer on the testDocument
		// @ts-ignore
		expect(testDocument.querySelector('#zeroViewportSpacer')).to.not.be.null;

	});

	test('_doSwap - form - zx-jump-guard=true', function() {

		var docText = `
			<div id="outerContainer">
			</div>
		`
		var parser = new DOMParser();
		var testDocument = new DocumentFragment();
		testDocument.appendChild(parser.parseFromString(docText, 'text/html').body);
		var oldElement = testDocument.querySelector('#outerContainer');

		var contentText = `
			<div id="outerContainer">foo</div>
			<form action="/home/echo" method="POST" zx-swap="#container" zx-jump-guard="true">
				<button id="button" type="Submit">Form Swap</button>
			</form>
		`
		var content = new DocumentFragment();
		content.appendChild(parser.parseFromString(contentText, 'text/html').body);
		var newElement = content.querySelector('#outerContainer');
		var formElement = content.querySelector('form');
		var buttonElement = content.querySelector('#button');

		var zxTrigger = ZsxJstest._normalizeZxTrigger(formElement, buttonElement);

		console.log(zxTrigger);

		// zxTrigger = ZsxJstest._normalizeZxTrigger(holder.firstChild);
		ZsxJstest._doSwap(testDocument, oldElement, newElement, '#outerContainer', zxTrigger);

		// @ts-ignore
		expect(testDocument.querySelector('#outerContainer').innerHTML).to.equal('foo');
		//We should have an element called #zeroViewportSpacer on the testDocument
		// @ts-ignore
		expect(testDocument.querySelector('#zeroViewportSpacer')).to.not.be.null;

	});

	test('_doSwap - button overrides form - zx-jump-guard=true', function() {

		var docText = `
			<div id="outerContainer">
			</div>
		`
		var parser = new DOMParser();
		var testDocument = new DocumentFragment();
		testDocument.appendChild(parser.parseFromString(docText, 'text/html').body);
		var oldElement = testDocument.querySelector('#outerContainer');

		var contentText = `
			<div id="outerContainer">foo</div>
			<form action="/home/echo" method="POST" zx-swap="#container" zx-jump-guard="false">
				<button id="button" type="Submit" zx-jump-guard="true">Form Swap</button>
			</form>
		`
		var content = new DocumentFragment();
		content.appendChild(parser.parseFromString(contentText, 'text/html').body);
		var newElement = content.querySelector('#outerContainer');
		var formElement = content.querySelector('form');
		var buttonElement = content.querySelector('#button');

		var zxTrigger = ZsxJstest._normalizeZxTrigger(formElement, buttonElement);

		console.log(zxTrigger);

		// zxTrigger = ZsxJstest._normalizeZxTrigger(holder.firstChild);
		ZsxJstest._doSwap(testDocument, oldElement, newElement, '#outerContainer', zxTrigger);

		// @ts-ignore
		expect(testDocument.querySelector('#outerContainer').innerHTML).to.equal('foo');
		//We should have an element called #zeroViewportSpacer on the testDocument
		// @ts-ignore
		expect(testDocument.querySelector('#zeroViewportSpacer')).to.not.be.null;
	});

	test('_doSwap - button - zx-jump-guard=true', function() {

		var docText = `
			<div id="outerContainer">
			</div>
		`
		var parser = new DOMParser();
		var testDocument = new DocumentFragment();
		testDocument.appendChild(parser.parseFromString(docText, 'text/html').body);
		var oldElement = testDocument.querySelector('#outerContainer');

		var contentText = `
			<div id="outerContainer">foo</div>
			<form action="/home/echo" method="POST" zx-swap="#container">
				<button id="button" type="Submit" zx-jump-guard="true">Form Swap</button>
			</form>
		`
		var content = new DocumentFragment();
		content.appendChild(parser.parseFromString(contentText, 'text/html').body);
		var newElement = content.querySelector('#outerContainer');
		var formElement = content.querySelector('form');
		var buttonElement = content.querySelector('#button');

		var zxTrigger = ZsxJstest._normalizeZxTrigger(formElement, buttonElement);

		console.log(zxTrigger);

		// zxTrigger = ZsxJstest._normalizeZxTrigger(holder.firstChild);
		ZsxJstest._doSwap(testDocument, oldElement, newElement, '#outerContainer', zxTrigger);

		// @ts-ignore
		expect(testDocument.querySelector('#outerContainer').innerHTML).to.equal('foo');
		//We should have an element called #zeroViewportSpacer on the testDocument
		// @ts-ignore
		expect(testDocument.querySelector('#zeroViewportSpacer')).to.not.be.null;

	});

	test('_normalizeZxTrigger - form - should get the method and url from the form', function() {

		var contentText = `
			<form action="/home/echo" method="POST" zx-swap="#container">
			</form>
		`
		var parser = new DOMParser();
		var content = parser.parseFromString(contentText, 'text/html').body;
		var formElement = content.querySelector('form');
		var buttonElement = content.querySelector('#button');

		var zxTrigger = ZsxJstest._normalizeZxTrigger(formElement);
		expect(zxTrigger.method).to.equal('post');
		expect(zxTrigger.url).to.equal('http://127.0.0.1:51404/home/echo');

	});

	test('_persistForm - should store the form into the cache', function() {

		var contentText = `
			<form id="myForm" action="/home/echo" method="POST" zx-persist="true">
				<input type="text" name="testValue" value="5"/>
			</form>
		`
		var parser = new DOMParser();
		var content = parser.parseFromString(contentText, 'text/html').body;
		var formElement = content.querySelector('form');
		ZsxJstest._persistForm(formElement);

		//Check local storage for the persisted form
		var persistedForm = localStorage.getItem('zsx_persist_form_myForm');
		expect(persistedForm).to.not.be.null;
		persistedForm = JSON.parse(persistedForm);
		expect(persistedForm.testValue).to.equal('5');

	});

	test('_persistForm - should handle inputs outside the form', function() {

		var contentText = `
			<form id="myForm" action="/home/echo" method="POST" zx-persist="true">
				<input type="text" name="testValue1" value="5"/>
			</form>
			<input type="text" name="testValue2" value="10" form="myForm"/>
		`
		var parser = new DOMParser();
		var content = parser.parseFromString(contentText, 'text/html').body;
		var formElement = content.querySelector('form');
		ZsxJstest._persistForm(formElement);

		//Check local storage for the persisted form
		var persistedForm = localStorage.getItem('zsx_persist_form_myForm');
		expect(persistedForm).to.not.be.null;
		persistedForm = JSON.parse(persistedForm);
		expect(persistedForm.testValue1).to.equal('5');
		expect(persistedForm.testValue2).to.equal('10');

	});

	test('_restoreForm - should should restore the values from the cache into the form', function() {

		var contentText = `
			<form id="myForm" action="/home/echo" method="POST" zx-persist="true">
				<input type="text" name="testValue" value="5"/>
			</form>
		`
		var parser = new DOMParser();
		var content = parser.parseFromString(contentText, 'text/html').body;
		var formElement = content.querySelector('form');

		//Setup values into the cache
		var persistData = {
			testValue: '10'
		};
		localStorage.setItem('zsx_persist_form_myForm', JSON.stringify(persistData));

		ZsxJstest._restoreForm(content, formElement);

		//Check that the form value has been updated
		expect(formElement.querySelector('input[name="testValue"]').value).to.equal('10');

	});

	test('_restoreForm - should handle inputs outside the form', function() {

		var contentText = `
			<form id="myForm" action="/home/echo" method="POST" zx-persist="true">
				<input type="text" name="testValue1" value="5"/>
			</form>
			<input type="text" name="testValue2" value="10" form="myForm"/>
		`
		var parser = new DOMParser();
		var content = parser.parseFromString(contentText, 'text/html').body;
		var formElement = content.querySelector('form');

		//Add a change event handler on the input to test if it is called
		var inputElement2 = content.querySelector('input[name="testValue2"]');
		var changeEventCalled = false;
		inputElement2.addEventListener('change', function() {
			changeEventCalled = true;
		});

		//Setup values into the cache
		var persistData = {
			testValue1: '100',
			testValue2: '200'
		};

		localStorage.setItem('zsx_persist_form_myForm', JSON.stringify(persistData));
		ZsxJstest._restoreForm(content, formElement);
		//Check that the form value has been updated
		expect(formElement.querySelector('input[name="testValue1"]').value).to.equal('100');
		expect(content.querySelector('input[name="testValue2"]').value).to.equal('200');

		//Check that the change event was called
		expect(changeEventCalled).to.be.true;

	});

	test('_clearPersistForm - should clear this form out of the form cache', function() {

		var contentText = `
			<form id="myForm" action="/home/echo" method="POST" zx-persist="true">
				<input type="text" name="testValue" value="5"/>
			</form>
		`
		var parser = new DOMParser();
		var content = parser.parseFromString(contentText, 'text/html').body;
		var formElement = content.querySelector('form');

		//Setup values into the cache
		var persistData = {
			testValue: '10'
		};
		localStorage.setItem('zsx_persist_form_myForm', JSON.stringify(persistData));

		ZsxJstest._clearPersistForm(formElement);

		//Check local storage for the persisted form
		var persistedForm = localStorage.getItem('zsx_persist_form_myForm');
		expect(persistedForm).to.be.null;

	});

	test('_decoratePersistForm - should assign the event handlers', function() {

		var contentText = `
			<form id="myForm" action="/home/echo" method="POST" zx-persist="true">
				<input type="text" name="testValue" value="5"/>
			</form>
		`
		var parser = new DOMParser();
		var content = parser.parseFromString(contentText, 'text/html').body;
		var formElement = content.querySelector('form');
		var inputElement = formElement.querySelector('input[name="testValue"]');

		ZsxJstest._decoratePersistForm(content, formElement);

		inputElement.value = '42';
  		inputElement.dispatchEvent(new Event('change', { bubbles: true }));

		//Check local storage for the persisted form
		var persistedForm = localStorage.getItem('zsx_persist_form_myForm');
		expect(persistedForm).to.not.be.null;
		persistedForm = JSON.parse(persistedForm);
		expect(persistedForm.testValue).to.equal('42');

	});

	test('_decorateCookieSet - should assign the event handlers', function() {

		var contentText = `<a href="" zx-cookie-set='{"testCookie":"foo"}'>Set Cookie</a>`

		var parser = new DOMParser();
		var content = parser.parseFromString(contentText, 'text/html').body;

		let storedCookie = '';
		const fakeDoc = {
			get cookie() { return storedCookie; },
			set cookie(value) { storedCookie = value; }
		};

		var linkElement = content.querySelector('a');
		ZsxJstest._decorateCookieSet(fakeDoc, linkElement);
		//Simulate a click event
  		linkElement.dispatchEvent(new Event('click', { bubbles: true }));
		//Check that the cookie is set

		var cookieValue = fakeDoc.cookie.split('; ').find(row => row.startsWith('testCookie=')).split('=')[1];
		expect(cookieValue).to.equal('foo');

	});

	test('_setupCookieSetLinks - should find and setup all persisted links in the document', function() {

		var contentText = `
			<a id="link1" href="" zx-cookie-set='{"testCookie1":"value1"}'>Set Cookie 1</a>
			<a id="link2" href="" zx-cookie-set='{"testCookie2":"value2"}'>Set Cookie 2</a>
		`

		var parser = new DOMParser();
		var content = parser.parseFromString(contentText, 'text/html').body;
		let storedCookie = '';
		const fakeDoc = {
			get cookie() { return storedCookie; },
			set cookie(value) { storedCookie = value; }
		};

		//Mock querySelectorAll on fakeDoc
		fakeDoc.querySelectorAll = function(selector) {
			return content.querySelectorAll(selector);
		};

		ZsxJstest._setupCookieSetLinks(fakeDoc, content);

		//Simulate click on first link
		var linkElement1 = content.querySelector('#link1');
		linkElement1.dispatchEvent(new Event('click', { bubbles: true }));

		var cookieValue1 = fakeDoc.cookie.split('; ').find(row => row.startsWith('testCookie1=')).split('=')[1];
		expect(cookieValue1).to.equal('value1');

		//Simulate click on second link
		var linkElement2 = content.querySelector('#link2');
		linkElement2.dispatchEvent(new Event('click', { bubbles: true }));
		var cookieValue2 = fakeDoc.cookie.split('; ').find(row => row.startsWith('testCookie2=')).split('=')[1];
		expect(cookieValue2).to.equal('value2');

	});

	test('_setupPersistedForms - should find and setup all persisted forms in the document', function() {

		var contentText = `
			<form id="myForm1" action="/home/echo" method="POST" zx-persist="true">
				<input type="text" name="testValue1" value="5"/>
			</form>
			<form id="myForm2" action="/home/echo" method="POST" zx-persist="true">
				<input type="text" name="testValue2" value="10"/>
			</form>
		`
		var parser = new DOMParser();
		var content = parser.parseFromString(contentText, 'text/html').body;

		ZsxJstest._setupPersistedForms(content);

		//Modify first form
		var formElement1 = content.querySelector('#myForm1');
		var inputElement1 = formElement1.querySelector('input[name="testValue1"]');
		inputElement1.value = '42';
  		inputElement1.dispatchEvent(new Event('change', { bubbles: true }));

		//Modify second form
		var formElement2 = content.querySelector('#myForm2');
		var inputElement2 = formElement2.querySelector('input[name="testValue2"]');
		inputElement2.value = '84';
  		inputElement2.dispatchEvent(new Event('change', { bubbles: true }));

		//Check local storage for the persisted forms
		var persistedForm1 = localStorage.getItem('zsx_persist_form_myForm1');
		expect(persistedForm1).to.not.be.null;
		persistedForm1 = JSON.parse(persistedForm1);
		expect(persistedForm1.testValue1).to.equal('42');

		var persistedForm2 = localStorage.getItem('zsx_persist_form_myForm2');
		expect(persistedForm2).to.not.be.null;
		persistedForm2 = JSON.parse(persistedForm2);
		expect(persistedForm2.testValue2).to.equal('84');

	})

	test('_restorePersistedForms - should find and restore all persisted forms in the document', function() {
		var contentText = `
			<form id="myForm1" action="/home/echo" method="POST" zx-persist="true">
				<input type="text" name="testValue1" value="5"/>
			</form>
			<form id="myForm2" action="/home/echo" method="POST" zx-persist="true">
				<input type="text" name="testValue2" value="10"/>
			</form>
		`
		var parser = new DOMParser();
		var content = parser.parseFromString(contentText, 'text/html').body;

		//Setup values into the cache
		var persistData1 = {
			testValue1: '42'
		};
		localStorage.setItem('zsx_persist_form_myForm1', JSON.stringify(persistData1));

		var persistData2 = {
			testValue2: '84'
		};
		localStorage.setItem('zsx_persist_form_myForm2', JSON.stringify(persistData2));

		ZsxJstest._restorePersistedForms(content);

		//Check that the form values have been updated
		var formElement1 = content.querySelector('#myForm1');
		expect(formElement1.querySelector('input[name="testValue1"]').value).to.equal('42');

		var formElement2 = content.querySelector('#myForm2');
		expect(formElement2.querySelector('input[name="testValue2"]').value).to.equal('84');
	});

	test('persisted form on submit event clears the persisted local storage', function() {

		var contentText = `
			<form id="myForm" action="/home/echo" method="POST" zx-persist="true">
				<input type="text" name="testValue" value="5"/>
			</form>
		`
		var parser = new DOMParser();
		var content = parser.parseFromString(contentText, 'text/html').body;
		var formElement = content.querySelector('form');

		//Setup values into the cache
		var persistData = {
			testValue: '10'
		};
		localStorage.setItem('zsx_persist_form_myForm', JSON.stringify(persistData));

		//Decorate the form for persistence
		ZsxJstest._decoratePersistForm(content, formElement);

		//Simulate a form submit event
  		formElement.dispatchEvent(new Event('submit', { bubbles: true }));

		//Check local storage for the persisted form
		var persistedForm = localStorage.getItem('zsx_persist_form_myForm');
		expect(persistedForm).to.be.null;

	});

	test('persisted form with inputs outside of the form', function() {
		var contentText = `
			<form id="myForm" action="/home/echo" method="POST" zx-persist="true">
				<input type="text" name="testValue1" value="5"/>
			</form>
			<input type="text" name="testValue2" value="10" form="myForm"/>
		`
		var parser = new DOMParser();
		var content = parser.parseFromString(contentText, 'text/html').body;
		var formElement = content.querySelector('form');
		var inputElement2 = content.querySelector('input[name="testValue2"]');

		ZsxJstest._decoratePersistForm(content, formElement);

		//Modify second input
		inputElement2.value = '42';
  		inputElement2.dispatchEvent(new Event('change', { bubbles: true }));

		//Check local storage for the persisted form
		var persistedForm = localStorage.getItem('zsx_persist_form_myForm');
		expect(persistedForm).to.not.be.null;
		persistedForm = JSON.parse(persistedForm);
		expect(persistedForm.testValue2).to.equal('42');

		//Now test restoring the form
		//Setup values into the cache
		var persistData = {
			testValue1: '100',
			testValue2: '200'
		};

		localStorage.setItem('zsx_persist_form_myForm', JSON.stringify(persistData));
		ZsxJstest._restoreForm(content, formElement);
		//Check that the form value has been updated
		expect(formElement.querySelector('input[name="testValue1"]').value).to.equal('100');
		expect(content.querySelector('input[name="testValue2"]').value).to.equal('200');

	});

	test('_setCookieValue', function() {

		let storedCookie = '';

		const fakeDoc = {
			get cookie() { return storedCookie; },
			set cookie(value) { storedCookie = value; }
		};

		//Set a cookie using _setCookieValue
		ZsxJstest._setCookieValue(fakeDoc, 'zsx_test_cookie', 'test_value');

		//Check that the cookie is set

		var cookieValue = fakeDoc.cookie.split('; ').find(row => row.startsWith('zsx_test_cookie=')).split('=')[1];
		expect(cookieValue).to.equal('test_value');

	});

	test('_setCookieValue_nullValueDeletesTheCookie', function() {

		let storedCookie = '';

		const fakeDoc = {
			get cookie() { return storedCookie; },
			set cookie(value) { storedCookie = value; }
		};

		//First set the cookie to a value
		ZsxJstest._setCookieValue(fakeDoc, 'zsx_test_cookie', 'test_value');

		//Set a cookie using _setCookieValue
		ZsxJstest._setCookieValue(fakeDoc, 'zsx_test_cookie', null);

		//Check that the cookie is set

		console.log(fakeDoc.cookie);

		var cookieValue = fakeDoc.cookie.split('; ').find(row => row.startsWith('zsx_test_cookie=')).split('=')[1];
		var cookieAge = fakeDoc.cookie.split('; ').find(row => row.startsWith('Max-Age='));

		//Check that the maxAge is set to 0
		expect(cookieValue).to.equal('');
		expect(cookieAge).to.equal('Max-Age=0');

	});

	test('_setCookieValue_emptyValueDeletesTheCookie', function() {

		let storedCookie = '';

		const fakeDoc = {
			get cookie() { return storedCookie; },
			set cookie(value) { storedCookie = value; }
		};

		//First set the cookie to a value
		ZsxJstest._setCookieValue(fakeDoc, 'zsx_test_cookie', 'test_value');

		//Set a cookie using _setCookieValue
		ZsxJstest._setCookieValue(fakeDoc, 'zsx_test_cookie', '');

		//Check that the cookie is set

		console.log(fakeDoc.cookie);

		var cookieValue = fakeDoc.cookie.split('; ').find(row => row.startsWith('zsx_test_cookie=')).split('=')[1];
		var cookieAge = fakeDoc.cookie.split('; ').find(row => row.startsWith('Max-Age='));

		//Check that the maxAge is set to 0
		expect(cookieValue).to.equal('');
		expect(cookieAge).to.equal('Max-Age=0');

	});

	test('_setCookieValue_withPrefix', function() {
		//Set a cookie using _setCookieValue
		let storedCookie = '';
		const fakeDoc = {
			get cookie() { return storedCookie; },
			set cookie(value) { storedCookie = value; }
		};

		ZsxJstest._setCookieValue(fakeDoc, 'zsx_test_cookie', 'test_value', 'prefix.');
		//Check that the cookie is set
		var cookieValue = fakeDoc.cookie.split('; ').find(row => row.startsWith('prefix.zsx_test_cookie=')).split('=')[1];
	});

	test('_getCookieValue', function() {

		let storedCookie = 'zsx_test_cookie=test_value; other_cookie=other_value';

		const fakeDoc = {
			get cookie() { return storedCookie; },
			set cookie(value) { storedCookie = value; }
		};

		//Get a cookie using _getCookieValue
		var cookieValue = ZsxJstest._getCookieValue(fakeDoc, 'zsx_test_cookie');
		expect(cookieValue).to.equal('test_value');

	});

	test('_getCookieValue_withPrefix', function() {

		let storedCookie = 'prefix.zsx_test_cookie=test_value; other_cookie=other_value';

		const fakeDoc = {
			get cookie() { return storedCookie; },
			set cookie(value) { storedCookie = value; }
		};

		//Get a cookie using _getCookieValue
		var cookieValue = ZsxJstest._getCookieValue(fakeDoc, 'zsx_test_cookie', 'prefix.');
		expect(cookieValue).to.equal('test_value');

	});
});
