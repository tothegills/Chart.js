(function(){
	"use strict";

	var root = this,
		Chart = root.Chart,
		helpers = Chart.helpers;

	var defaultConfig = {
		//Function - Whether the current x-axis label should be filtered out, takes in current label and 
		//index, return true to filter out the label return false to keep the label
		labelsFilter : function(label,index){return false;},

		///Boolean - Whether grid lines are shown across the chart
		scaleShowGridLines : true,

		//String - Colour of the grid lines
		scaleGridLineColor : "rgba(0,0,0,.05)",

		//Number - Width of the grid lines
		scaleGridLineWidth : 1,

		//Boolean - Whether to show horizontal lines (except X axis)
		scaleShowHorizontalLines: true,

		//Boolean - Whether to show vertical lines (except Y axis)
		scaleShowVerticalLines: true,

		//Boolean - Whether the line is curved between points
		bezierCurve : true,

		//Number - Tension of the bezier curve between points
		bezierCurveTension : 0.4,

		//Boolean - Whether to show a dot for each point
		pointDot : true,

		//Number - Radius of each point dot in pixels
		pointDotRadius : 4,

		//Number - Pixel width of point dot stroke
		pointDotStrokeWidth : 1,

		//Number - amount extra to add to the radius to cater for hit detection outside the drawn point
		pointHitDetectionRadius : 20,

		//Boolean - Whether to show a stroke for datasets
		datasetStroke : true,

		//Number - Pixel width of dataset stroke
		datasetStrokeWidth : 2,

		//Boolean - Whether to fill the dataset with a colour
		datasetFill : true,

		//String - A legend template
		legendTemplate : "<ul class=\"<%=name.toLowerCase()%>-legend\"><% for (var i=0; i<datasets.length; i++){%><li><span style=\"background-color:<%=datasets[i].strokeColor%>\"></span><%if(datasets[i].label){%><%=datasets[i].label%><%}%></li><%}%></ul>"

	};


	Chart.Type.extend({
		name: "Line",
		defaults : defaultConfig,
		initialize:  function(data){
			//Declare the extension of the default point, to cater for the options passed in to the constructor
			this.PointClass = Chart.Point.extend({
				strokeWidth : this.options.pointDotStrokeWidth,
				radius : this.options.pointDotRadius,
				display: this.options.pointDot,
				hitDetectionRadius : this.options.pointHitDetectionRadius,
				ctx : this.chart.ctx,
				inRange : function(mouseX){
					return (Math.pow(mouseX-this.x, 2) < Math.pow(this.radius + this.hitDetectionRadius,2));
				}
			});

			this.datasets = [];

			//Set up tooltip events on the chart
			if (this.options.showTooltips){
				helpers.bindEvents(this, this.options.tooltipEvents, function(evt){
					var activePoints = (evt.type !== 'mouseout') ? this.getPointsAtEvent(evt) : [];
					this.eachPoints(function(point){
						point.restore(['fillColor', 'strokeColor']);
					});
					helpers.each(activePoints, function(activePoint){
						activePoint.fillColor = activePoint.highlightFill;
						activePoint.strokeColor = activePoint.highlightStroke;
					});
					this.showTooltip(activePoints);
				});
			}

			//Iterate through each of the datasets, and build this into a property of the chart
			helpers.each(data.datasets,function(dataset){
				var datasetObject = {
					label : dataset.label || null,
					fillColor : dataset.fillColor,
					strokeColor : dataset.strokeColor,
					pointColor : dataset.pointColor,
					pointStrokeColor : dataset.pointStrokeColor,
					showTooltip: dataset.showTooltip,
					points : []
				};

				this.datasets.push(datasetObject);


				helpers.each(dataset.data,function(dataPoint,index){
					//Add a new point for each piece of data, passing any required data to draw.
					datasetObject.points.push(new this.PointClass({

						//if datapoint is null add a flag to ignore this point
						ignore: dataPoint === null,
						showTooltip:dataset.showTooltip === undefined?true:dataset.showTooltip,
						value : dataPoint,
						label : data.labels[index],
						datasetLabel: dataset.label,
						strokeColor : dataset.pointStrokeColor,
						fillColor : dataset.pointColor,
						highlightFill : dataset.pointHighlightFill || dataset.pointColor,
						highlightStroke : dataset.pointHighlightStroke || dataset.pointStrokeColor
					}));
				},this);

				this.buildScale(data.labels);


				this.eachPoints(function(point, index){
					helpers.extend(point, {
						x: this.scale.calculateX(index),
						y: this.scale.endPoint
					});
					point.save();
				}, this);

			},this);


			this.render();
		},
		update : function(){
			this.scale.update();
			// Reset any highlight colours before updating.
			helpers.each(this.activeElements, function(activeElement){
				activeElement.restore(['fillColor', 'strokeColor']);
			});
			this.eachPoints(function(point){
				point.save();
			});
			this.render();
		},
		eachPoints : function(callback){
			helpers.each(this.datasets,function(dataset){
				helpers.each(dataset.points,callback,this);
			},this);
		},
		getPointsAtEvent : function(e){
			var pointsArray = [],
				eventPosition = helpers.getRelativePosition(e);
			helpers.each(this.datasets,function(dataset){
				helpers.each(dataset.points,function(point){
					if (point.inRange(eventPosition.x,eventPosition.y) && point.showTooltip) pointsArray.push(point);
				});
			},this);
			return pointsArray;
		},
		buildScale : function(labels){
			var self = this;

			var dataTotal = function(){
				var values = [];
				self.eachPoints(function(point){
					if(point.value !==  null){
					  values.push(point.value);
				  }
				});

				return values;
			};

			var scaleOptions = {
				templateString : this.options.scaleLabel,
				height : this.chart.height,
				width : this.chart.width,
				ctx : this.chart.ctx,
				labelsFilter: this.options.labelsFilter,
				textColor : this.options.scaleFontColor,
				fontSize : this.options.scaleFontSize,
				fontStyle : this.options.scaleFontStyle,
				fontFamily : this.options.scaleFontFamily,
				valuesCount : labels.length,
				beginAtZero : this.options.scaleBeginAtZero,
				integersOnly : this.options.scaleIntegersOnly,
				calculateYRange : function(currentHeight){
					var updatedRanges = helpers.calculateScaleRange(
						dataTotal(),
						currentHeight,
						this.fontSize,
						this.beginAtZero,
						this.integersOnly
					);
					helpers.extend(this, updatedRanges);
				},
				xLabels : labels,
				font : helpers.fontString(this.options.scaleFontSize, this.options.scaleFontStyle, this.options.scaleFontFamily),
				lineWidth : this.options.scaleLineWidth,
				lineColor : this.options.scaleLineColor,
				showHorizontalLines : this.options.scaleShowHorizontalLines,
				showVerticalLines : this.options.scaleShowVerticalLines,
				gridLineWidth : (this.options.scaleShowGridLines) ? this.options.scaleGridLineWidth : 0,
				gridLineColor : (this.options.scaleShowGridLines) ? this.options.scaleGridLineColor : "rgba(0,0,0,0)",
				padding: (this.options.showScale) ? 0 : this.options.pointDotRadius + this.options.pointDotStrokeWidth,
				showLabels : this.options.scaleShowLabels,
				display : this.options.showScale
			};

			if (this.options.scaleOverride){
				helpers.extend(scaleOptions, {
					calculateYRange: helpers.noop,
					steps: this.options.scaleSteps,
					stepValue: this.options.scaleStepWidth,
					min: this.options.scaleStartValue,
					max: this.options.scaleStartValue + (this.options.scaleSteps * this.options.scaleStepWidth)
				});
			}


			this.scale = new Chart.Scale(scaleOptions);
		},
		addData : function(valuesArray,label){
			//Map the values array for each of the datasets

			helpers.each(valuesArray,function(value,datasetIndex){
				//Add a new point for each piece of data, passing any required data to draw.
				this.datasets[datasetIndex].points.push(new this.PointClass({
					value : value,
					label : label,
					x: this.scale.calculateX(this.scale.valuesCount+1),
					y: this.scale.endPoint,
					strokeColor : this.datasets[datasetIndex].pointStrokeColor,
					fillColor : this.datasets[datasetIndex].pointColor
				}));
			},this);

			this.scale.addXLabel(label);
			//Then re-render the chart.
			this.update();
		},
		removeData : function(){
			this.scale.removeXLabel();
			//Then re-render the chart.
			helpers.each(this.datasets,function(dataset){
				dataset.points.shift();
			},this);
			this.update();
		},
		reflow : function(){
			var newScaleProps = helpers.extend({
				height : this.chart.height,
				width : this.chart.width
			});
			this.scale.update(newScaleProps);
		},

		//extracted from draw() so it can be used to draw any line datasets
		drawDatasets: function(datasets, easingDecimal)
		{
			var ctx = this.chart.ctx;

			// Some helper methods for getting the next/prev points
			var hasValue = function(item){
				return item.value !== null;
			},
			nextPoint = function(point, collection, index){
				return helpers.findNextWhere(collection, hasValue, index) || point;
			},
			previousPoint = function(point, collection, index){
				return helpers.findPreviousWhere(collection, hasValue, index) || point;
			};

			this.scale.draw(easingDecimal);


            helpers.each(this.datasets, function(dataset) {

                //Transition each point first so that the line and point drawing isn't out of sync
                //We can use this extra loop to calculate the control points of this dataset also in this loop

                helpers.each(dataset.points, function(point, index) {
                    point.transition({
                        y: this.scale.calculateY(point.value),
                        x: this.scale.calculateX(index)
                    }, easingDecimal);

                }, this);


                // Control points need to be calculated in a seperate loop, because we need to know the current x/y of the point
                // This would cause issues when there is no animation, because the y of the next point would be 0, so beziers would be skewed
                if (this.options.bezierCurve) {
                    helpers.each(dataset.points, function(point, index) {
                        //If we're at the start or end, we don't have a previous/next point
                        //By setting the tension to 0 here, the curve will transition to straight at the end
                        if (index === 0) {
                            point.controlPoints = helpers.splineCurve(point, point, dataset.points[index + 1], 0);
                        } else if(dataset.points[index - 1].ignore && index !== dataset.points.length-1){
                            point.controlPoints = helpers.splineCurve(point, point, dataset.points[index + 1], 0);
                        }else if( index !== dataset.points.length-1 && dataset.points[index + 1].ignore){
                            point.controlPoints = helpers.splineCurve(dataset.points[index - 1], point, point, 0);
                        }else if (index >= dataset.points.length - 1) {
                            point.controlPoints = helpers.splineCurve(dataset.points[index - 1], point, point, 0);
                        } else {
                            point.controlPoints = helpers.splineCurve(dataset.points[index - 1], point, dataset.points[index + 1], this.options.bezierCurveTension);
                        }
                    }, this);
                }


                //Draw the line between all the points
                ctx.lineWidth = this.options.datasetStrokeWidth;
                ctx.strokeStyle = dataset.strokeColor;


                var penDown = false;
                var start = null;

                helpers.each(dataset.points, function(point, index) {

                    /**
                     * no longer draw if the last point was ignore (as we don;t have anything to draw from)
                     * or if this point is ignore
                     * or if it's the first
                     */
                    if (!point.ignore && !penDown) {
                        ctx.beginPath();
                        penDown = true;
                        start = point;
                    }
                    if (index > 0 && !dataset.points[index - 1].ignore && !point.ignore) {
                        if (this.options.bezierCurve) {
                            ctx.bezierCurveTo(
                                dataset.points[index - 1].controlPoints.outer.x,
                                dataset.points[index - 1].controlPoints.outer.y,
                                point.controlPoints.inner.x,
                                point.controlPoints.inner.y,
                                point.x,
                                point.y
                            );
                        } else {
                            ctx.lineTo(point.x, point.y);
                        }

                    } else if (index === 0 || dataset.points[index - 1].ignore) {
                        ctx.moveTo(point.x, point.y);
                    }

                    if (((dataset.points.length > index + 1 && dataset.points[index + 1].ignore) ||
                        dataset.points.length == index + 1) && !point.ignore) {
                        ctx.stroke();

                        if (this.options.datasetFill) {
                            ctx.lineTo(point.x, this.scale.endPoint);
                            ctx.lineTo(start.x, this.scale.endPoint);
                            ctx.fillStyle = dataset.fillColor;
                            ctx.closePath();
                            if (point.x != start.x) {
                                ctx.fill();
                            }
                        }
                        penDown = false;
                    }

                }, this);


                //Now draw the points over the line
                //A little inefficient double looping, but better than the line
                //lagging behind the point positions
                helpers.each(dataset.points, function(point) {
                    /**
                     * don't draw the dot if we are ignoring
                     */
                    if (!point.ignore)
                        point.draw();
                });

            }, this);
        
		},
		draw : function(ease){
			var easingDecimal = ease || 1;
			this.clear();

			this.scale.draw(easingDecimal);
			this.drawDatasets(this.datasets, easingDecimal);
		}
	});


}).call(this);
