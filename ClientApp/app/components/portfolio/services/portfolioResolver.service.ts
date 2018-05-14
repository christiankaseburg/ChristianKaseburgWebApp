import { Injectable } from "@angular/core";
import { Http } from '@angular/http';
import { Resolve } from '@angular/router';
import 'rxjs/Rx';
import { Project } from '../models/project';

@Injectable()
export class PortfolioResolver implements Resolve<any> {

    constructor(private http: Http) {

    }

    resolve() {
        console.log('Resolver collecting projects');
        return this.http.get('api/Portfolio/GetProjects')
            .map(resp => resp.json() as Project[])
            .toPromise();
    }
}