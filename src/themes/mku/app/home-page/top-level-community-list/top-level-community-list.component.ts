import { Component, Inject, OnInit } from '@angular/core';
import { TopLevelCommunityListComponent as BaseComponent } from '../../../../../app/home-page/top-level-community-list/top-level-community-list.component';
import { APP_CONFIG, AppConfig } from '../../../../../config/app-config.interface';
import { CommunityDataService } from '../../../../../app/core/data/community-data.service';
import { PaginationService } from '../../../../../app/core/pagination/pagination.service';
import { Community } from '../../../../../app/core/shared/community.model';
import { ChartConfiguration, Chart, TooltipItem } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';

Chart.register(ChartDataLabels);

@Component({
  selector: 'ds-top-level-community-list',
  templateUrl: './top-level-community-list.component.html'
})
export class TopLevelCommunityListComponent extends BaseComponent implements OnInit {

  minVisibility = 5;
  rawData = [];
  haveCommunities = false;
  public communitiesList: Community[];
  public doughnutChartLabels: string[] = [];
  public doughnutChartDatasets: ChartConfiguration<'doughnut'>['data']['datasets'] = [
    { data: this.rawData },
  ];

  public doughnutChartOptions: ChartConfiguration<'doughnut'>['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: '50%',
    plugins: {
      tooltip: {
        enabled: true,
        callbacks: {
          label(tooltipItem: TooltipItem<any>): string | string[] | void {
            return `Moderated for visibility`;
          },
        }
      },
    }
  };

  constructor(
    @Inject(APP_CONFIG) appConfig: AppConfig,
    cds: CommunityDataService,
    paginationService: PaginationService
  ) {
    super(appConfig, cds, paginationService);
  }

  ngOnInit() {
    super.ngOnInit();
    this.communitiesRD$.subscribe((dataFetched) => {
      if (dataFetched.hasSucceeded) {
        this.communitiesList = dataFetched.payload.page;
        this.communitiesList.forEach((community: Community, index) => {
          let itemsCount = Number(community.archivedItemsCount);
          let communityUrl = community.metadata['dc.identifier.uri'][0].value;
          let name = community.metadata['dc.title'][0].value;
          this.doughnutChartLabels.push(name);
          this.rawData.push(itemsCount);
        });
        let total = this.rawData.reduce((a, v) => Number(a) + Number(v));

        this.doughnutChartDatasets[0].data = this.rawData.map(
          v => Math.max(v / total * 100, this.minVisibility)
        );
        this.haveCommunities = true;
      }
    });
  }

  ngAfterViewInit() {
    // Custom plugin for drawing lines
    Chart.register({
      id: 'drawLines',
      afterDraw: (chart) => {
        const ctx = chart.ctx;
        chart.data.datasets.forEach((dataset, i) => {
          const meta = chart.getDatasetMeta(i);
          if (!meta.hidden) {
            meta.data.forEach((element, index) => {
              const model = element.getProps(['_model']) as any;
              const arc = element.getProps(['arc']) as any;
              const startAngle = arc.startAngle;
              const endAngle = arc.endAngle;
              const midAngle = (startAngle + endAngle) / 2;
              const radius = model.outerRadius;
              const x = model.x + radius * Math.cos(midAngle);
              const y = model.y + radius * Math.sin(midAngle);
              const padding = 10; // Ensure labels are at least 10px away from the pie element

              const labelX = x + (x > model.x ? padding : -padding);
              const labelY = y + (y > model.y ? padding : -padding);

              ctx.beginPath();
              ctx.moveTo(x, y);
              ctx.lineTo(labelX, labelY);
              ctx.strokeStyle = 'rgba(0, 0, 0, 0.7)';
              ctx.stroke();

              const text = chart.data.labels[index];
              const fontSize = 12;
              const fontStyle = 'bold';
              const fontFamily = 'Helvetica Neue';

              // Use canvas context directly to set font properties
              ctx.font = `${fontStyle} ${fontSize}px ${fontFamily}`;
              ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';

              // Determine text baseline
              const textBaseline = y > model.y ? 'top' : 'bottom';

              // Determine text align
              const textAlign = x > model.x ? 'start' : 'end';

              // Calculate width of the text
              const textWidth = ctx.measureText(text.toString()).width;

              // Draw text
              ctx.textBaseline = textBaseline;
              ctx.textAlign = textAlign;
              ctx.fillText(text.toString(), labelX + (x > model.x ? 1 : -1) * (padding + (x > model.x ? 0 : textWidth)), labelY);
            });
          }
        });
      }
    });
  }
}
