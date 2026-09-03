import { Component, OnInit } from '@angular/core';
import { LoaderService } from '../../services/loader.service';

@Component({
  selector: 'loaders-component',
  templateUrl: './loaders.component.html',
  styleUrls: ['./loaders.component.scss'],
})
export class LoadersComponent implements OnInit {
  constructor(private loaderService: LoaderService) {
  }

  isAngularMatLoaderShowed: boolean = false; // начальный лоудер (сейчас не используется)
  isCustomLoaderShowed: boolean = false;

  ngOnInit(): void {
    this.loaderService.isShowed$.subscribe((isShowed: boolean) => {
      this.isCustomLoaderShowed = isShowed;
    });
  }
}
