import {Component, OnInit} from '@angular/core';
import {HttpService} from '../../services/http.service';
import {Iteration} from '../../models/Iteration';
import {FormBuilder} from '@angular/forms';
import {BisectionRequest} from '../../models/BisectionRequest';
import {FalsePositionRequest} from '../../models/FalsePositionRequest';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  iterations: Iteration[] = [];
  result: number;
  response = false;
  error = false;
  msg: string;

  form = this.fb.group({
    tpFormula: [1],
    tpMaterial: [undefined],
    caudal: [undefined],
    error: [undefined],
    diametro: [undefined],
    xi: [undefined],
    xu: [undefined],
    xa: [undefined],
    xb: [undefined],
    xn: [undefined],
    velocidad: [undefined]
  });

  constructor(private httpService: HttpService, private fb: FormBuilder) {
  }

  ngOnInit(): void {
  }

  submit(): void {
    const densidadAgua = 997;
    const viscoAgua = 0.001002;
    const caudal = this.form.value.caudal;
    const diametro = this.form.value.diametro;
    const velocidad = Number(this.form.value.velocidad);
    const coeficineteTub = this.form.value.tpMaterial;

    const diametroM = (diametro * 0.001);
    const numeroReinolds = (1000 * diametroM * velocidad) / viscoAgua;
    const primerOP = (Number(coeficineteTub) / diametro) / 3.7;
    console.log(numeroReinolds);
    const segundaOP = (2.51 / numeroReinolds);


    const formula = `-2*log(${primerOP}+(${segundaOP})*(1/sqrt(x)),10) - (1/sqrt(x))`;
    const formula2 = `-2*log10(${primerOP}+(${segundaOP})*(1/sqrt(x))) - (1/sqrt(x))`;
    // const formula = `-2*log10(0.020290315315315315+(7.67103723847709)*(1/sqrt(x))) - (1/sqrt(x))`;


    switch (Number(this.form.value.tpFormula)) {
      case 1:
        const bisection = new BisectionRequest();
        bisection.xi = this.form.value.xi;
        bisection.xu = this.form.value.xu;
        bisection.equation = formula;
        bisection.errorRange = this.form.value.error;
        this.httpService.bisection(bisection).toPromise().then((r: any) => {
          this.error = false;
          if (r.msg) {
            this.error = true;
            this.msg = r.msg;
          }

          this.response = true;
          this.iterations = r.iterations;
          this.result = r.result;
        });
        break;
      case 2:
        const falsePosition = new FalsePositionRequest();
        falsePosition.equation = formula;
        falsePosition.errorRange = this.form.value.error;
        falsePosition.xa = this.form.value.xa;
        falsePosition.xb = this.form.value.xb;
        this.httpService.falsePostion(falsePosition).toPromise().then((r: any) => {
          this.error = false;
          if (r.msg) {
            this.error = true;
            this.msg = r.msg;
          }

          this.response = true;
          this.iterations = r.iterations;
          this.result = r.result;
        });
        break;
      case 3:
        this.httpService.newtonraphson({
          equation: formula, xn: this.form.value.xn,
          errorRange: this.form.value.error
        }).toPromise().then((r: any) => {
          this.error = false;
          if (r.msg) {
            this.error = true;
            this.msg = r.msg;
          }
          this.response = true;
          this.iterations = r.iterations;
          this.result = r.result;
        });
        break;
    }

  }

}
