// @ts-nocheck
// @ts-ignore
var expect = chai.expect;
// @ts-ignore
suite('ZsxJs', function() {

	var ZsxJstest = new _ZsxJs.ZsxJs();

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

		ZsxJstest._parseResponseAndSwapSelectors(document, content, '#testId');
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

		// console.log('foo' + document.getElementById('testContainer').innerHTML);

		// @ts-ignore
		ZsxJstest._parseResponseAndSwapSelectors(document, newContent, '.replaceMe1');

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

		// console.log('foo' + document.getElementById('testContainer').innerHTML);

		// @ts-ignore
		ZsxJstest._parseResponseAndSwapSelectors(document, newContent, '#test1,#test2');

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

		// console.log('foo' + document.getElementById('testContainer').innerHTML);

		// @ts-ignore
		ZsxJstest._parseResponseAndSwapSelectors(document, newContent, '#subContainer');

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

		// @ts-ignore
		ZsxJstest._parseResponseAndSwapSelector(document, newContent, '#outerContainer');

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

});
