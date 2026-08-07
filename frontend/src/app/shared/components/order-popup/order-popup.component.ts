import { Component } from '@angular/core';
import { FormBuilder, Validators } from "@angular/forms";
import { MatSnackBar } from "@angular/material/snack-bar";

@Component({
  selector: 'order-popup',
  templateUrl: './order-popup.component.html',
  styleUrls: ['./order-popup.component.scss']
})
export class OrderPopupComponent {

  isVisible = true;
  servicesList: string[] = [
    '',
    'Разработка сайта',
    'Дизайн интерфейсов',
    'Маркетинговое продвижение',
    'Техническая поддержка'
  ];  // #TODO реализовать через запрос на сервер
  isSubmitted = false; // для перевода кнопки в disable после первого нажатия (в сценарии, когда форма не тронута)
  isRequestError = false;

  orderForm = this.fb.group({
    service: ['', [Validators.required]],
    name: ['', Validators.required],
    phone: ['', [Validators.required]],
  });

  constructor(private fb: FormBuilder,
              private snackBar: MatSnackBar,
              ) {
  }

  isFieldInvalid(fieldName: string): boolean {
    const input = this.orderForm.get(fieldName);
    return !!(input && input.invalid && (input.dirty || input.touched || this.isSubmitted));
  }

  isFormValid(): boolean {
    return this.orderForm.invalid && (this.orderForm.touched || this.orderForm.dirty || this.isSubmitted)
  }

  orderRequest(): void {
    this.isSubmitted = true;

    if (this.orderForm.invalid) {
      this.orderForm.markAllAsTouched();
      return;
    }

    console.log('orderRequest');
    // запрос на сервер
  }

  closePopup(): void {
    this.orderForm.reset();
    this.isVisible = false;
  }
}
