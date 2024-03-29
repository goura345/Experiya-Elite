import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';

// fake backend
import { fakeBackendInterceptor } from '@app/_helpers';

import { AppComponent } from '@app/app.component';
import { jwtInterceptor, errorInterceptor } from '@app/_helpers';
import { APP_ROUTES } from '@app/app.routes';
import { environment } from '@environments/environment';
import { enableProdMode } from '@angular/core';
import { provideAnimations } from '@angular/platform-browser/animations';

if (environment.production) {
    enableProdMode();
  }

bootstrapApplication(AppComponent, {
    providers: [
    provideRouter(APP_ROUTES),
    provideHttpClient(withInterceptors([
        jwtInterceptor,
        errorInterceptor,
        // fake backend
        // fakeBackendInterceptor
    ])),
    provideAnimations()
]
});
