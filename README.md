
Gulp Styledown
===

styledown plugin for gulp


Quick Start
---

```js
var styledown = require('gulp-styledown');

gulp.src('/path/to/styledown/*.md')
.pipe(styldown({
  config: '/path/to/config.md'
  filename: 'output.html'
}))
.pipe.dest('paht/to/');
```

Options
---

- config : Path for config.md
