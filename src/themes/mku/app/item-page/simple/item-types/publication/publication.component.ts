import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import { ViewMode } from '../../../../../../../app/core/shared/view-mode.model';
import { listableObjectComponent } from '../../../../../../../app/shared/object-collection/shared/listable-object/listable-object.decorator';
import { Context } from '../../../../../../../app/core/shared/context.model';
import { PublicationComponent as BaseComponent } from '../../../../../../../app/item-page/simple/item-types/publication/publication.component';
import {RouteService} from '../../../../../../../app/core/services/route.service';
import {Router} from '@angular/router';
import {UsageReportDataService} from '../../../../../../../app/core/statistics/usage-report-data.service';
import {UsageReport} from '../../../../../../../app/core/statistics/models/usage-report.model';
import * as Highcharts from 'highcharts';

/**
 * Component that represents a publication Item page
 */

@listableObjectComponent('Publication', ViewMode.StandalonePage, Context.Any, 'mku')
@Component({
  selector: 'ds-publication',
  styleUrls: ['../../../../../../../app/item-page/simple/item-types/publication/publication.component.scss'],
  templateUrl: './publication.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PublicationComponent extends BaseComponent implements OnInit{
  Highcharts: typeof Highcharts = Highcharts;
  usageReport: UsageReport[] | null;
  retrievedMonths: string[] = [];
  dataList: any[] = [];
  chartOptions: Highcharts.Options = {};
  reportsLoaded = false;
  totalViews: number;

  constructor(
    protected routeService: RouteService,
    protected router: Router,
    protected usageReportDataService: UsageReportDataService,
  ) {
    super(routeService, router);
  }

  ngOnInit() {
    super.ngOnInit();
    let report = this.usageReportDataService
      .searchStatistics(this.object._links.self.href, 0, 20);

    report.subscribe((uReport: UsageReport[]) => {
      this.usageReport = uReport;
      this.reportsLoaded = true;
      uReport.forEach( repo => {
        if (repo.reportType === 'TotalVisitsPerMonth') {
          this.retrievedMonths = repo.points.map(item => item.label);
          this.dataList = repo.points.map(item => item.values['views']);
          this.setChartOptions();
        } else if (repo.reportType === 'TotalVisits') {
          this.totalViews = repo.points.reduce(
            (sum, item) => sum + Number(item.values['views']), 0);
        } else {
          console.log(repo);
        }
      });
    });
  }

  setChartOptions() {
    this.chartOptions = {
      title: {
        text: ''
      },
      xAxis: {
        categories: this.retrievedMonths
      },
      yAxis: {
        title: {
          text: 'Views'
        }
      },
      series: [
        {
          type: 'line',
          name: 'Views',
          data: this.dataList
        }
      ]
    };
  }


}
