import { Component, Input } from '@angular/core';
import * as Highcharts from 'highcharts';

@Component({
    selector: 'app-chart',
    templateUrl: './chart.component.html',
    styleUrls: ['./chart.component.scss'],
})
export class ChartComponent {
    Highcharts: typeof Highcharts = Highcharts;
    outputMessage: string;

    @Input() timeseriesData: [number, number][] = [];
    @Input() downsample: boolean = false;

    constructor() {
        this.outputMessage = '';
    }

    chartInitialized(chart: Highcharts.Chart): void {
        const data: [number, number][] = !this.downsample
            ? this.timeseriesData
            : this.returnDownsampledData();

        chart.series[0].setData(data);
    }

    chartOptions: Highcharts.Options = {
        chart: {
            type: 'line',
        },
        title: {
            text: '',
        },
        xAxis: {
            type: 'datetime', // Use datetime type for time series
            labels: {
                enabled: false, // Disable x-axis labels
            },
        },
        yAxis: {
            title: {
                text: null, // Remove y-axis title
            },
        },
        legend: {
            enabled: false, // Disable the legend
        },
        series: [
            {
                type: 'line',
                lineWidth: 1,
            },
        ],
        plotOptions: {
            series: {
                states: {
                    hover: {
                        lineWidthPlus: 0, // Prevent line from growing bold on hover
                    },
                },
            },
        },
        credits: {
            enabled: false,
        },
    };

    /** Modify and extend the code where indicated. You're also allowed to add utility functions below.*/
    private returnDownsampledData(): [number, number][] {
        console.time('returnDownsampledData');
        const dataToDownsample: [number, number][] = [...this.timeseriesData];
        const plotWidth: number = 548;

        const maxSizeOfPlots = Math.floor(dataToDownsample.length / plotWidth);
        const downsampledData: [number, number][] = [];

        let i = 0;
        while (i < dataToDownsample.length) {
            downsampledData.push(dataToDownsample[i]);

            let maxYPoint = dataToDownsample[i];
            for (let j = i + 1; j < i + maxSizeOfPlots && j < dataToDownsample.length; j++) {
                if (dataToDownsample[j][1] > maxYPoint[1]) {
                    maxYPoint = dataToDownsample[j];
                }
            }

            if (maxYPoint !== dataToDownsample[i]) {
                downsampledData.push(maxYPoint);
            }

            i += maxSizeOfPlots;
            if (i >= dataToDownsample.length) {
                downsampledData.push(dataToDownsample[dataToDownsample.length - 1]);
                break;
            }
        }

        console.timeEnd('returnDownsampledData');

        this.outputMessage = `Input ${this.timeseriesData.length}, Output ${downsampledData.length}`;
        console.log(this.outputMessage);

        return downsampledData;
    }
}
