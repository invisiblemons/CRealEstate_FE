import { Directive, HostListener, ElementRef } from "@angular/core";

@Directive({
  selector: "[appInputRestriction]",
})
export class InputRestrictionDirective {
  constructor(private el: ElementRef) {}

  @HostListener("keydown", ["$event"])
  onKeyDown(event: KeyboardEvent) {
    if (this.el.nativeElement.selectionStart === 0 && event.key === " ") {
      event.preventDefault();
    }
  }
}
