import { Component, HostListener } from '@angular/core';
import { ArticlesType, ArticleType } from "../../../types/articles.type";
import { ArticlesService } from "../../shared/services/articles.service";
import { ActiveQueryParamsType } from "../../../types/active-query-params.type";
import { ActivatedRoute, Router } from "@angular/router";
import { CategoriesService } from "../../shared/services/categories.service";
import { CategoryInFilterType, CategoryType } from "../../../types/categoryRawType";

@Component({
  selector: 'app-blog',
  templateUrl: './blog.component.html',
  styleUrls: ['./blog.component.scss']
})
export class BlogComponent {

  activeQueryParams: ActiveQueryParamsType = { page: '1', categories: [] };
  categoriesFromServer: CategoryType[] = [];
  categoriesSetInFilter: CategoryInFilterType[] = [];

  isDropdownMenuOpen: boolean = false;

  currentArticlesCount: number = 0;
  totalAmountOfPages: number = 1;
  currentArticlesData: ArticleType[] = [];

  ifPrevArrowAllowed: boolean = false;
  ifNextArrowAllowed: boolean = true;

  constructor(private articlesService: ArticlesService,
              private activatedRoute: ActivatedRoute,
              private router: Router,
              private categoryService: CategoriesService,
  ) {
  }

  ngOnInit() {
    // Подписка на получение имен категорий из QUERY
    this.activatedRoute.queryParams
      .subscribe(params => {
        console.log('обновили url');
        this.activeQueryParams = { page: '1', categories: [] };

        if (params.hasOwnProperty("page")) {
          this.activeQueryParams.page = params['page'];
        }
        if (params.hasOwnProperty("categories")) {
          this.activeQueryParams.categories = typeof params['categories'] === "string"
            ? [params['categories']]
            : params['categories'];
        }

        this.updateFilterCategories();
        this.loadArticles();
      });

    // Подписка на получение категорий с сервера (сработает только один раз, т.к. категории меняются не часто и не с этой страницы)
    this.categoryService.categoriesObjects$
      .subscribe((categories: CategoryType[]) => {
        if (categories && categories.length > 0) {
          this.categoriesFromServer = categories;

          // На полученные категории проставляем актуальные флаги selected
          this.categoriesFromServer.forEach((category: CategoryType) => {
            if (this.activeQueryParams.categories.includes(category.url)) {
              category.selected = true;
            }
          })
        }

        this.updateFilterCategories();
        this.loadArticles();
      });
  }

  // Если есть новые данные о категориях с сервера, обновляем фильтр
  updateFilterCategories(): undefined | void {
    this.categoriesSetInFilter = [];
    if (!this.categoriesFromServer.length) {
      return undefined;
    } else {
      this.categoriesFromServer.forEach(cat => {
        if (cat.selected) {
          this.categoriesSetInFilter.push(cat);
        }
      });
    }
  }

  // При обновлении количества статей остаемся на той же странице, если такая страница допустима, если нет - идем на 1 страницу
  loadArticles() {
    this.articlesService.getArticlesWithFilter(this.activeQueryParams)
      .subscribe((data: ArticlesType) => {
        if (data && data.count > 0) {
          this.currentArticlesCount = data.count;
          this.totalAmountOfPages = data.pages;
          this.currentArticlesData = data.items;
        }

        if (+this.activeQueryParams.page > this.totalAmountOfPages) {
          this.activeQueryParams.page = '1';
          this.router.navigate(['blog'], {
            queryParams: {
              page: this.activeQueryParams.page,
              categories: this.activeQueryParams.categories,
            }
          });
        }

        this.ifPrevArrowAllowed = Number(this.activeQueryParams.page) > 1;
        this.ifNextArrowAllowed = Number(this.activeQueryParams.page) < this.totalAmountOfPages;
      });
  }

  // При клике на плашку выбранной категории или при клике в выпадающем меню, обновляем и плашки и меню
  toggleItem(item: CategoryInFilterType) {
    item.selected = !item.selected;

    let curItem = this.categoriesSetInFilter.find(arrItem => arrItem === item)
    if (curItem) {
      this.categoriesSetInFilter = this.categoriesSetInFilter.filter(item => item !== curItem);
    } else {
      this.categoriesSetInFilter.push(item);
    }

    let currentParamsUrls = this.categoriesSetInFilter.map(arrItem => arrItem.url);
    this.router.navigate(['blog'], {
      queryParams: {
        page: this.activeQueryParams.page,
        categories: currentParamsUrls,
      }
    });
  }

  arrowButtonHandler(value: 'next' | 'prev') {
    if (value === 'prev') {
      this.activeQueryParams.page = String(Number(this.activeQueryParams.page) - 1);
    }
    if (value === 'next') {
      this.activeQueryParams.page = String(Number(this.activeQueryParams.page) + 1);
    }
    this.router.navigate(['blog'], {
      queryParams: {
        page: this.activeQueryParams.page,
        categories: this.activeQueryParams.categories,
      }
    });
  }

  numberButtonHandler(number: number) {
    console.log('number button clicked:', number);
    this.activeQueryParams.page = String(number);
    this.router.navigate(['blog'], {
      queryParams: {
        page: this.activeQueryParams.page,
        categories: this.activeQueryParams.categories,
      }
    });
  }

  toggleDropdown() {
    this.isDropdownMenuOpen = !this.isDropdownMenuOpen;
  }

  @HostListener('document:click', ['$event'])
  clickOut(event: Event) {
    const target = event.target as HTMLElement;
    const clickedInsideDropdown = target.closest('.dropdown-area');
    if (!clickedInsideDropdown) {
      this.isDropdownMenuOpen = false;
    }
  }

}
