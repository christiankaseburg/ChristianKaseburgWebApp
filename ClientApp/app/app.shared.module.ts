import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { RouterModule } from '@angular/router';

// Import statements for components
import { AppComponent } from './components/app/app.component';
import { BackgroundComponent } from './components/background/background.component';
import { HomeComponent } from './components/home/home.component';
import { PortfolioComponent } from './components/portfolio/portfolio.component';
import { ContactComponent } from './components/contact/contact.component';

//import statements for services
import { DeviceDetectorService } from './services/shared/device-detector/device-detector.service';

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
        PortfolioComponent,
        ContactComponent
    ],
    providers: [ DeviceDetectorService ],
    imports: [
        CommonModule,
        HttpModule,
        FormsModule,
        RouterModule.forRoot([
            { path: '', component: HomeComponent, pathMatch: 'full', data: { state: 'home' } },
            { path: 'portfolio', component: PortfolioComponent, data: { state: 'portfolio' } },
            {
                path: 'experiments',
                loadChildren: './components/experiments/experiments.module#ExperimentsModule',
                data: { state: 'experiments' }
            },
            { path: 'contact', component: ContactComponent, data: { state: 'contact' } },
            { path: '**', redirectTo: '' }
        ])
    ]
})

export class AppModuleShared {
}
