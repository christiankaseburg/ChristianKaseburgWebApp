import { Routes } from '@angular/router';
import { ExperimentsComponent } from './experiments.component';

import { GodraysExperimentComponent } from './experiment/godraysExperiment/godrays.experiment.component';

export const routes: Routes = [
    {
        path: '',
        component: ExperimentsComponent
    },
    {
        path: 'godrays',
        component: GodraysExperimentComponent
    },
];