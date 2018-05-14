import { Routes } from '@angular/router';
import { PortfolioComponent } from './portfolio.component';
import { PortfolioResolver } from './services/portfolioResolver.service'

export const routes: Routes = [
    {
        path: '',
        component: PortfolioComponent,
        resolve: {
            projects: PortfolioResolver
        }
    }
];