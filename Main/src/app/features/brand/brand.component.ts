import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { Subject, switchMap, takeUntil } from 'rxjs';
import { Industry } from 'src/app/shared/models/industry.model';
import { IndustryService } from 'src/app/shared/services/industry.service';
import { ReloadRouteService } from 'src/app/shared/services/reload-route.service';
import { LocalStorageService } from '../authen-page/local-storage.service';
import { Brand } from './brand.model';
import { BrandService } from './brand.service';

@Component({
  selector: 'app-brand',
  templateUrl: './brand.component.html',
  styleUrls: ['./brand.component.scss'],
})
export class BrandComponent implements OnInit, OnDestroy {
  destroySubs$: Subject<boolean> = new Subject<boolean>();

  isShowSkeleton: boolean;

  //brand
  brand: Brand;

  //industry
  industry: Industry;

  industries: Industry[] = [];

  selectedIndustry: Industry;

  constructor(
    private brandServices: BrandService,
    private industryServices: IndustryService,
    private localStorage: LocalStorageService,
    private reloadService: ReloadRouteService,
    private ref: ChangeDetectorRef,
  ) {
    this.isShowSkeleton = true;
  }

  ngOnInit(): void {
    this.brand = this.localStorage.getUserObject();
    this.industryServices.getIndustries().subscribe((industries) => {
      this.industries = industries;
      this.brand = this.updateIndustry(this.brand);
      this.isShowSkeleton = false;
      this.ref.detectChanges();
    });
  }

  ngOnDestroy() {
    // Unsubscribe from the subject
    this.destroySubs$.next(true);
    this.destroySubs$.unsubscribe();
  }

  //data functions
  getIndustry(brand: Brand): Industry {
    for (let i = 0; i < this.industries.length; i++) {
      if (brand.industryId === this.industries[i].id) {
        return this.industries[i];
      }
    }
    return;
  }
  updateIndustry(brand: Brand): Brand {
    let industry = this.getIndustry(brand);
    if (industry) {
      brand.industry = industry;
      brand.industryName = industry.name;
    }
    return brand;
  }

  editProfile() {
    this.reloadService.routingNotReload('/ho-so/chinh-sua', null);
  }

  changePassword() {
    this.reloadService.routingNotReload('/ho-so/doi-mat-khau', null);
  }
}
