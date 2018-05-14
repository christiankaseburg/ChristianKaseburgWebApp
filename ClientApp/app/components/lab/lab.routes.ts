import { Routes } from '@angular/router';
import { LabComponent } from './lab.component';
import { LabResolver } from './services/labResolver.service'

export const routes: Routes = [
    {
        path: '',
        component: LabComponent,
        resolve: {
            experiments: LabResolver
        }
    },
];