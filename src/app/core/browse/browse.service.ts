import { Injectable } from '@angular/core';
import { Observable, of as observableOf } from 'rxjs';
import { distinctUntilChanged, map, startWith, take } from 'rxjs/operators';
import {
  ensureArrayHasValue, hasValue,
  hasValueOperator,
  isEmpty,
  isNotEmpty,
  isNotEmptyOperator
} from '../../shared/empty.util';
import { RemoteDataBuildService } from '../cache/builders/remote-data-build.service';
import { GenericSuccessResponse } from '../cache/response-cache.models';
import { ResponseCacheEntry } from '../cache/response-cache.reducer';
import { ResponseCacheService } from '../cache/response-cache.service';
import { PaginatedList } from '../data/paginated-list';
import { RemoteData } from '../data/remote-data';
import {
  BrowseEndpointRequest,
  BrowseEntriesRequest,
  BrowseItemsRequest,
  RestRequest
} from '../data/request.models';
import { RequestService } from '../data/request.service';
import { BrowseDefinition } from '../shared/browse-definition.model';
import { BrowseEntry } from '../shared/browse-entry.model';
import { HALEndpointService } from '../shared/hal-endpoint.service';
import {
  configureRequest,
  filterSuccessfulResponses, getBrowseDefinitionLinks, getFirstOccurrence,
  getRemoteDataPayload,
  getRequestFromSelflink,
  getResponseFromSelflink
} from '../shared/operators';
import { URLCombiner } from '../url-combiner/url-combiner';
import { Item } from '../shared/item.model';
import { DSpaceObject } from '../shared/dspace-object.model';
import { BrowseEntrySearchOptions } from './browse-entry-search-options.model';

/**
 * The service handling all browse requests
 */
@Injectable()
export class BrowseService {
  protected linkPath = 'browses';

  private static toSearchKeyArray(metadatumKey: string): string[] {
    const keyParts = metadatumKey.split('.');
    const searchFor = [];
    searchFor.push('*');
    for (let i = 0; i < keyParts.length - 1; i++) {
      const prevParts = keyParts.slice(0, i + 1);
      const nextPart = [...prevParts, '*'].join('.');
      searchFor.push(nextPart);
    }
    searchFor.push(metadatumKey);
    return searchFor;
  }

  constructor(
    protected responseCache: ResponseCacheService,
    protected requestService: RequestService,
    protected halService: HALEndpointService,
    private rdb: RemoteDataBuildService,
  ) {
  }

  /**
   * Get all BrowseDefinitions
   */
  getBrowseDefinitions(): Observable<RemoteData<BrowseDefinition[]>> {
    const request$ = this.halService.getEndpoint(this.linkPath).pipe(
      isNotEmptyOperator(),
      distinctUntilChanged(),
      map((endpointURL: string) => new BrowseEndpointRequest(this.requestService.generateRequestId(), endpointURL)),
      configureRequest(this.requestService)
    );

    const href$ = request$.pipe(map((request: RestRequest) => request.href));
    const requestEntry$ = href$.pipe(getRequestFromSelflink(this.requestService));
    const responseCache$ = href$.pipe(getResponseFromSelflink(this.responseCache));
    const payload$ = responseCache$.pipe(
      filterSuccessfulResponses(),
      map((entry: ResponseCacheEntry) => entry.response),
      map((response: GenericSuccessResponse<BrowseDefinition[]>) => response.payload),
      ensureArrayHasValue(),
      map((definitions: BrowseDefinition[]) => definitions
        .map((definition: BrowseDefinition) => Object.assign(new BrowseDefinition(), definition))),
      distinctUntilChanged()
    );

    return this.rdb.toRemoteDataObservable(requestEntry$, responseCache$, payload$);
  }

  /**
   * Get all BrowseEntries filtered or modified by BrowseEntrySearchOptions
   * @param options
   */
  getBrowseEntriesFor(options: BrowseEntrySearchOptions): Observable<RemoteData<PaginatedList<BrowseEntry>>> {
    return this.getBrowseDefinitions().pipe(
      getBrowseDefinitionLinks(options.metadataDefinition),
      hasValueOperator(),
      map((_links: any) => _links.entries),
      hasValueOperator(),
      map((href: string) => {
        // TODO nearly identical to PaginatedSearchOptions => refactor
        const args = [];
        if (isNotEmpty(options.sort)) {
          args.push(`scope=${options.scope}`);
        }
        if (isNotEmpty(options.sort)) {
          args.push(`sort=${options.sort.field},${options.sort.direction}`);
        }
        if (isNotEmpty(options.pagination)) {
          args.push(`page=${options.pagination.currentPage - 1}`);
          args.push(`size=${options.pagination.pageSize}`);
        }
        if (isNotEmpty(options.startsWith)) {
          args.push(`startsWith=${options.startsWith}`);
        }
        if (isNotEmpty(args)) {
          href = new URLCombiner(href, `?${args.join('&')}`).toString();
        }
        return href;
      }),
      getBrowseEntriesFor(this.requestService, this.responseCache, this.rdb)
    );
  }

  /**
   * Get all items linked to a certain metadata value
   * @param {string} filterValue      metadata value to filter by (e.g. author's name)
   * @param options                   Options to narrow down your search
   * @returns {Observable<RemoteData<PaginatedList<Item>>>}
   */
  getBrowseItemsFor(filterValue: string, options: BrowseEntrySearchOptions): Observable<RemoteData<PaginatedList<Item>>> {
    return this.getBrowseDefinitions().pipe(
      getBrowseDefinitionLinks(options.metadataDefinition),
      hasValueOperator(),
      map((_links: any) => _links.items),
      hasValueOperator(),
      map((href: string) => {
        const args = [];
        if (isNotEmpty(options.sort)) {
          args.push(`scope=${options.scope}`);
        }
        if (isNotEmpty(options.sort)) {
          args.push(`sort=${options.sort.field},${options.sort.direction}`);
        }
        if (isNotEmpty(options.pagination)) {
          args.push(`page=${options.pagination.currentPage - 1}`);
          args.push(`size=${options.pagination.pageSize}`);
        }
        if (isNotEmpty(options.startsWith)) {
          args.push(`startsWith=${options.startsWith}`);
        }
        if (isNotEmpty(filterValue)) {
          args.push(`filterValue=${filterValue}`);
        }
        if (isNotEmpty(args)) {
          href = new URLCombiner(href, `?${args.join('&')}`).toString();
        }
        return href;
      }),
      getBrowseItemsFor(this.requestService, this.responseCache, this.rdb)
    );
  }

  /**
   * Get the first item for a metadata definition in an optional scope
   * @param definition
   * @param scope
   */
  getFirstItemFor(definition: string, scope?: string): Observable<RemoteData<Item>> {
    return this.getBrowseDefinitions().pipe(
      getBrowseDefinitionLinks(definition),
      hasValueOperator(),
      map((_links: any) => _links.items),
      hasValueOperator(),
      map((href: string) => {
        const args = [];
        if (hasValue(scope)) {
          args.push(`scope=${scope}`);
        }
        args.push('page=0');
        args.push('size=1');
        if (isNotEmpty(args)) {
          href = new URLCombiner(href, `?${args.join('&')}`).toString();
        }
        return href;
      }),
      getBrowseItemsFor(this.requestService, this.responseCache, this.rdb),
      getFirstOccurrence()
    );
  }

  /**
   * Get the previous page using the paginated list's prev link
   * @param items
   */
  getPrevBrowseItems(items: RemoteData<PaginatedList<Item>>): Observable<RemoteData<PaginatedList<Item>>> {
    return observableOf(items.payload.prev).pipe(
      getBrowseItemsFor(this.requestService, this.responseCache, this.rdb)
    );
  }

  /**
   * Get the next page using the paginated list's next link
   * @param items
   */
  getNextBrowseItems(items: RemoteData<PaginatedList<Item>>): Observable<RemoteData<PaginatedList<Item>>> {
    return observableOf(items.payload.next).pipe(
      getBrowseItemsFor(this.requestService, this.responseCache, this.rdb)
    );
  }

  /**
   * Get the browse URL by providing a metadatum key and linkPath
   * @param metadatumKey
   * @param linkPath
   */
  getBrowseURLFor(metadatumKey: string, linkPath: string): Observable<string> {
    const searchKeyArray = BrowseService.toSearchKeyArray(metadatumKey);
    return this.getBrowseDefinitions().pipe(
      getRemoteDataPayload(),
      map((browseDefinitions: BrowseDefinition[]) => browseDefinitions
        .find((def: BrowseDefinition) => {
          const matchingKeys = def.metadataKeys.find((key: string) => searchKeyArray.indexOf(key) >= 0);
          return isNotEmpty(matchingKeys);
        })
      ),
      map((def: BrowseDefinition) => {
        if (isEmpty(def) || isEmpty(def._links) || isEmpty(def._links[linkPath])) {
          throw new Error(`A browse endpoint for ${linkPath} on ${metadatumKey} isn't configured`);
        } else {
          return def._links[linkPath];
        }
      }),
      startWith(undefined),
      distinctUntilChanged()
    );
  }

}

/**
 * Operator for turning a href into a PaginatedList of BrowseEntries
 * @param requestService
 * @param responseCache
 * @param rdb
 */
export const getBrowseEntriesFor = (requestService: RequestService, responseCache: ResponseCacheService, rdb: RemoteDataBuildService) =>
  (source: Observable<string>): Observable<RemoteData<PaginatedList<BrowseEntry>>> =>
    source.pipe(
      map((href: string) => new BrowseEntriesRequest(requestService.generateRequestId(), href)),
      configureRequest(requestService),
      toRDPaginatedBrowseEntries(requestService, responseCache, rdb)
    );

/**
 * Operator for turning a href into a PaginatedList of Items
 * @param requestService
 * @param responseCache
 * @param rdb
 */
export const getBrowseItemsFor = (requestService: RequestService, responseCache: ResponseCacheService, rdb: RemoteDataBuildService) =>
  (source: Observable<string>): Observable<RemoteData<PaginatedList<Item>>> =>
    source.pipe(
      map((href: string) => new BrowseItemsRequest(requestService.generateRequestId(), href)),
      configureRequest(requestService),
      toRDPaginatedBrowseItems(requestService, responseCache, rdb)
    );

/**
 * Operator for turning a RestRequest into a PaginatedList of Items
 * @param requestService
 * @param responseCache
 * @param rdb
 */
export const toRDPaginatedBrowseItems = (requestService: RequestService, responseCache: ResponseCacheService, rdb: RemoteDataBuildService) =>
  (source: Observable<RestRequest>): Observable<RemoteData<PaginatedList<Item>>> => {
    const href$ = source.pipe(map((request: RestRequest) => request.href));

    const requestEntry$ = href$.pipe(getRequestFromSelflink(requestService));
    const responseCache$ = href$.pipe(getResponseFromSelflink(responseCache));

    const payload$ = responseCache$.pipe(
      filterSuccessfulResponses(),
      map((entry: ResponseCacheEntry) => entry.response),
      map((response: GenericSuccessResponse<Item[]>) => new PaginatedList(response.pageInfo, response.payload)),
      map((list: PaginatedList<Item>) => Object.assign(list, {
        page: list.page ? list.page.map((item: DSpaceObject) => Object.assign(new Item(), item)) : list.page
      })),
      distinctUntilChanged()
    );

    return rdb.toRemoteDataObservable(requestEntry$, responseCache$, payload$);
  };

/**
 * Operator for turning a RestRequest into a PaginatedList of BrowseEntries
 * @param requestService
 * @param responseCache
 * @param rdb
 */
export const toRDPaginatedBrowseEntries = (requestService: RequestService, responseCache: ResponseCacheService, rdb: RemoteDataBuildService) =>
  (source: Observable<RestRequest>): Observable<RemoteData<PaginatedList<BrowseEntry>>> => {
    const href$ = source.pipe(map((request: RestRequest) => request.href));

    const requestEntry$ = href$.pipe(getRequestFromSelflink(requestService));
    const responseCache$ = href$.pipe(getResponseFromSelflink(responseCache));

    const payload$ = responseCache$.pipe(
      filterSuccessfulResponses(),
      map((entry: ResponseCacheEntry) => entry.response),
      map((response: GenericSuccessResponse<BrowseEntry[]>) => new PaginatedList(response.pageInfo, response.payload)),
      map((list: PaginatedList<BrowseEntry>) => Object.assign(list, {
        page: list.page ? list.page.map((entry: BrowseEntry) => Object.assign(new BrowseEntry(), entry)) : list.page
      })),
      distinctUntilChanged()
    );

    return rdb.toRemoteDataObservable(requestEntry$, responseCache$, payload$);
  };
