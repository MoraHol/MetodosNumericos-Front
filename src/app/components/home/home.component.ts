import {Component, OnInit} from '@angular/core';
import {HttpService} from '../../services/http.service';
import {Iteration} from '../../models/Iteration';
import {FormBuilder} from '@angular/forms';
import {BisectionRequest} from '../../models/BisectionRequest';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  iterations: Iteration[] = [];
  result: number;
  response = false;

  form = this.fb.group({
    tpMaterial: [undefined],
    caudal: [undefined],
    error: [undefined],
    diametro: [undefined],
    xi: [undefined],
    xu: [undefined]
  });

  constructor(private httpService: HttpService, private fb: FormBuilder) {
  }

  ngOnInit(): void {
  }

  submit(): void {
    const densidadAgua = 997;
    const viscoAgua = 1.002;
    const caudal = this.form.value.caudal;
    const diametro = this.form.value.diametro;

    const coeficineteTub = this.form.value.tpMaterial;


    const numeroReinolds = (4 * caudal) / (Math.PI * 12 * viscoAgua);
    const primerOP = (coeficineteTub / diametro) / 3.7;

    const segundaOP = (2.51 / numeroReinolds);

    const formula = `-2*log10(${primerOP}+(${segundaOP})*(1/sqrt(x))) - (1/sqrt(x))`;
    // const formula = `-2*log10(0.020290315315315315+(7.67103723847709)*(1/sqrt(x))) - (1/sqrt(x))`;
    const bisection = new BisectionRequest();
    bisection.xi = this.form.value.xi;
    bisection.xu = this.form.value.xu;
    bisection.equation = formula;
    bisection.errorRange = this.form.value.error;
    this.httpService.bisection(bisection).toPromise().then((r: any) => {
      this.response = true;
      this.iterations = r.iterations;
      this.result = r.result;
    });
  }

}
