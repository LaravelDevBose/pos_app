
import {animate, keyframes, query, stagger, state, style, transition, trigger} from '@angular/animations';

export const fadein = trigger('fadein', [
    state('void', style({opacity: 0})),
    transition('* => *', [
        animate('1s ease-in', style({opacity: 1}))
    ])
]);

export const fadeout = trigger('fadeout', [
    state('void', style({opacity: 1})),
    transition('void => *', [
        style({opacity: 1}),
        animate('1200ms ease-out', style({opacity: 0}))
    ])
]);

export const slideTop = trigger('slideTop', [
    transition('void => *', [
        style({opacity: 0, transform: 'translateY(-150%)'}),
        animate('1000ms 800ms ease-out', style({transform: 'translateY(0%)', opacity: 1},))
    ])
]);
export const slideLeft = trigger('slideLeft', [
    transition('void => *', [
        style({opacity: 0, transform: 'translateX(150%)'}),
        animate('1000ms 800ms ease-out', style({transform: 'translateX(0%)', opacity: 1},))
    ])
]);
export const slideRight = trigger('slideRight', [
    transition('void => *', [
        style({opacity: 0, transform: 'translateX(-150%)'}),
        animate('1000ms 800ms ease-out', style({transform: 'translateX(0%)', opacity: 1},))
    ])
]);

export const listAnimation = trigger('listAnimation', [
    transition('* => *', [

        query(':enter', style({ opacity: 0 }), {optional: true}),

        query(':enter', stagger('300ms', [
            animate('1s ease-in', keyframes([
                style({opacity: 0, transform: 'translateY(-75%)', offset: 0}),
                style({opacity: .5, transform: 'translateY(35px)',  offset: 0.3}),
                style({opacity: 1, transform: 'translateY(0)',     offset: 1.0}),
            ]))]), {optional: true}),

        /*query(':leave', stagger('300ms', [
            animate('1s ease-in', keyframes([
                style({opacity: 1, transform: 'translateY(0)', offset: 0}),
                style({opacity: .5, transform: 'translateY(35px)',  offset: 0.3}),
                style({opacity: 0, transform: 'translateY(-75%)',     offset: 1.0}),
            ]))]), {optional: true})*/
    ])
])