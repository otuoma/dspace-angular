import { Injectable } from '@angular/core';
import {Subject} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class MkuDataSharingServiceService {
  private communityDataSubject: Subject<string> = new Subject<string>();

  constructor() { }
  setCommunityData(data: string) {
    this.communityDataSubject.next(data);
  }

  getCommunityData() {
    return this.communityDataSubject.asObservable();
  }
}
