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
import { Cite } from '@citation-js/core';
import '@citation-js/plugin-csl';

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
  totalDownloads: number;

  apaCitation: string;
  vancouverCitation: string;
  bibTex: string;

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
    this.generateCitations();

    report.subscribe((uReport: UsageReport[]) => {
      this.usageReport = uReport;
      this.reportsLoaded = true;
      uReport.forEach( repo => {
        if (repo.reportType === 'TotalVisitsPerMonth') {
          this.retrievedMonths = repo.points.map(item => item.label);
          this.dataList = repo.points.map(item => item.values['views']);
          this.setChartOptions();
        }  else if (repo.reportType === 'TotalDownloads') {
          this.totalDownloads = repo.points.reduce(
            (sum, item) => sum + Number(item.values['views']), 0);
        } else if (repo.reportType === 'TotalVisits') {
          this.totalViews = repo.points.reduce(
            (sum, item) => sum + Number(item.values['views']), 0);
        } else if (repo.reportType === 'TopCountries') {
          console.log('TopCountries');
          console.log(repo);
        } else if (repo.reportType === 'TopCities') {
          console.log('TopCities');
          console.log(repo);
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
  generateCitations(){
    let dateIssued = this.object.firstMetadataValue(['dc.date.issued']);
    const cite = new Cite({
      type: 'article-journal',
      title: this.object.firstMetadataValue(['dc.title']),
      author: this.object.allMetadataValues(['dc.contributor.author']),
      issued: {
        'date-parts': [this.extractDateParts(dateIssued)]
      },
      publisher: this.object.firstMetadataValue(['dc.publisher']),
      URL: this.object.firstMetadataValue(['dc.identifier.uri'])
    });

    this.apaCitation = cite.format('bibliography', {
      format: 'html',
      template: 'apa',
      lang: 'en-US'
    });
    this.vancouverCitation = cite.format('bibliography', {
      format: 'html',
      template: 'vancouver',
      lang: 'en-US'
    });
  }

  extractDateParts(dateStr: string): number[] {
    const parts = dateStr.split('-').map(part => parseInt(part, 10));

    // Ensure parts array has at least 3 elements (for year, month, date)
    // while (parts.length < 3) {
    //   parts.push(undefined);
    // }

    return parts;
  }


}
