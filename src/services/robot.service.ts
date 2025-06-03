import {Injectable} from '@angular/core';
import {NavigationEnd, Router} from "@angular/router";
import {HttpClient} from "@angular/common/http";
import {delay} from "../utils/delay";

interface Job {
    url: string;
    enable: boolean;
    steps: Step[];
    selector: string;
    isRunning: boolean;
}

interface Step {
    selector: string;
    trigger: 'click' | string;
    delay: number;
    retry?: number;
    value?: string;
}

interface WaitUntil {
    selector: string;
    duration?: number;
}

@Injectable({providedIn: 'root'})
export class RobotService {

    jobs: Job[] = [];
    private _handlers: { [trigger: string]: (step: Step) => Promise<void> } = {};

    constructor(private http: HttpClient, private router: Router) {
    }

    addHandler(trigger: string, action: (step: Step) => Promise<void>): void {
        this._handlers[trigger] = action;
    }

    load(url: string) {
        this.http.get<Job[]>(url).subscribe(res => {
            this.jobs = res;
            this.init();
        });
    }

    private init() {
        this.router.events.subscribe(e => {
            if (e instanceof NavigationEnd) {
                this.processUrl();
            }
        });
        this.processUrl();
    }

    private processUrl() {
        const job = this.jobs.find(x => {
            return (!('enable' in x) || x.enable === true) && this.router.url.startsWith(x.url);
        });
        if (!job) return;
        setTimeout(() => {
            this.runJob(job);
        }, 200);
    }

    private async runJob(job: Job) {
        if (job.isRunning) return;
        const el = document.querySelector(job.selector) as HTMLElement;
        if (!el) return;
        try {
            job.isRunning = true;
            for (let i = 0; i < job.steps.length; i++) {
                const step = job.steps[i];
                await delay(step.delay ?? 100);
                let timer = step.retry ?? 3000;

                do {
                    try {
                        if (this._handlers[step.trigger]) {
                            await this._handlers[step.trigger](step);
                            break;
                        } else {
                            const target = el.querySelector(step.selector) as HTMLElement;
                            if (target) {
                                (target as any)[step.trigger]();
                                break;
                            }
                        }
                        await delay(100);
                        timer -= 100;
                        if (timer < 0) {
                            return;
                        }
                    } catch (ex) {
                        console.error(ex)
                    }
                } while (true)
            }
        } finally {
            job.isRunning = false;
        }
    }
}
