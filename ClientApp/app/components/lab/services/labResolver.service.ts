import { Injectable } from "@angular/core";
import { Http } from '@angular/http';
import { Resolve } from '@angular/router';
import 'rxjs/Rx';
import { Experiment } from '../models/experiment.model'


@Injectable()
export class LabResolver implements Resolve<any> {

    constructor(private http: Http) {

    }

    resolve() {
        console.log('Resolver collecting experiments');
        return this.http.get('api/Lab/GetExperiments')
            .map(resp => resp.json() as Experiment[])
            .toPromise();
    }
}