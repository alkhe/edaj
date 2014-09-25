#edaj

`edaj` is a Jade precompiler middleware for Express to automatically compile Jade templates into Javascript functions for use on the client. `edaj` recompiles template scripts when any of the dependent templates change.

##Installation
`npm install --save edaj`

##Usage

###Server
`app.js`

```
var edaj = require('edaj');

app.use(edaj(options));
```

`public/tpl/blog.jade`

```
.blog
	.title= title
	.content= content
	button.respond Comment
```

###Options
- `source` Location of the Jade templates. [`'./public/tpl'`]
- `destination` Location of the compiled template script. [`'./public/tpl/templates.js'`]
- `namespace` Namespace in which templates can be accessed. [`'Templates'`]

###Client

`Jade`

```
script(src='/tpl/templates.js')
// ...
#content
```

`Javascript`

```
var content = $('#content');

for (var i = 0; i < 10; i++) {
	content.append(Templates.blog({
		title: 'Blog #' + i,
		content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.'
	}));
}
```

`Stylus`

```
html, body
	margin 0 auto
	padding 0
	text-align center
	background #2050a0

*
	outline none
	font-family 'Source Sans Pro', Helvetica

.blog
	display inline-block
	width 500px
	padding 10px
	margin 20px
	border-radius 2px
	background #4080c0
	color #c0e0f0

	.title
		font-size 40px

	.content
		text-align justify

	.respond
		border-radius 2px
		color #c0e0f0
		border 0
		padding 5px
		background #70a0d0

hr
	border 0
	height 1px
	background #ccc
	background-image -webkit-linear-gradient(left, #48c, #ccc, #48c)
	background-image -moz-linear-gradient(left, #48c, #ccc, #48c)
	background-image -ms-linear-gradient(left, #48c, #ccc, #48c)
	background-image -o-linear-gradient(left, #48c, #ccc, #48c)
```

###Final Product
![Final Product](http://i.imgur.com/TK4O6CD.png)
