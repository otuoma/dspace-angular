import {Component, OnDestroy, OnInit} from '@angular/core';
import { HomeNewsComponent as BaseComponent } from '../../../../../app/home-page/home-news/home-news.component';
import {HttpClient} from '@angular/common/http';
import {Observable, Subscription} from 'rxjs';
import {ActivatedRoute} from '@angular/router';

@Component({
  selector: 'ds-home-news',
  styleUrls: ['../../../../../app/home-page/home-news/home-news.component.scss'],
  templateUrl: './home-news.component.html'
})
export class HomeNewsComponent extends BaseComponent implements OnInit, OnDestroy{
  routeSub: Subscription;
  collectionSpinner = true;
  spinnerMessage = 'Largando comunidades';
  topLevelCommunities: [{
    name: string,
    url: string,
    logo: string,
    itemCount: number,
    uuid: string
  }] = [{name: '', url: '', logo: '', itemCount: 0, uuid: ''}];
  baseUrl = 'https://repositorio.arcoiris.edu.pe';
  constructor(private httpClient: HttpClient, private activeRoute: ActivatedRoute) {
    super();
  }

  getTopLevelCollections(): Observable<any> {
    return this.httpClient.get<any>(
      `${this.baseUrl}/server/api/core/communities/search/top?page=0&size=5&sort=dc.title,ASC`
    );
  }

  ngOnInit(): void {
    this.routeSub = this.activeRoute.params.subscribe(val => {

      this.getTopLevelCollections().subscribe(resp=>{

        if (resp._embedded.communities.length > 0){

          resp._embedded.communities.forEach((community, index)=>{
            let communityInstance = {
              name: community.name,
              url: community.url,
              logo: community._links.logo.href,
              itemCount: community.archivedItemsCount,
              uuid: community.uuid
            };
            this.topLevelCommunities.push(communityInstance);
          });
          this.topLevelCommunities.splice(0, 1);
          this.collectionSpinner = false;
        }
      });
    });

  }

  ngOnDestroy(): void {
    this.routeSub.unsubscribe();
  }
}

