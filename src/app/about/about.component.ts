import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import {concat, interval, noop, of} from 'rxjs';
import {createHttpObservable} from '../common/util';
import {map} from 'rxjs/operators';

@Component({
  selector: 'about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.css']
})
export class AboutComponent implements OnInit {

  ngOnInit() {

    const  interval1$ = interval(1000);

    const subscribtionObject = interval1$
      .pipe(
        map(value => value + 1)
      )
      .subscribe(console.log);

    setTimeout(() => subscribtionObject.unsubscribe(), 5000);

  }



}


