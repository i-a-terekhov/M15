import { Component, HostListener } from '@angular/core';
import { ArticlesType, ArticleType } from "../../../types/articles.type";
import { ArticlesService } from "../../shared/services/articles.service";
import { ActiveQueryParamsType } from "../../../types/active-query-params.type";
import { ActivatedRoute, ParamMap, Router } from "@angular/router";
import { CategoriesService } from "../../shared/services/categories.service";
import { CategoryType } from "../../../types/categoryRawType";
import { map, switchMap, tap } from "rxjs";

@Component({
  selector: 'app-blog',
  templateUrl: './blog.component.html',
  styleUrls: ['./blog.component.scss']
})
export class BlogComponent {

  activeQueryParams: ActiveQueryParamsType = { page: 1, categories: [] };
  categoriesFromServer: CategoryType[] = [];

  isDropdownMenuOpen: boolean = false;

  currentArticlesCount: number = 0;
  totalAmountOfPages: number = 1;
  currentArticlesData: ArticleType[] = [];

  constructor(private articlesService: ArticlesService,
              private activatedRoute: ActivatedRoute,
              private router: Router,
              private categoryService: CategoriesService,
  ) {
  }

  ngOnInit(): void {
    this.listenToCategories();
    this.listenToUrl();
  }

  private listenToCategories(): void {
    this.categoryService.categoriesObjects$
      .subscribe((categories: CategoryType[]) => {
        this.categoriesFromServer = categories;
      });
  }

  private listenToUrl(): void {

    this.activatedRoute.queryParamMap
      .pipe(
        map((params: ParamMap) => {
          let urlPageNum: number = Number(params.get("page"));
          return {
            page: urlPageNum > 1 ? urlPageNum : 1,                             // если в url нет страницы, присваиваем 1
            categories: params.getAll("categories"),                            // getAll всегда возвращает массив
          }
        }),
        tap((filter: ActiveQueryParamsType) => {
          this.activeQueryParams = filter;
        }),
        switchMap((filter: ActiveQueryParamsType) => {
          return this.articlesService.getArticlesWithFilter(filter)
        }),
      )
      .subscribe((articlesData: ArticlesType) => {
        this.processArticlesResponse(articlesData);
      });
  }

  processArticlesResponse(articlesData: ArticlesType): void {
    const positiveNumberOfPages = Math.max(articlesData.pages, 1); // на случай, если сервер может вернуть page = 0

    if (this.activeQueryParams.page > positiveNumberOfPages) {
      this.navigateToFilter({
        page: 1,
        categories: this.activeQueryParams.categories,
      });

      return;
    }

    this.currentArticlesCount = articlesData.count;
    this.totalAmountOfPages = positiveNumberOfPages;
    this.currentArticlesData = articlesData.items;
  }

  get categoriesInFilter(): CategoryType[] {                                                  // для отображения плашек
    let categoriesSetInFilter: CategoryType[] = [];
    this.activeQueryParams.categories.forEach(categoryUrl => {
        let curCat = this.categoriesFromServer.find(cat => cat.url === categoryUrl)
        if (curCat) {
          categoriesSetInFilter.push(curCat);
        }
      }
    )
    return categoriesSetInFilter;
  }

  isCategorySelected(category: CategoryType): boolean {                                // для пометки в элементе менюшки
    return this.activeQueryParams.categories.includes(category.url);
  }

  get canGoToPreviousPage(): boolean {                                    // чтобы повесить [disabled] на кнопку "назад"
    return this.activeQueryParams.page > 1;
  }

  get canGoToNextPage(): boolean {                                       // чтобы повесить [disabled] на кнопку "вперед"
    return this.activeQueryParams.page < this.totalAmountOfPages;
  }

  paginationHandler(value: 'next' | 'prev' | number): void {
    let filter: ActiveQueryParamsType = { page: 1, categories: this.activeQueryParams.categories };

    if (typeof value === "number") {
      filter.page = value;
    }
    if (value === 'prev') {
      filter.page = this.activeQueryParams.page - 1;
    }
    if (value === 'next') {
      filter.page = this.activeQueryParams.page + 1;
    }

    this.navigateToFilter(filter);
  }

  private navigateToFilter(filter: ActiveQueryParamsType): void {
    this.router.navigate([], {
      relativeTo: this.activatedRoute,
      queryParams: {
        page: filter.page,
        categories: filter.categories,
      }
    });
  }

  toggleItem(category: CategoryType): void {
    let curCategories = this.activeQueryParams.categories;

    if (curCategories.includes(category.url)) {
      this.activeQueryParams.categories = curCategories.filter((catUrl) => catUrl !== category.url)
    } else {
      this.activeQueryParams.categories = [...curCategories, category.url];  // не делаем push, т.к. в этом случае ссылка на activeQueryParams не меняется (Ангуляр не видит изменения)
    }
    this.navigateToFilter(this.activeQueryParams);
  }

  toggleDropdown(): void {
    this.isDropdownMenuOpen = !this.isDropdownMenuOpen;
  }

  @HostListener('document:click', ['$event'])
  clickOut(event: Event): void {
    const target = event.target as HTMLElement;
    const clickedInsideDropdown = target.closest('.dropdown-area');
    if (!clickedInsideDropdown) {
      this.isDropdownMenuOpen = false;
    }
  }

}
