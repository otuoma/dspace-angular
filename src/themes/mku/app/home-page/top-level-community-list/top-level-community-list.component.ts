import {Component, Inject, OnInit} from '@angular/core';
import { TopLevelCommunityListComponent as BaseComponent } from '../../../../../app/home-page/top-level-community-list/top-level-community-list.component';
import {APP_CONFIG, AppConfig} from '../../../../../config/app-config.interface';
import {CommunityDataService} from '../../../../../app/core/data/community-data.service';
import {PaginationService} from '../../../../../app/core/pagination/pagination.service';
import {Community} from '../../../../../app/core/shared/community.model';
import * as Highcharts from 'highcharts';

declare let require: any;
const More = require('highcharts/highcharts-more');
More(Highcharts);

const Exporting = require('highcharts/modules/exporting');
Exporting(Highcharts);

const ExportData = require('highcharts/modules/export-data');
ExportData(Highcharts);

const Accessibility = require('highcharts/modules/accessibility');
Accessibility(Highcharts);
@Component({
  selector: 'ds-top-level-community-list',
  templateUrl: './top-level-community-list.component.html'})

export class TopLevelCommunityListComponent extends BaseComponent implements OnInit{
  isHighcharts = typeof Highcharts === 'object';
  Highcharts: typeof Highcharts = Highcharts;
  private rawData = [];
  chartOptions: Highcharts.Options = {
    series: [
      {
        type: 'pie',
        data: this.rawData,
        name: 'Knowledge Wheel'
      },
    ],
    plotOptions: {
      pie: {
        size:'100%',
        allowPointSelect: true,
        cursor: 'pointer',
        dataLabels: {
          enabled: true,
          format: '<b>{point.name}</b>: {point.percentage:.1f} %'
        }
      }
    },
  };
  haveCommunities = false;
  public communitiesList: Community[];

  constructor(
    @Inject(APP_CONFIG) appConfig: AppConfig,
    cds: CommunityDataService,
    paginationService: PaginationService
  ) {
    super(appConfig, cds, paginationService);
  }

  ngOnInit() {
    super.ngOnInit();
    console.log('=======================');
    this.communitiesRD$.subscribe(( (dataFetched) =>{
      if ( dataFetched.hasSucceeded ){
        this.communitiesList = dataFetched.payload.page;
        this.communitiesList.forEach((community: Community, index)=>{
          let itemsCount = Number(community.archivedItemsCount);
          let communityUrl = community.metadata['dc.identifier.uri'][0].value;
          let name = community.metadata['dc.title'][0].value;
          this.rawData.push({
            name: name, y: itemsCount
          });

        });
        let total = this.rawData.reduce((a, v) => Number(a) + Number(v));
        this.haveCommunities = true;
      }
    }));
  }
}

