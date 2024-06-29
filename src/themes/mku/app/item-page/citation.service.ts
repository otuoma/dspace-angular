import { Injectable } from '@angular/core';
import { Cite } from '@citation-js/core';

@Injectable({
  providedIn: 'root'
})
export class CitationService {

  generateCitation(data: any, style: string = 'apa'): string {
    const cite = new Cite(data);
    return '';
  }
}
