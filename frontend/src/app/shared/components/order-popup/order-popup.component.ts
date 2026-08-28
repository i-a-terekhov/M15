import { Component, ViewChild } from '@angular/core';
import { FormBuilder, FormGroupDirective, Validators } from "@angular/forms";
import { MatSnackBar } from "@angular/material/snack-bar";
import { PopupService } from "../../services/popup.service";
import { CategoriesService } from "../../services/categories.service";
import { RequestBodyType } from "../../../../types/request-body.type";
import { RequestService } from "../../services/request.service";
import { PopupEnumType } from "../../../../types/popup-enum.type";

@Component({
  selector: 'order-popup',
  templateUrl: './order-popup.component.html',
  styleUrls: ['./order-popup.component.scss']
})
export class OrderPopupComponent {

  @ViewChild(FormGroupDirective) formDirective!: FormGroupDirective;

  popupTypes = PopupEnumType;
  popupType: PopupEnumType = this.popupTypes.order;
  isVisible = false;
  isThanksVisible = false;

  servicesList: string[] = [];
  isSubmitted = false; // для перевода кнопки в disable после первого нажатия (в сценарии, когда форма не тронута)
  isRequestError = false;
  makeErrorRequest = false; // если из карточки пришло название услуги не из списка сервера, намеренно отправляем кривой запрос (для демонстрации функционала показа предупреждающей надписи в попапе)

  orderForm = this.fb.group({
    service: ['', [Validators.required]],
    name: ['', Validators.required],
    phone: ['', [Validators.required]],
  });

  constructor(private fb: FormBuilder,
              private popupService: PopupService,
              private categoryService: CategoriesService,
              private requestService: RequestService,
              private snackBar: MatSnackBar,
  ) {
  }

  ngOnInit() {
    this.popupService.popupDataSource$.subscribe(
      ({ selectedOptionName, popupType }) => {
        this.popupType = popupType;
        const currentScrollY = window.scrollY;   // запоминаем положение страницы при вызове попапа

        this.isRequestError = false;
        if (this.servicesList && this.servicesList.length === 0) {   // Первые 3 сек. после загрузки приложения servicesList = false (для демонстрации)
          this.snackBar.open('Медленное соединение! Попробуйте позже')
          return;
        }

        this.isVisible = true;       // т.к. Material перехватывает фокус на инпут и из-за кастомного попапа скроллит нас
        setTimeout(() => {  // в центр страницы, перехватываем скролл сразу после Material
          window.scrollTo({
            top: currentScrollY,
            behavior: 'auto'
          });
        }, 15);

        if (this.popupType === this.popupTypes.order) {
          if (this.servicesList.includes(selectedOptionName)) {
            this.orderForm.get('service')?.patchValue(selectedOptionName);
          } else {
            this.servicesList.push(selectedOptionName);
            this.makeErrorRequest = true;
            this.orderForm.get('service')?.patchValue(selectedOptionName);
          }
        } else {
          this.orderForm.get('service')?.patchValue(selectedOptionName);  // "Консультация"
        }
      });

    this.categoryService.categoriesNames$.subscribe((categories: string[]) => {
      if (categories && categories.length > 0) {
        this.servicesList = categories;
      }
    })
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

    const body: RequestBodyType = {
      name: this.orderForm.value.name!,
      phone: this.orderForm.value.phone!,
      service: this.orderForm.value.service!,
      type: this.makeErrorRequest ? "errorOrder" : this.popupType,
    }

    this.requestService.getPopularArticles(body).subscribe({
      next: () => {
        this.isThanksVisible = true;
        this.fullFormReset();
      },
      error: err => {
        console.error(err.error.message);
        this.isRequestError = true;
        this.makeErrorRequest = false;
      },
    });
  }

  closePopup(): void {
    this.fullFormReset();
  }

  fullFormReset(): void {
    this.formDirective.resetForm();
    this.isVisible = false;
    this.isSubmitted = false;
    this.makeErrorRequest = false;
  }

  closeThanks(): void {
    this.isThanksVisible = false;
  }
}
