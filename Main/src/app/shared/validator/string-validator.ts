import { AbstractControl, ValidatorFn } from '@angular/forms';

export class StringValidator {

  static confirmedPassword(password: string): ValidatorFn {
    
    return (control: AbstractControl): { [key: string]: boolean } | null => {
      if (control.value && control.value !== control.parent.get(password).value) {
        return { passwordNotMatch: true };
      }
      return null;
    };
  }
  static invalid(): ValidatorFn {
    
    return (control: AbstractControl): { [key: string]: boolean } | null => {
      return { invalid: true };
    };
  }
}
