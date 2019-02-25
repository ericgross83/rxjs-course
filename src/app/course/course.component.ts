import {AfterViewInit, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {forkJoin, fromEvent, Observable} from 'rxjs';
import {Course} from '../model/course';
import {Lesson} from '../model/lesson';
import {createHttpObservable} from '../common/util';
import {debounceTime, distinctUntilChanged, map, startWith, switchMap, tap} from 'rxjs/operators';
import {debug, RxJsLoggingLevel, setRxJsLoggingLevel} from '../common/debug';


@Component({
    selector: 'course',
    templateUrl: './course.component.html',
    styleUrls: ['./course.component.css']
})
export class CourseComponent implements OnInit, AfterViewInit {

    courseId: number;

    course$: Observable<Course>;

    lessons$: Observable<Lesson[]>;

    @ViewChild('searchInput') input: ElementRef;

    constructor(private route: ActivatedRoute) {


    }

    ngOnInit() {

        this.courseId = this.route.snapshot.params['id'];

        const course$ = createHttpObservable(`/api/courses/${this.courseId}`)
          .pipe(
            debug(RxJsLoggingLevel.INFO, 'course value')
          );

        setRxJsLoggingLevel(RxJsLoggingLevel.TRACE);

        const lessons$ = this.loadLessons();

        forkJoin(course$, lessons$)
          .pipe(
            tap(([course, lessons]) => {
              console.log('course', course);
              console.log('lessons', lessons);
            })
          )
          .subscribe();

    }

    ngAfterViewInit() {

      this.lessons$ = fromEvent<any>(this.input.nativeElement, 'keyup')
        .pipe(
          map(event => event.target.value),
          startWith(''),
          debug(RxJsLoggingLevel.TRACE, 'search'),
          debounceTime(400),
          distinctUntilChanged(),
          switchMap(search => this.loadLessons(search)),
          debug(RxJsLoggingLevel.DEBUG, 'lessons value')
        );

    }

    loadLessons(search = ''): Observable<Lesson[]> {
      return createHttpObservable(`/api/lessons?courseId=${this.courseId}&pageSize=100&filter=${search}`)
        .pipe(map(response => response['payload']));

    }


}
