import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { throwError as observableThrowError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { environment } from '../../environments/environment';

@Injectable()
export class ConfigurationService {
  // private instance variable to hold base url
  private CATEGORY_URL = environment.BASE_URL + 'category';
  constructor(private http: HttpClient) { }


  /**
   *   GET  | /foglamp/category
   */
  getCategories() {
    return this.http.get(this.CATEGORY_URL).pipe(
      map(response => response),
      catchError((error: Response) => observableThrowError(error)));
  }

  /**
   *   GET  | /foglamp/category/{categoryName}
   */
  getCategory(categoryName) {
    return this.http.get(this.CATEGORY_URL + '/' + categoryName).pipe(
      map(response => response),
      catchError((error: Response) => observableThrowError(error)));
  }

  /**
   *   GET  | /foglamp/category/{categoryName}/children
   */
  getChildren(categoryName) {
    return this.http.get(this.CATEGORY_URL + '/' + categoryName + '/children').pipe(
      map(response => response),
      catchError((error: Response) => observableThrowError(error)));
  }

  /**
   *   GET  | /foglamp/category
   *   @param root boolean type
   */
  getRootCategories() {
    let params = new HttpParams();
    params = params.set('root', 'true');
    return this.http.get(this.CATEGORY_URL, { params: params }).pipe(
      map(response => response),
      catchError((error: Response) => observableThrowError(error)));
  }

  /**
  *  PUT  | /foglamp/category/{categoryName}/{config_item}
  */
  saveConfigItem(categoryName: string, configItem: string, value: string, type: string) {
    let body = JSON.stringify({ 'value': value });
    if (type.toUpperCase() === 'JSON') {
      body = JSON.stringify({ 'value': JSON.parse(value) });
    }
    return this.http.put(this.CATEGORY_URL + '/' + categoryName + '/' + configItem, body).pipe(
      map(response => response),
      catchError((error: Response) => observableThrowError(error)));
  }

  /**
  *  POST  | /foglamp/category/{categoryName}/{config_item}
  */
  addNewConfigItem(configItemData, categoryName: string, configItem: string) {
    return this.http.post(this.CATEGORY_URL + '/' + categoryName + '/' + configItem, configItemData).pipe(
      map(response => response),
      catchError((error: Response) => observableThrowError(error)));
  }

  /**
  *  POST  | /foglamp/category/{categoryName}/children
  */
  addChild(categoryName, child) {
    return this.http.post(this.CATEGORY_URL + '/' + categoryName + '/children', JSON.stringify({ children: child })).pipe(
      map(response => response),
      catchError((error: Response) => observableThrowError(error)));
  }

  /**
  *  DELETE  | /foglamp/category/{category_name}/children/{childCategory}
  */
  deleteChild(categoryName, child) {
    return this.http.delete(this.CATEGORY_URL + '/' + categoryName + '/children/' + child).pipe(
      map(response => response),
      catchError((error: Response) => observableThrowError(error)));
  }
}
