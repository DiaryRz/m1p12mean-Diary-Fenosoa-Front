import { Component, OnInit, ViewChild } from '@angular/core';
import { MaterialModule } from 'src/app/material.module';
import { FormsModule, FormControl } from '@angular/forms';
import { ChartConfiguration, ChartData, ChartEvent } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import { StatisticsService } from 'src/app/services/statistics.service';
import { ThemeService } from 'src/app/services/theme.service';
import { MatDatepicker } from '@angular/material/datepicker';
import { tap } from 'rxjs/operators';

import { MAT_DATE_FORMATS, DateAdapter, MAT_DATE_LOCALE } from '@angular/material/core';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import moment from 'moment';

// Define custom date format that shows only year
const YEAR_ONLY_FORMAT = {
  parse: {
    dateInput: 'YYYY',
    monthYearLabel: 'YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'YYYY',
  },
  display: {
    dateInput: 'YYYY',
    monthYearLabel: 'YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'YYYY',
  },
};


@Component({
  selector: 'services-chart',
  providers: [
    {provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE]},
    {provide: MAT_DATE_FORMATS, useValue: YEAR_ONLY_FORMAT},
  ],
  imports: [BaseChartDirective, MaterialModule ,FormsModule],
  templateUrl: './services.component.html',
})
export class ServicesChartComponent implements OnInit {
  constructor(private themeColors: ThemeService,
    private statisticsService: StatisticsService,
    private dateAdapter: DateAdapter<Date>
  ) {
  }

  @ViewChild(BaseChartDirective) chart: BaseChartDirective<'line'> | undefined;
  theme: any;
  year: number = new Date().getFullYear();
  month: number = -1;
  yearControl = new FormControl(new Date());

  dateFilter = (date: moment.Moment | null): boolean => {
    if (!date) return false;
    const thisYear = moment().year();
    if (date.year() > thisYear) return false;
    return true;
  }

  currentMonth: number = new Date().getMonth() + 1; // Months are 1-12

  monthNames = ["Jan", "Fev", "Mar", "Avr", "Mai", "Jun",
              "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  chartData: any[] = []; // Will hold the API response data

  public lineChartData: ChartData<'line'> ;

  public lineChartOptions: ChartConfiguration<'line'>['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      title: {
        display: true,
        text: `Nombre de services mensuel`,
        font: {
          size: 16
        }
      },
      legend: {
        display: false
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Rendez-vous'
        },
        ticks: {
          stepSize: 100
        }
      },
      x: {
        title: {
          display: true,
          text: 'Mois'
        }
      }
    }
  };


  applyFilters() {
    if (this.year == new Date().getFullYear()) {
      return;
    }

    if (this.year < new Date().getFullYear()) {
      this.month = 12
    }


    this.fetchData();
  }

  resetFilters() {
    if (this.year == new Date().getFullYear()) {
      this.month = -1;
      return;
    }
    this.year = new Date().getFullYear();
    this.month = -1;

    this.fetchData();
  }

  onYearSelected(normalizedYear: moment.Moment, datepicker: MatDatepicker<Date>) {
    const ctrlValue = moment(normalizedYear);
    this.yearControl.setValue(new Date(ctrlValue.valueOf()));
    this.year = ctrlValue.year();
    datepicker.close();
  }

  ngOnInit(): void {
    this.theme = this.themeColors.getThemeColors();

    this.lineChartData = {
      labels: [],
      datasets: [{
        data: [],
        backgroundColor: this.theme.primary,
        borderColor: this.theme.secondary,
        borderWidth: 1,
      }]
    };
    this.fetchData();

  }

  print(value:any){
    console.log(value);
  }

  private fetchData() {
    this.statisticsService.getMonthlyServices(this.year ,this.month).pipe(
      tap({
        next: (data: any) => {

          this.chartData = data;
          this.updateChart();
        },
        error: (err) => console.error('Error fetching data:', err)
      })
    ).subscribe();
  }

  private updateChart() {
    // Filter data to only include months up to current month
    const filteredData = this.chartData
      .filter(item => this.year < new Date().getFullYear() || item._id.month <= this.currentMonth)
      .sort((a, b) => a._id.month - b._id.month);

    // Update chart labels and data
    this.lineChartData.labels = filteredData.map(item => this.monthNames[item._id.month - 1]);
    this.lineChartData.datasets[0].data = filteredData.map(item => item.total_services_taken);

    // Trigger chart update
    this.chart?.update();
  }
}

