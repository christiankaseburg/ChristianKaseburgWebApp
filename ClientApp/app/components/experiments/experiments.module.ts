import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { routes } from './experiments.routes';


import { ExperimentsComponent } from './experiments.component';
import { GodraysExperimentComponent } from './experiment/godraysExperiment/godrays.experiment.component';

@NgModule({
    imports: [
        CommonModule,
        RouterModule.forChild(routes)
    ],
    declarations: [
        ExperimentsComponent,
        GodraysExperimentComponent
    ],
    exports: [
        ExperimentsComponent
    ]
})
export class ExperimentsModule {
}