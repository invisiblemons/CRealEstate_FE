import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NgxUiLoaderService } from 'ngx-ui-loader';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {

  
  constructor(public router: Router, private ngxLoader: NgxUiLoaderService) {}
  
  ngOnInit() {
    //load spin
    this.ngxLoader.startLoader('loader-01'); // start non-master loader
    setTimeout(() => {
      this.ngxLoader.stopLoader('loader-01');
    }, 500);
    //end load spin

  }
}
