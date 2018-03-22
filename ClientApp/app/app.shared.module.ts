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
import { ExperimentsComponent } from './components/experiments/experiments.component';
import { ContactComponent } from './components/contact/contact.component';

//import statements for services
import { DeviceDetectorService } from './services/shared/device-detector/device-detector.service'

/*
 Declaration for NgModsule takes these metadata objects, and tells
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
        ExperimentsComponent,
        ContactComponent
    ],
    providers: [ DeviceDetectorService ],
    imports: [
        CommonModule,
        HttpModule,
        FormsModule,
        RouterModule.forRoot([
            { path: '', redirectTo: 'home', pathMatch: 'full' },
            { path: 'home', component: HomeComponent, data: { state: 'home' } },
            { path: 'portfolio', component: PortfolioComponent, data: { state: 'portfolio' } },
            { path: 'experiments', component: ExperimentsComponent, data: { state: 'experiments' } },
            { path: 'experiments/godrays', component: BackgroundComponent },
            { path: 'contact', component: ContactComponent, data: { state: 'contact' } },
            { path: '**', redirectTo: 'home' }
        ])
    ]
})

export class AppModuleShared {
}
