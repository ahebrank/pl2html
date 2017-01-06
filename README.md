# Pattern Lab -> HTML

Template and page packaging for handoff to downstream development. This script is designed for use in continuous integration.

In `.gitlab-ci.yml`:

```
pl2html:
  stage: deploy
  script:
    - pl2html --patterndir pl/public/patterns --outdir html
    - cp -R pl/public/images pl/public/css pl/public/js html
  artifacts:
    paths:
      - html
    expire_in: 1 week
```

The resulting `html` artifact will contain any templates or pages as complete HTML, with image, styling, and script assets copied over. 

## Requirements

1. `npm install -g pl2html` or use Docker image `newcity/builder:latest`
2. For markup cleanup to work, make sure any Patternlab scripts or styling is wrapped in comments containing `Begin Pattern Lab` and `End Pattern Lab`.  Specifically:

`meta/head.twig`:
```
<!-- Begin Pattern Lab (Required for Pattern Lab to run properly) -->
{{ patternLabHead|raw }}
<!-- End Pattern Lab -->
```

`meta/foot.twig`:
```
<!-- Begin Pattern Lab -->
{{ patternLabFoot|raw }}
<!-- End Pattern Lab -->
```
