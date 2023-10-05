import { Component, OnInit} from '@angular/core';
import { HomeNewsComponent as BaseComponent } from '../../../../../app/home-page/home-news/home-news.component';
// import { Observable, throwError } from 'rxjs';
// import { catchError, retry } from 'rxjs/operators';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';

@Component({
  selector: 'ds-home-news',
  styleUrls: ['../../../../../app/home-page/home-news/home-news.component.scss'],
  templateUrl: './home-news.component.html'
})
export class HomeNewsComponent extends BaseComponent implements OnInit{
  communityModel = {
    name: undefined,
    url: undefined,
    image: undefined,
  };
  topLevelCommunities: [{
    name: string,
    url: string,
    logo: string,
    itemCount: number,
    uuid: string
  }] = [{name: '', url: '', logo: '', itemCount: 0, uuid: ''}];
  baseUrl = 'https://repositorio.arcoiris.edu.pe';
  constructor(private httpClient: HttpClient) {
    super();
  }

  getTopLevelCollections(): Observable<any> {
    return this.httpClient.get<any>(
      `${this.baseUrl}/server/api/core/communities/search/top?page=0&size=5&sort=dc.title,ASC`
    );
  }

  ngOnInit(): void {
    this.getTopLevelCollections().subscribe(resp=>{

      console.log('====================');
      console.log(resp);
      console.log('====================');

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
      }
    });

    console.log('=======OnInit=======');
    console.log(this.topLevelCommunities);
    console.log('====================');
  }
}

