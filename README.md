[![Gitter](https://badges.gitter.im/Join Chat.svg)](https://gitter.im/st44100/gulp-styledown?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge)

gulp-styledown
===

A gulp plugin for Styledown.

[![Build Status](https://drone.io/github.com/st44100/gulp-styledown/status.png)](https://drone.io/github.com/st44100/gulp-styledown/latest)




Quick Start
---

```js
var styledown = require('gulp-styledown');

gulp.src('/path/to/styledown/*.md')
.pipe(styledown({
  config: '/path/to/config.md'
  filename: 'output.html'
}))
.pipe(gulp.dest('/path/to/'));
```

Options
---

- config : Path to config.md
- filename : Path to output html

Other options are pass to [styledown](https://github.com/styledown/styledown).
