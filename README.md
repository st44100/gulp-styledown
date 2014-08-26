
gulp-syledown [WIP]
===

Styledown middleware for gulp


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

- config : Path to config.md
- filename : Path to output html


LICENSE
---
(WTFPL)
