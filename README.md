# Chart.js 

[![Build Status](https://travis-ci.org/nnnick/Chart.js.svg?branch=master)](https://travis-ci.org/nnnick/Chart.js) [![Code Climate](https://codeclimate.com/github/nnnick/Chart.js/badges/gpa.svg)](https://codeclimate.com/github/nnnick/Chart.js)


*Simple HTML5 Charts using the canvas element* [chartjs.org](http://www.chartjs.org)

##New Features In This Fork
 - labelsFilter to filter x-axis labels based on user provided function [http://jsfiddle.net/leighking2/mea767ss](http://jsfiddle.net/leighking2/mea767ss/)
 - Template interpolator can be changed from default `<%` `%>` to what ever you want [http://jsfiddle.net/leighking2/d5yq9x32](http://fiddle.jshell.net/leighking2/d5yq9x32/)
 - New chart - overlay chart - for combing both bar and line charts on the same chart [http://jsfiddle.net/leighking2/y58n7m3z](http://fiddle.jshell.net/leighking2/y58n7m3z/)
 - new chart options for pie and dougnut to allow the creation of semi circle (or any size) charts drawn at user defined starting angle [http://jsfiddle.net/leighking2/f62Lghy1](http://fiddle.jshell.net/leighking2/f62Lghy1/)
 - line and overlay charts can handle sparse datasets, just include null in the dataset where no data is avaliable, this can be seen in the samples [http://jsfiddle.net/leighking2/ntuwuk5v](http://fiddle.jshell.net/leighking2/ntuwuk5v/)
 - line,bar and overlay charts can have the tooltip display finely tuned. For each dataset an option called showTooltip can be passed to turn off the displaying off tooltips for that one dataset but not the whole chart [http://jsfiddle.net/leighking2/at3w2aej](http://fiddle.jshell.net/leighking2/at3w2aej/)
 

All new features are documented in the forks docs section or follow the links to the fiddles to see a working example.
## Documentation

You can find documentation at [chartjs.org/docs](http://www.chartjs.org/docs/). The markdown files that build the site are available under `/docs`. Please note - in some of the json examples of configuration you might notice some liquid tags - this is just for the generating the site html, please disregard.

## Bugs, issues and contributing

Before submitting an issue or a pull request to the project, please take a moment to look over the [contributing guidelines](https://github.com/nnnick/Chart.js/blob/master/CONTRIBUTING.md) first.

For support using Chart.js, please post questions with the [`chartjs` tag on Stack Overflow](http://stackoverflow.com/questions/tagged/chartjs).

## License


## Contributing
New contributions to the library are welcome, just a couple of guidelines:

- Tabs for indentation, not spaces please.
- Please ensure you're changing the individual files in `/src`, not the concatenated output in the `Chart.js` file in the root of the repo.
- Please check that your code will pass `jshint` code standards, `gulp jshint` will run this for you.
- Please keep pull requests concise, and document new functionality in the relevant `.md` file.
- Consider whether your changes are useful for all users, or if creating a Chart.js extension would be more appropriate.
- Please avoid committing in the build Chart.js & Chart.min.js file, as it causes conflicts when merging.
