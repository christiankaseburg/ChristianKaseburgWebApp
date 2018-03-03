import { PLATFORM_ID, Inject, Injectable, Injector } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import * as Constants from './device-detector.constants';

export interface DeviceInfo {
    userAgent: string;
    os: string;
    browser: string;
    device: string;
    os_version: string;
    browser_version: string;
    mobile: boolean;
}

@Injectable()

export class DeviceDetectorService {
    userAgent: string;
    os: string;
    browser: string;
    device: string;
    os_version: string;
    mobile: boolean;
    browser_version: string = '0';

    public setDeviceInfo() {
        this.userAgent = window.navigator.userAgent;

        let mappings = [
            { const: 'OS', prop: 'os' },
            { const: 'BROWSERS', prop: 'browser' },
            { const: 'DEVICES', prop: 'device' },
            { const: 'OS_VERSIONS', prop: 'os_version' },
        ];

        mappings.forEach((mapping) => {
            this[mapping.prop] = Object.keys(Constants[mapping.const]).reduce((obj: any, item: any) => {
                obj[Constants[mapping.const][item]] = this.test(this.userAgent, Constants[`${mapping.const}_RE`][item]);
                return obj;
            }, {});
        });

        mappings.forEach((mapping) => {
            this[mapping.prop] = Object.keys(Constants[mapping.const])
                .map((key) => {
                    return Constants[mapping.const][key];
                }).reduce((previousValue, currentValue) => {
                    return (previousValue === Constants[mapping.const].UNKNOWN && this[mapping.prop][currentValue])
                        ? currentValue : previousValue;
                }, Constants[mapping.const].UNKNOWN);
        });

        this.mobile = this.isMobile();

        if (this.browser !== Constants.BROWSERS.UNKNOWN) {
            let re = Constants.BROWSER_VERSIONS_RE[this.browser];
            let res = this.exec(this.userAgent, re);
            if (!!res) {
                this.browser_version = res[1];
            }
        }
    }

    public getDeviceInfo(): DeviceInfo {
        const deviceInfo: DeviceInfo = {
            userAgent: this.userAgent,
            os: this.os,
            browser: this.browser,
            device: this.device,
            os_version: this.os_version,
            browser_version: this.browser_version,
            mobile: this.mobile
        };
        return deviceInfo;
    }

    public isMobile(): boolean {
        return [
            Constants.DEVICES.ANDROID,
            Constants.DEVICES.IPHONE,
            Constants.DEVICES.I_POD,
            Constants.DEVICES.BLACKBERRY,
            Constants.DEVICES.FIREFOX_OS,
            Constants.DEVICES.WINDOWS_PHONE,
            Constants.DEVICES.VITA
        ].some((item) => {
            return this.device === item;
        });
    };

    public isTablet() {
        return [
            Constants.DEVICES.I_PAD,
            Constants.DEVICES.FIREFOX_OS
        ].some((item) => {
            return this.device === item;
        });
    };

    public isDesktop() {
        return [
            Constants.DEVICES.PS4,
            Constants.DEVICES.CHROME_BOOK,
            Constants.DEVICES.UNKNOWN
        ].some((item) => {
            return this.device === item;
        });
    };

    public test(string: string, regex: any): any {
        let self = this;
        if (typeof regex === 'string') {
            regex = new RegExp(regex);
        }

        if (regex instanceof RegExp) {
            return regex.test(string);
        } else if (regex && Array.isArray(regex.and)) {
            return regex.and.every(function (item: any) {
                return self.test(string, item);
            });
        } else if (regex && Array.isArray(regex.or)) {
            return regex.or.some(function (item: any) {
                return self.test(string, item);
            });
        } else if (regex && regex.not) {
            return !self.test(string, regex.not);
        } else {
            return false;
        }
    }

    public exec(string: string, regex: any): any {
        let self = this;
        if (typeof regex === 'string') {
            regex = new RegExp(regex);
        }

        if (regex instanceof RegExp) {
            return regex.exec(string);
        } else if (regex && Array.isArray(regex)) {
            return regex.reduce(function (res: any, item: any) {
                return (!!res) ? res : self.exec(string, item);
            }, null);
        } else {
            return null;
        }
    }
}