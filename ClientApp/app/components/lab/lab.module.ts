import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { routes } from './lab.routes';

// Services
import { LabResolver } from './services/labResolver.service'

// Components
import { LabComponent } from './lab.component';

@NgModule({
    imports: [
        CommonModule,
        RouterModule.forChild(routes)
    ],
    declarations: [
        LabComponent
    ],
    exports: [
        LabComponent
    ],
    providers: [ LabResolver ]
})
export class LabModule {
}