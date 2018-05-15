import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { RouterModule } from '@angular/router';

// Import statements for components
import { AppComponent } from './components/app/app.component';
import { BackgroundComponent } from './components/background/background.component';
import { HomeComponent } from './components/home/home.component';
import { ContactComponent } from './components/contact/contact.component';

//import statements for services
import { DeviceDetectorService } from './components/shared/services/device-detector/device-detector.service';

/*
 Declaration for NgModule takes these metadata objects, and tells
 angular how to compile and launch the application. app.browser.module.ts
 has the bootstrap, which is the root component angular takes to create and insert into the host index.html
 i.e. the renderbody.
*/
@NgModule({
    declarations: [
        AppComponent,
        BackgroundComponent,
        HomeComponent,
        ContactComponent
    ],
    providers: [ DeviceDetectorService ],
    imports: [
        CommonModule,
        HttpModule,
        FormsModule,
        RouterModule.forRoot([
            {
                path: '',
                component: HomeComponent,
                pathMatch: 'full',
                data: { state: 'home' }
            },
            {
                path: 'portfolio',
                loadChildren: './components/portfolio/portfolio.module#PortfolioModule',
                data: { state: 'portfolio' }
            },
            {
                path: 'lab',
                loadChildren: './components/lab/lab.module#LabModule',
                data: { state: 'lab' }
            },
            {
                path: 'contact',
                component: ContactComponent,
                data: { state: 'contact' }
            },
            {
                path: '**', // Wild card path is selected when the router does not match any other paths.
                redirectTo: ''
            }
        ])
    ]
})

export class AppModuleShared {
}

/* Idealy this is what the route interface looks like this
export interface Route {
    path?: string;
    pathMatch?: string;
    component?: Type<any>;
    redirectTo?: string;
    outlet?: string;
    canActivate?: any[];
    canActivateChild?: any[];
    canDeactivate?: any[];
    canLoad?: any[];
    data?: Data;
    resolve?: ResolveData;
    children?: Route[];
    loadChildren?: LoadChildren;
}
*/