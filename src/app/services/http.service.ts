import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {BisectionRequest} from '../models/BisectionRequest';
import {FalsePositionRequest} from '../models/FalsePositionRequest';


@Injectable({
  providedIn: 'root'
})
export class HttpService {

  constructor(private http: HttpClient) { }

  bisection(bisection: BisectionRequest){
    return this.http.post(`http://localhost:5000/bisection`, bisection);
  }

  falsePostion(falsePosition: FalsePositionRequest){
    return this.http.post(`http://localhost:5000/falseposition`, falsePosition);
  }

  newtonraphson(falsePosition: any){
    return this.http.post(`http://localhost:5000/newtonraphson`, falsePosition);
  }
}
