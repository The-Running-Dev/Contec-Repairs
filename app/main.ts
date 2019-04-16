import {bootstrap} from '@angular/platform-browser-dynamic';
import {provide, enableProdMode} from '@angular/core';
import {AppConfig} from './app.config';
import {AppComponent} from './app.component';

export function Run(appConfig: AppConfig) {
    // If config was provided, overwrite the defaults
    if (appConfig) {
        // Copy the configuration over the default configuration
        copyConfiguration(appConfig, new AppConfig()).then(function (config: AppConfig) {
            if (config.ProductionMode) {
                enableProdMode();
            }

            startApplication(config);
        });
    }
    else {
        startApplication(new AppConfig());
    }
}

function startApplication(appConfig: AppConfig) {
    bootstrap(AppComponent, [
        provide('app.config', {useValue: appConfig})
    ]).then((success: any) => {
    }).catch((error: any) => console.log(error));
}

function copyConfiguration(source: Object, destination: Object): any {
    return new Promise(function (resolve) {
        Object.keys(source).forEach(function (key) {
            if (typeof(source[key]) === 'object') {
                return copyConfiguration(source[key], destination[key]);
            }

            destination[key] = source[key];

            resolve(destination);
        });
    });
}