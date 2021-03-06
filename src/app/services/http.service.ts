import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {BisectionRequest} from '../models/BisectionRequest';


@Injectable({
  providedIn: 'root'
})
export class HttpService {

  constructor(private http: HttpClient) { }

  bisection(bisection: BisectionRequest){
    return this.http.post(`http://localhost:5000/bisection`, bisection);
  }
}
