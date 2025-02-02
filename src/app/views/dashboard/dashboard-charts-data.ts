import { Injectable } from '@angular/core';
import { ChartData, ChartDataset, ChartOptions, ChartType, PluginOptionsByType, ScaleOptions, TooltipLabelStyle } from 'chart.js';
import { DeepPartial } from 'chart.js/dist/types/utils';
import { getStyle } from '@coreui/utils';

export interface IChartProps {
  data?: ChartData;
  labels?: any;
  options?: ChartOptions;
  colors?: any;
  type: ChartType;
  legend?: any;

  [propName: string]: any;
}

@Injectable({
  providedIn: 'any'
})
export class DashboardChartsData {
  constructor() {
    this.initMainChart();
  }

  public mainChart: IChartProps = { type: 'line' };

  public random(min: number, max: number) {
    return Math.floor(Math.random() * (max - min + 1) + min);
  }

  initMainChart(period: string = 'Month') {

    const brandIntersul = getStyle('--cui-warning') ?? '#ffc107';
    const brandInternorte = getStyle('--cui-success') ?? '#198754';
    const brandTranscarioca = getStyle('--cui-info') ?? '#0d6efd';
    const brandSantacruz = getStyle('--cui-danger') ?? '#dc3545';
    const brandInfoBg = `rgba(${getStyle('--cui-info-rgb')}, .1)`


    // mainChart
    this.mainChart['elements'] = period === 'Month' ? 12 : 27;
    this.mainChart['Intersul'] = [];
    this.mainChart['Internorte'] = [];
    this.mainChart['Transcarioca'] = [];
    this.mainChart['Santacruz'] = [];

    // generate random values for mainChart
    for (let i = 0; i <= this.mainChart['elements']; i++) {
      this.mainChart['Intersul'].push(this.random(1689, 1000));
      this.mainChart['Internorte'].push(this.random(3545, 160));
      this.mainChart['Transcarioca'].push(this.random(5878, 160));
      this.mainChart['Santacruz'].push(this.random(6525, 1588));
    }

    let labels: string[] = [];
    if (period === 'Month') {
      labels = [
        'Janeiro',
        'Fevereiro',
        'Março',
        'Abril',
        'Maio',
        'Junho',
        'Julho',
        'Agosto',
        'Setembro',
        'Outubro',
        'Novembro',
        'Dezembro'
      ];
    } else if (period === 'Week') {
      /* tslint:disable:max-line-length */
      const week = [
        'Segunda',
        'Terça',
        'Quarta',
        'Quinta',
        'Sexta',
        'Sábado',
        'Domingo'
      ];
      labels = week.concat();
    } else if (period === 'Year') {
      const year = [
        '2018',
        '2019',
        '2020',
        '2021',
        '2022',
        '2023',
        '2024',
      ];
      labels = year.concat();
    }
    const colors = [
      {
        // Intersul
        backgroundColor: brandInfoBg,
        borderColor: brandIntersul,
        pointHoverBackgroundColor: brandIntersul,
        borderWidth: 3,
        fill: false
      },
      {
        // Internorte
        backgroundColor: brandInfoBg,
        borderColor: brandInternorte,
        pointHoverBackgroundColor: brandInternorte,
        borderWidth: 3,
        fill: false
      },
      {
        // Transcarioca
        backgroundColor: brandInfoBg,
        borderColor: brandTranscarioca,
        pointHoverBackgroundColor: brandTranscarioca,
        borderWidth: 3,
        fill: false
      },
      {
        // Santacruz
        backgroundColor: brandInfoBg,
        borderColor: brandSantacruz,
        pointHoverBackgroundColor: brandSantacruz,
        borderWidth: 3,
        borderDash: [8, 5],
        fill: false
      },
    ];

    const datasets: ChartDataset[] = [
      {
        data: this.mainChart['Intersul'],
        label: 'Intersul',
        ...colors[0]
      },
      {
        data: this.mainChart['Internorte'],
        label: 'Internorte',
        ...colors[1]
      },
      {
        data: this.mainChart['Transcarioca'],
        label: 'Transcarioca',
        ...colors[2]
      },
      {
        data: this.mainChart['Santacruz'],
        label: 'Santacruz',
        ...colors[3]
      }
    ];

    const plugins: DeepPartial<PluginOptionsByType<any>> = {
      legend: {
        display: true
      },
      tooltip: {
        callbacks: {
          labelColor: (context) => ({ backgroundColor: context.dataset.borderColor } as TooltipLabelStyle)
        }
      }
    };

    const scales = this.getScales();

    const options: ChartOptions = {
      maintainAspectRatio: false,
      plugins,
      scales,
      elements: {
        line: {
          tension: 0.4
        },
        point: {
          radius: 0,
          hitRadius: 10,
          hoverRadius: 4,
          hoverBorderWidth: 3
        }
      }
    };

    this.mainChart.type = 'line';
    this.mainChart.options = options;
    this.mainChart.data = {
      datasets,
      labels
    };
  }

  getScales() {
    const colorBorderTranslucent = getStyle('--cui-border-color-translucent');
    const colorBody = getStyle('--cui-body-color');

    const scales: ScaleOptions<any> = {
      x: {
        grid: {
          color: colorBorderTranslucent,
          drawOnChartArea: false
        },
        ticks: {
          color: colorBody
        }
      },
      y: {
        border: {
          color: colorBorderTranslucent
        },
        grid: {
          color: colorBorderTranslucent
        },
        max: 7000,
        beginAtZero: true,
        ticks: {
          color: colorBody,
          maxTicksLimit: 10,
          stepSize: Math.ceil(10/ 1)
        }
      }
    };
    return scales;
  }
}
