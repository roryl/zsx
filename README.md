# ZSX.js

Build a ***Zero Script Experience***

ZSX.js is a progressive enhancement library for server-rendered applications in any backend language. It improves user experiences with zero developer-added Javascript. ZSX.js uses only semantic HTML, CSS, URLs, links, forms, and buttons.

```html
<!-- Swap out the element from the response of a link click into the page -->
<a href="/page" zx-swap="body">Click Me</a>
```

ZSX.js compares to frameworks like [HTMX](https://htmx.org/), [Unpoly](https://unpoly.com/), [Twinspark](https://twinspark.js.org/), [Turbo](https://turbo.hotwired.dev/) and [Fixi.js](https://github.com/bigskysoftware/fixi) but has an opinionated minimalist featureset.




## Table of Contents

- [Quick Start](#quick-start)
- [Features](#features)
- [HTML API](#html-api)
- [Events](#events)
- [ZSX.js Design Goals](#zsxjs-design-goals)
- [Developing Applications](#developing-applications)
- [Cookbook](#cookbook)

# Quick Start

Include the zero.js script. It can be in the head or end of the body

```html
<head>
	<!-- Style sheet for ZSX loading indicator styles -->
	<link rel="stylesheet" href="dist/zsx.css">
	<script src="dist/zsx.js"></script>
</head>
```

```html
<body>
	<!-- ... Content ... -->
	<script src="dist/zsx.js"></script>
</body>
```

↑ [top](#zsxjs)

## Basic Example

```html
<!--- SERVER SIDE RENDERED HANDLEBARS TEMPLATE --->
<html lang="en">
<head>
	<meta charset="UTF-8">
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
	<link rel="stylesheet" href="dist/zsx.css">
	<script src="dist/zsx.js"></script>
	<title>ZSX.js - QuickStart</title>
</head>
<body>
	<h1>ZSX.js QuickStart</h1>

	<a href="?hello=true" zx-swap="#targetContent">Hello</a>
	<a href="?hello=false" zx-swap="#targetContent">Good Bye</a>

	<div id="targetContent" style="width: 300px; height:100px;">
		{{#if url.hello}}
			Hello World
		{{else}}
			Goodbye World
		{{/if}}
	</div>
</body>
</html>
```

↑ [top](#zsxjs)

# Features

ZSX.js upgrades links, forms and buttons to make applications more responsive and solve common UX patterns.

**Page Content Updates**:
 - [Swap Client Side Content without Refresh](#swap-client-side-content-without-refresh) — [`zx-swap`](#zx-swap)
 - [Preserve Client-Side State During Swaps](#preserve-client-side-state-during-swaps) — [`zx-keep`](#zx-keep)

**Enhance Page Reactivity**:
 - [Automatic Page Jump Supression](#automatic-page-jump-supression)
 - [Visual Loading Indicators](#visual-loading-indicators) — [`zx-loader`](#zx-loader)
 - [Scroll Elements Into View](#scroll-elements-into-view) — [`zx-scroll-to`](#zx-scroll-to)
 - [Action Confirmation Dialogs](#action-confirmation-dialogs) — [`zx-dialog-confim`](#zx-dialog-confirm)
 - [App-Style Links](#app-style-links) — [`zx-link-mode`](#zx-link-mode)

**Navigation and State Management**:
 - [Synchronize URL Parameters Across Links](#synchronize-url-parameters-across-links) — [`zx-sync-params`](#zx-sync-params)
 - [Automatic History Management](#automatic-history-management)



↑ [top](#zsxjs) | *next:* [features](#features)

## Swap Client Side Content without Refresh

Dynamically update parts of your page by swapping elements based on their ID, class, or tag in response to link clicks or form submissions.

This technique allows you to update portions of your content without a full page reload, enhancing performance and user experience.

See [`zx-swap`](#zx-swap-string-list)

↑ [top](#zsxjs) | [features](#features) → *next:* [HTML API](#html-api)

## Preserve Client-Side State During Swaps

When swapping content, preserve dynamic client side media, canvas or content that should not be changed. You can mark which content needs to be maintained and it will be restored across swaps

See [`zx-keep`](#zx-keep-true--false)

↑ [top](#zsxjs) | [features](#features) → *next:* [HTML API](#html-api)

## Automatic Page Jump Supression

ZSX.js will minimize these disruptive page jumps from removed content.

Typically in an application, when elements are removed from the DOM, the page may abruptly jump upward if the combined height of the remaining content and the viewport is less than the current scroll position.

ZSX.js actively monitors the content height of elements that are being swapped out and dynamically inserts just enough space at the end of the document.

***This feature is automatic and does not require any zx-attributes***

↑ [top](#zsxjs) | [features](#features) → *next:* [HTML API](#html-api)

##  Visual Loading Indicators

Easily add loading indicators to all of your links and forms to improve responsiveness

Links

![Link with loading dots](docs/img/link_with_loader.png)

Buttons

![Button Loading](docs/img/button_with_loader.png)

See [`zx-loader`](#zx-loader)

↑ [top](#zsxjs) | [features](#features) → *next:* [HTML API](#html-api)

##  Scroll Elements Into View

Automatically scroll newly swapped elements into the viewport. Define custom scroll targets to ensure important content is brought into focus.

See [`zx-scroll-to`](#zx-scroll-to)

↑ [top](#zsxjs) | [features](#features) → *next:* [HTML API](#html-api)

## Synchronize URL Parameters Across Links

As a result of clicking links, you can synchronize all links on the page to match particular URL variables of the clicked link. This allows you to swap small portions of the page, but ensure all other links on the page match the correct parameters.

See [`zx-sync-params`](#zx-sync-params-string-list)

↑ [top](#zsxjs) | [features](#features) → *next:* [HTML API](#html-api)

## Automatic History Management

All links and form GET redirects update the browser history and allow the user to navigate back to previous URLs.

***This feature is automatic and does not require any zx-attributes***

↑ [top](#zsxjs) | [features](#features) → *next:* [HTML API](#html-api)

## Action Confirmation Dialogs

As a result of clicking links or buttons, ZSX.js can present a confirmation dialog before proceeding with the action. This allows you to quickly add a simple confirmation for risky actions. Anything that is destructive and cannot be undone should be confirmed.

See [`zx-dialog-confirm`](#zx-dialog-confirm)

↑ [top](#zsxjs) | [features](#features) → *next:* [HTML API](#html-api)

## App-Style Links

Convert traditional `<a>` tags into app-like buttons or interactive controls, blending seamlessly into your application's interface. App Links prevent the display of URL tooltips and the standard context menu, providing a cleaner, more cohesive user experience for full screen apps.

See [`zx-link-mode`](#a-zx-link-mode-browser--app)

<br/>

↑ [top](#zsxjs) | [features](#features) → *next:* [HTML API](#html-api)

# HTML API

ZSX.js works by adding attributes to your existing HTML markup.

| attribute | Description | Tags | Values |
| --- | --- | --- | --- |
| [zx-swap](#zx-swap) | Swaps target selector content from the response of a link click or form post | a, form | #idSelector<br> .classSelector<br>tag-selector |
| [zx-sync-params](#zx-sync-params) | Syncronizes URL parameters across links | a | ParamName |
| [zx-keep](#zx-keep) | Keeps specified content in the DOM after a parent element is swapped  | any HTML Element | true \| false |
| [zx-link-mode](#zx-link-mode) | Whether to render the link as a browser (default) link or an application clickable element | a | browser (default) \| app |
| [zx-dialog-confirm](#zx-dialog-confirm) | Confirmation question before proceeding wtih the click | a, form | any string |
| [zx-scroll-to](#zx-scroll-to) | Where to sroll to after the content swap | a, form, button | true \| false <br> #idSelector <br> #.classSelector <br> other CSS selector |
| [zx-loader](#zx-loader) | Specify that the link or button should have a loading indicator | a, button | true \| false

## zx-swap

Swap out content in the current page with content from the response HTML. Specify the CSS selectors to target.

Used on tags: `<a>`, `<form>`

**Valid Values:**

- id: `zx-swap="#idSelector"`
- class: `zx-swap=".aClassSelector"`
- tag: `zx-swap="tag-selector"`
- Multiple selectors: `zx-swap="#idSelector,.aClassSelector,tag-selector`"

### Usage
`zx-swap` is the primary feature of ZSX.js. As a result of every link or form action, you describe which element(s) should be replaced from the response content.

#### Swap #id Target

Swap a single element by target id

```html
<a href="?hello=true" zx-swap="#targetContent">Hello</a>
```

#### Swap .class Target

Swap all elements matching the target class

```html
<a href="?hello=true" zx-swap=".targetContent">Hello</a>
```

<aside>
<img src="https://www.notion.so/icons/error_green.svg" alt="https://www.notion.so/icons/error_green.svg" width="40px" />

When a class target is defined, each element needs a unique id in order to disambiguate the elements

</aside>

#### Swap Tag Target

Swaps the elements matching the given tag

```html
<a href="?hello=true" zx-swap="body">Hello</a>
```

<aside>
<img src="https://www.notion.so/icons/error_green.svg" alt="https://www.notion.so/icons/error_green.svg" width="40px" />

When a tag target is defined, if there are more than one result, each tag will need its own Id

</aside>

#### Swap Multiple Targets

Swap multiple targets by providing a comma separated list

```html
<a href="?hello=true" zx-swap="#targetContent,#target2,.classTarget">Hello</a>
```


#### &lt;form&gt; zx-swap

Swap out the element from the form post content

```html
<form action="/" method="POST" zx-swap="#anchorTargetContainer">
	<button type="Submit">Form Swap</button>
</form>
```

#### Form Redirects

Forms can either be a GET request or a POST. Typically when a POST, the server should redirect back to a GET (POST-REDIRECT-GET style) so that the browser does not perform duplicate submits.

ZSX.js will update the URL history to the value of any GET redirect. POST redirects are not added to the history.

↑ [top](#zsxjs) | [features](#features) | [HTML Api](#html-api) → *next:* [Events](#events)

## zx-sync-params
***string list***

Synchronizes parameters from the &lt;a href&gt; with other links on the page.

Used on tags: `<a>`

**Valid Values:**

- Single param: `zx-sync-params="foo"`
- Multiple params: `zx-sync-params="foo,bar"`

### Usage

You use zx-sync-params when you need to keep URL state synchronized across all links on the page even when only a small subset of content is updated.

This is necessary when URL contains important state that should persist across subsequent clicks, but the content from the zx-swap does not touch all of the links on the page.

The logic performed is as follows:

- **WHEN** a link with zx-sync-params is clicked
- **FOR** each other link on the page
- **FOR** each of the parameters in zx-sync-param
- **IF** that parameter is in the other link's `href`
- **THEN** pdate the parameter to the value of the parameter in the clicked link.
- **UNLESS** the other link itself contains a zx-sync-param with the same parameter name


`zx-sync-params` can take a single parameter or multiple parameters.

#### Single Parameter

```html
<a href="?hello=true" zx-swap="#targetContent" zx-sync-params="hello" >Hello</a>
<a href="?hello=false" zx-swap="#targetContent" zx-sync-params="hello" >Goodbye</a>
<a href="?hello=false" zx-swap="#targetContent" >Other Link</a>
```

#### Multiple Parameters

```html
<a href="?hello=true&foo=bar" zx-swap="#targetContent" zx-sync-params="hello,foo" >Hello</a>
```

↑ [top](#zsxjs) | [features](#features) | [HTML Api](#html-api) → *next:* [Events](#events)

## zx-keep
***true | false***

Keeps an an element and its descendants unchanged when a parent is swapped out. Useful for maintaining page level content like video, audio forms or other interactive content that should not be swapped.

Used on tags: any html element

**Values Values:**

- true: Keep the element when swapping out the parent
- false: Do not keep the element when swapping out the parent


### Usage

```html
<a href="/" zx-swap="#container">Update</a>
<div id="container">
	Updated Content
	<div id="someContent" zx-keep="true">
		Kept Conent
	</div>
</div>
```

<aside>
<img src="https://www.notion.so/icons/error_green.svg" alt="https://www.notion.so/icons/error_green.svg" width="40px" />

Element with zx-keep requires that an Id be set

</aside>

↑ [top](#zsxjs) | [features](#features) | [HTML Api](#html-api) → *next:* [Events](#events)

## zx-link-mode
***browser | app***

Specifies whether a link should behave like a regular browser link, or adopt a more application-like interaction.

**Used on Tags:** `<a>`

**Valid Values:**

- `"browser"`: (default) Maintains standard browser link behavior, including displaying URL tooltips and offering content menus. This is the default.
- `"app"`: Suppresses the URL tooltip and modifies the link's behavior to mimic a form button or application-like interaction.

### Example Usage:

```html
<a href="<https://example.com/page>" zx-link-mode="browser">Standard Link</a>
<a href="<https://example.com/action>" zx-link-mode="app">App-like Link</a>
```

### Use Cases

Browsers provide some default features for links, like tooltips, right click menu, and clicked and unclicked states. For some application where we want a desktop like app experience, disabling these default browser behaviors is desired.

When zx-link-mode=”app” when the link is just clickable text. You handle all additional styling for the link.

↑ [top](#zsxjs) | [features](#features) | [HTML Api](#html-api) → *next:* [Events](#events)

## zx-dialog-confirm
***string***

Generates a confirmation dialog modal to confirm the action before proceeding with the link or button click.

**Used on Tags**: `<a>`, `<button>`

**Valid Values:** Any text string

There are additional attributes you can add to control the content:

- **zx-dialog-confirm-title**: Sets a title for the dialog
- **zx-dialog-confirm-yes**: The text of the ok button
- **zx-dialog-confirm-no**: The text of the cancel button

### Usage:
You should ask user for confirmation of actions that are sensitive and cannot be easily undone, or that has side effects. For example, deleting a record which cannot be recovered.

```html
<button zx-dialog-confirm="Continue?">Hello</button>
<a href="?hello=true" zx-dialog-confirm="Continue?">Hello</a>
```

↑ [top](#zsxjs) | [features](#features) | [HTML Api](#html-api) → *next:* [Events](#events)

## zx-scroll-to
***true | false | top | if-needed | CSS selector***

Tells ZSX.js to scroll to a particular element after completing a zx-swap. This can improve the user experience when the swapped elements may be out of view or we want to focus the new elements.

**Used on Tags:** `<a>`, `<button>`

**Valid Values:**

- **`true | false`**: When true, scroll to the first zx-swap selector element. When false, this disables zx-scroll-to
- **`#idSelector`**: Scroll to the provided Id, regardless of the zx-swap selectors
- `.classSelector` : Any valid CSS selector. The first item returned will be the target of the scroll
- `"top"` : Scroll to the top of the page
- `"if-needed"` : Scroll to the element if it is out of view otherwise do not scroll

### Usage

Browsers by default include scrolling to a URL hash fragement identifier. You can use zx-scroll-to for more complex scrolling scenarios like classes, 'top' of page, or 'if-needed'

**Default Browser hash(#) identifier**
When zx-swap is applied, if there is an id hash in the URL, it will scroll to that ID. This is the default semantic way to scroll to.

```html
<a href="/page#elementId" zx-swap="#elementId" >Link</a>
```

**Scrolling to the Swap Target**

When `zx-scroll-to="true"` it will scroll to the location of the `zx-swap`

```html
<a href="?hello=true" zx-swap="#targetContainer" zx-scroll-to="true">Hello</a>
```

#### Scrolling to the newest created element

Sometimes as a result of adding a new item to the page, we will want to scroll to that item, except we do not know a unique ID for it because it does not exist yet. You can use a complex class selector to scroll to the last (or first) item.

```html
<button type="submit" zx-scroll-to=":nth-last-child(1 of .classList)">
```

#### Disable Page Change Scrolling

By default, ZSX.js handles links to different pages (base paths) by scrolling to the top of the page. This matches default browser behavior and user expectations when switching pages.

You can disable this by setting zx-scoll-to="false" on your links that you want to maintain the current scroll position between pages.

```html
<a href="/page1" zx-swap="#targetContainer" zx-scroll-to="false">Hello</a>
<a href="/page2" zx-swap="#targetContainer" zx-scroll-to="false">Hello</a>
```

The reason for this behavior is that typically, in a multi-page appication, each page route is significantly different content. The usual experience is to start that page at the top of the content.

#### Smooth Scrolling

ZSX.js follows the browser/application level scroll setting. You can enable smooth scrolling by setting the `scroll-behavior` at the page level

```html
<html lang="en" style="scroll-behavior: smooth;">
```

#### Scroll Margin

Sometimes you want the scroll location to be just above the target element. You define this in CSS on the element that will be scrolled to

```html
<div id="myElement" style="scroll-margin-top: 20px;"></div>
```

↑ [top](#zsxjs) | [features](#features) | [HTML Api](#html-api) → *next:* [Events](#events)

## zx-loader
***true | false***

Adds a visual progress indicator to buttons and links for requests that take time to complete.

**Used on Tags:** `a`, `button`

**Valid Values:**
- **true**: Add a loading indicator when clicked
- **false**: Do not add a loading indicator

### Examples
#### `<a>` link dots loader

Adds an animating '...' to the end of the link text

![Link with loading dots](docs/img/link_with_loader.png)

```html
<a href="/path" zx-swap="#target" zx-loader="true">Link with Loader</a>
```

The default loader for buttons will be a full height simulated progress indicator

![Button Loading](docs/img/button_with_loader.png)

```html
<button type="submit" zx-loader="true">
	Loading Indicator
</button>
```

↑ [top](#zsxjs) | [features](#features) | [HTML Api](#html-api) → *next:* [Events](#events)

# Events
ZSX.js fires the following events

| Event | Description |
| --- | --- |
| zsx.zx-swap.after | After a content zx-swap for one selector has been completed.

## zsx.zx-swap.after
Fired after the swap for a selector is completed. If the zx-swap contained multiple selectors, a `zsx.zx-swap.after` event is emmited for each selector.

**Details**

* `oldElement` The old element that was swapped out. No longer exists in the DOM
* `newElement` Live DOM reference to the new element that was swapped in
* `selector` The selector that was used to locate the elements

### Usage
Use the `zsx.zx-swap.after` to process the content after ZSX.js is finished replacing it. You might use this to re-attach event listeners and state from other libraries or purposes that are lost after the swap.

See [Restoring Events and Features After Swap](#restoring-events-and-features-after-swap)


↑ [top](#zsxjs) | [features](#features) | [HTML Api](#html-api) | [Events](#events)


# ZSX.js Design Goals

ZSX.js is designed to enhance server rendered applications. It only uses semantic HTML and follows browser semantics. It improves the user experience of server rendered applications without breaking user’s expectations of browser behavior.

It has opinionated choices:

- [Use Minimal Javascript](#use-minimal-javascript)
- [Assume Full Page Rendering](#assume-full-page-rendering)
- [Explicit Link and Form Handling](#explicit-link-and-form-handling)
- [Must Be Able to Hard Refresh](#must-be-able-to-hard-refresh)

Use Cases, Development & Alternatives
 - [When to Use ZSX.js](#when-to-use-zsxjs)
 - [Future Development](#future-development)
 - [Altenratives](#alternatives)

## Use Minimal JavaScript

ZSX.js takes an opinionated approach to JavaScript. While some JS is necessary, I think JS heavy applications are not good UX.

I believe the best UX is based on fundamental HTML/CSS/HTTP and links and forms. I also believe that “JS first frontends” cause developers to create overly complex applications that are hard to maintain.

In a ZSX.js application, you should be able to look at the rendered HTML and understand exactly the interaction with the backend just by following the links and forms.

↑ [top](#zsxjs) | [features](#features) | [HTML Api](#html-api) | [ZSX.js Design Goals](#zsxjs-design-goals)

## Assume Full Page Rendering

In a ZSX.js application the server by default always fully renders full pages. ZSX.js provides features to hot swap elements on the page and avoid a full browser page reload.

Event though the server renders the full page, avoiding a full page reload improves performance of the browser. Browser performance is improved because it doesn't need to reflow the entire document. This performance improvement is perceived by the user as more responsive.

Full server renders might seem wasteful, but it greatly improves the maintainability of applications:

- Most pages in an application are fast enough that it doesn't matter
- Forces developers to think through the first page load experience up front. Dissuades client side hydration, which is not really a user experience improvement
- "Premature optimization is the root of all evil" - You don't need to spend time optimizing the performance of pages that are seldom used.

↑ [top](#zsxjs) | [features](#features) | [HTML Api](#html-api) | [ZSX.js Design Goals](#zsxjs-design-goals)

## Explicit Link and Form Handling

As compared to some other libraries (Turbo), ZSX.js does not automatically decorate all links or forms for swapping body content. There are two reasons:

- The application will be most responsive when you swap the smallest amount of content necessary
- You should be able to inspect the HTML and understand what the link behavior is

Therefore when using ZSX.js, you explicitly decide for every link which content needs to be updated and which zx-* features to apply.


↑ [top](#zsxjs) | [features](#features) | [HTML Api](#html-api) | [ZSX.js Design Goals](#zsxjs-design-goals)

## Must Be Able to Hard Refresh

A litmus test for web applications with proper UX is “can you hard refresh.” Many applications exhibit poor user experience on hard refresh:

- It takes a long time for the page to load in all of the content
- There may be a lot of flashing and layout thrashing as elements are loaded in
- States that were clicked through to are lost, and the user is back at some “root” page flow

This leads to many lost features native to browsers:

- Cannot share links
- Cannot bookmark links
- Cannot open a link in a new tab
- Cannot duplicate a tab
- Cannot refresh to see style changes when developing

↑ [top](#zsxjs) | [features](#features) | [HTML Api](#html-api) | [ZSX.js Design Goals](#zsxjs-design-goals)

## When to Use ZSX.js

If your application fundamentally works with JavaScript turned off, then ZSX.js is a good candidate to enhance your application.

If your application is fully SPA, then ZSX.js is not a good fit.

ZSX.js is a small library and will work well with any other JS libraries.

↑ [top](#zsxjs) | [features](#features) | [HTML Api](#html-api) | [ZSX.js Design Goals](#zsxjs-design-goals)

## Future Development
ZSX.js will only add enhancement features that we find solve common tasks, without breaking fundemental browser architecture. HTML is continually evolving with new features that make browser apps more responsive and user friendly. We are betting on HTML/CSS/HTTP and Server Side Rendering as the engine of applications.

## Alternatives

ZSX.js is similar to HTMX and Unpoly.js in its fundamental philosophy of server rendered applications. However it differs from them in important ways:

### HTMX

HTMX seeks to add new non-standard “hypermedia” features to HTML. Essentially, it allows turning any element into a link, button, GET/POST/PATCH. This is not semantic and means that applications built in HTMX cannot work with JavaScript turned off.

### Unpoly.js

Unpoly.js is probably the closest philosophically to ZSX.js. However I consider it’s feature set needlessly complex. I believe there are only a few necessary conventions that we need. Unpoly drifts away from semantic HTML with layers and other non-browser features. In comparison, ZSX.js only enhances fundamental browser behavior.

Unpoly also has a lot of configurations for targeting different elements, parents, children, appending, prepending and automatically choosing ambiguous cases. I consider this needless complexity.

Instead, with ZSX.js, you control your HTML, the IDs, and classes you wish to target. This makes it easier to maintain your HTML and understand your content updates. You can always look at the source HTML and know exactly what will happen.

### Turbo / Hotwire

Turbo is also another strategy to “dramatically reduce the amount of custom JavaScript” but it has different goals. It provides features like ‘Frames’ and ‘Streams’ to add additional architectural options for building web applications that are beyond what I believe are necessary.

↑ [top](#zsxjs) | [features](#features) | [HTML Api](#html-api) | [ZSX.js Design Goals](#zsxjs-design-goals)

# Developing Applications

Architectural tips and tricks for building maintainable and interactive web applications with ZSX.js

- [Understanding Application State](#understanding-application-state)
- [User Interactions](#user-interactions)
- [Using Loading Indicators](#using-loading-indicators)
- [Using Animations](#using-animations)


## Understanding Application State

State for an application UI can live in different architectural layers. Where you decide to store your state depends on how it needs to be accesses and interact with browser capabilities.

One of the most challenging decisions in designing an application is deciding just where the UI state should live. This guide gives some requirements and recommendations.

### Database/Backend

Use when the UI state must survive browser sessions or application restarts, you must store it in the database or persistent backend store. The application will load and render the database/backend state into the HTML.

### Server Session

Use when the UI state must not be shareable or disclosable to the browser, but must survive page refreshes. Mutating session state requires interacting with the server. Your server will maintain the session variables and render them into HTML. With session state, all open tabs on a URL will have the same state.

### URL

Use when the UI state can be shareable, disclosable, and survive refreshes. The state is exposed to the user in the browser URL. URL state should be used whenever possible to match users expectations of browser functionality. URL state allows the page to be shareable, bookmarkable, deep linked, and opened in multiple tabs independently.

### Cookies (Client)

Use when the UI state must not be shareable and can be set by the client without posting to the server, but the cookies will be shared with the server. Cookies allow bi-directional synchronization of state with the browser and server. The server can use the cookies to control rendering output, and the client can also set the cookies (whereas the browser cannot set session data).

### localStorage

Use when the UI state must not be shareable, and does not or must not be shared with the server for rendering. The client can set and restore values on page load into localStorage

### Javascript/Page State

State which is stored by javascript in runtime variables or set into HTML attributes we call “Page State”. Page State is never rendered by the server or shared with it. Page state should be kept to a minimum so that the convention of URL refreshing and link sharing is maintained. Typically page state will be used for minor UI elements like tooltips.

## User Interactions

Links and Forms are the bedrock of HTML and HTTP interaction through a browser. Links (&lt;a href&gt;) represent GET requests and Forms (&lt;form&gt;) represent POST requests.

Links and Forms are all that is required to create fully operational browser applications.
You should build your application interaction elements entirely out of links and forms wherever possible. This is the most maintainable, accessible and straightforward way to build on the web.

ZSX.js enhances links and forms by providing features to control how to render the response content. It is the same response content that would have rendered had JS been turned off. But with ZSX.js, you can speed up your responsiveness of links and forms.

## Using Loading Indicators

Loading indicators should be used whenever the server response time can be greater than 100ms.

## Using Animations
In general, using animations and page transitions is an anti-pattern. The best UX is: ***Instantly change that which the user should notice***

The fastest change possible is simply to update the content. Animating content in and out is initially slick, but unecessary.

If you use any animations, they must do the following:
- Start immediately on the user click
- The user must never have to wait for the animation to finish to take an action

This means that you cannot wait to start animations after a request has finished. It's too late and ***will make the application feel sluggish***

# Cookbook
Common application design tasks

- [Restoring Events and Features After Swap](#restoring-events-and-features-after-swap)

## Restoring Events and Features After Swap
If you have other javascript that needs to be attached to the swapped elements, you can do so by listening on [`zsx.zx-swap.after`](#zsxzx-swapafter) event

```javascript
// Example resetting bootstrap tooltips and
document.addEventListener('zsx.zx-swap.after', function(event) {

	// Get the new element from the swap event
	var element = event.detail.newElement;

	var tooltips = element.querySelectorAll('.tooltip');
	var popovers = element.querySelectorAll('.popover');

	tooltips.forEach(function(tooltip){
		tooltip.remove();
	});

	popovers.forEach(function(popover){
		popover.remove();
	});

	var tooltipTriggerList = element.querySelectorAll('data-bs-toggle="tooltip"]')
	tooltipTriggerList.forEach(function(tooltipTriggerEl){
		return new bootstrap.Tooltip(tooltipTriggerEl)
	})

	var popoverTriggerList = element.querySelectorAll('[data-bs-toggle="popover"]')
	popoverTriggerList.forEach(function (popoverTriggerEl) {
		return new bootstrap.Popover(popoverTriggerEl)
	});

})
```

# Common Errors

The following are common errors that ZSX.js will throw when misusing features

## ZSX.js: Multiple elements found with selector "${selector}" but no id found to disambiguate them.

When your zx-swap directive results in multiple elements, each element needs a unique id in order to be able to determine which content area is which

## ZSX.js: target is not an anchor or form element

# Alternatives

[https://github.com/alexpetros/triptych](https://github.com/alexpetros/triptych)

[https://github.com/bigskysoftware/fixi](https://github.com/bigskysoftware/fixi)

[https://leanrada.com/htmz/](https://leanrada.com/htmz/)

[https://twinspark.js.org/](https://twinspark.js.org/)

Swapping Algorithims

[https://github.com/bigskysoftware/idiomorph](https://github.com/bigskysoftware/idiomorph)