import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { routes } from './portfolio.routes';

// Services
import { PortfolioResolver } from './services/portfolioResolver.service'

// Components
import { PortfolioComponent } from './portfolio.component';

@NgModule({
    imports: [
        CommonModule,
        RouterModule.forChild(routes)
    ],
    declarations: [
        PortfolioComponent
    ],
    exports: [
        PortfolioComponent
    ],
    providers: [PortfolioResolver]
})
export class PortfolioModule {
}