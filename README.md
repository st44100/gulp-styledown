
gulp-styledown
===

A gulp plugin for Styledown.

[![Build Status](https://drone.io/github.com/st44100/gulp-styledown/status.png)](https://drone.io/github.com/st44100/gulp-styledown/latest)




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

Other options are pass to [styledown](https://github.com/styledown/styledown).
