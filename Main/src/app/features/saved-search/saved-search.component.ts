import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ReloadRouteService } from 'src/app/shared/services/reload-route.service';
import { Request } from './saved-search.model';
import { SavedSearchService } from './saved-search.service';
import swal from 'sweetalert2';

@Component({
  selector: 'app-saved-search',
  templateUrl: './saved-search.component.html',
  styleUrls: ['./saved-search.component.scss'],
})
export class SavedSearchComponent implements OnInit {
  isShowSkeleton = true;

  requests: Request[] = [];

  isEmpty = false;

  selectedUpdateMethod: any;
  updateMethods: any;

  constructor(
    private reloadRouteService: ReloadRouteService,
    private savedSearchService: SavedSearchService,
    private router: Router
  ) {
    this.updateMethods = [
      { label: 'Ngay khi có mặt bằng', value: 0 },
      { label: '7:00 sáng mỗi ngày', value: 1 },
    ];
  }

  ngOnInit(): void {
    this.savedSearchService.getSavedSearch().subscribe((requests) => {
      this.requests = requests;
      this.requests.forEach((request) => {
        if (request.amount === 0) {
          request.selectedUpdateMethod = {
            label: 'Ngay khi có mặt bằng',
            value: 0,
          };
        } else if (request.amount === 1) {
          request.selectedUpdateMethod = {
            label: '7:00 sáng mỗi ngày',
            value: 0,
          };
        }
      });
      if (this.requests.length === 0) {
        this.isEmpty = true;
      }
      this.isShowSkeleton = false;
    });
  }

  changeUpdateMethod(event, request) {
    request.amount = event.value.value;
    this.savedSearchService.updateSavedSearch(request).subscribe((res) => {
      swal.fire({
        title: 'Thành công!',
        text: 'Đã cập nhật tần suất.',
        icon: 'success',
        customClass: {
          confirmButton: 'btn btn-success animation-on-hover',
        },
        buttonsStyling: false,
        timer: 2000,
      });
    });
  }

  deleteSavedSearch(request) {
    swal
      .fire({
        title: 'Bạn có chắc muốn xoá?',
        text: 'Tìm kiếm này sẽ bị xoá!',
        icon: 'warning',
        showCancelButton: true,
        cancelButtonText: 'Không, giữ nguyên',
        confirmButtonText: 'Có, xoá nó!',
        customClass: {
          cancelButton: 'btn btn-default animation-on-hover',
          confirmButton: 'btn btn-danger animation-on-hover mr-1',
        },
        buttonsStyling: false,
      })
      .then((result) => {
        if (result.value) {
          request.status = 0;
          this.savedSearchService
            .updateSavedSearch(request)
            .subscribe((res) => {
              this.requests = this.requests.filter(
                (requestItem: Request) => request.id !== requestItem.id
              );
              swal.fire({
                title: 'Đã xoá!',
                text: 'Đã xoá thành công.',
                icon: 'success',
                customClass: {
                  confirmButton: 'btn btn-success animation-on-hover',
                },
                buttonsStyling: false,
                timer: 2000,
              });
            });
        }
      });
  }

  routingToSearchResults(request) {
    this.reloadRouteService.routingReload('/tim-kiem-nang-cao', request.id);
  }
}
