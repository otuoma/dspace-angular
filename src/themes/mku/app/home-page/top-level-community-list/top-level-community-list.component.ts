import {Component, Inject, OnInit} from '@angular/core';
import { TopLevelCommunityListComponent as BaseComponent } from '../../../../../app/home-page/top-level-community-list/top-level-community-list.component';
import {APP_CONFIG, AppConfig} from '../../../../../config/app-config.interface';
import {CommunityDataService} from '../../../../../app/core/data/community-data.service';
import {PaginationService} from '../../../../../app/core/pagination/pagination.service';
import {Community} from '../../../../../app/core/shared/community.model';
import {ChartConfiguration, Chart, TooltipItem} from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';

Chart.register(ChartDataLabels);

@Component({
  selector: 'ds-top-level-community-list',
  templateUrl: './top-level-community-list.component.html'})

export class TopLevelCommunityListComponent extends BaseComponent implements OnInit{

  minVisibility = 10;
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
    plugins:{
      tooltip:{
        enabled: true,
        callbacks:{
          label(tooltipItem: TooltipItem<any>): string | string[] | void {
            return `Moderated for visibility`;
          },
        }
      },
      datalabels: {
        formatter: (value, context) => {
          return this.rawData[context.dataIndex];
        }
      }
    },
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
    this.communitiesRD$.subscribe(( (dataFetched) =>{
      if ( dataFetched.hasSucceeded ){
        this.communitiesList = dataFetched.payload.page;
        this.communitiesList.forEach((community: Community, index)=>{
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
    }));
  }
}

