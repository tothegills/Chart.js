# Chart.js

*Simple HTML5 Charts using the canvas element* [chartjs.org](http://www.chartjs.org)

##New Features In This Fork
 - labelsFilter to filter x-axis labels based on user provided function
 - Template interpolator can be changed from default `<%` `%>` to what ever you want
 - New chart - overlay chart - for combing both bar and line charts on the same chart
 - new chart options for pie and dougnut to allow the creation of semi circle (or any size) charts drawn at user defined starting angle ()
 - line and overlay charts can handle sparse datasets, just include null in the dataset where no data is avaliable, this can be seen in the samples.
 - line,bar and overlay charts can have the tooltip display finely tuned. For each dataset an option called showTooltip can be passed to turn off the displaying off tooltips for that one dataset but not the whole chart
 

All new features are all documented the forks docs section.
## Documentation

You can find documentation at [chartjs.org/docs](http://www.chartjs.org/docs/). The markdown files that build the site are available under `/docs`. Please note - in some of the json examples of configuration you might notice some liquid tags - this is just for the generating the site html, please disregard.

## License

Chart.js is available under the [MIT license](http://opensource.org/licenses/MIT).

## Bugs & issues

When reporting bugs or issues, if you could include a link to a simple [jsbin](http://jsbin.com) or similar demonstrating the issue, that'd be really helpful.


## Contributing
New contributions to the library are welcome, just a couple of guidelines:

- Tabs for indentation, not spaces please.
- Please ensure you're changing the individual files in `/src`, not the concatenated output in the `Chart.js` file in the root of the repo.
- Please check that your code will pass `jshint` code standards, `gulp jshint` will run this for you.
- Please keep pull requests concise, and document new functionality in the relevant `.md` file.
- Consider whether your changes are useful for all users, or if creating a Chart.js extension would be more appropriate.
- Please avoid committing in the build Chart.js & Chart.min.js file, as it causes conflicts when merging.


