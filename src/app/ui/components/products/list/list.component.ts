import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { BaseComponent, SpinnerType } from 'src/app/base/base.component';
import { BaseUrl } from 'src/app/contracts/base_url';
import { Create_Basket_Item } from 'src/app/contracts/basket/create_basket_item';
import { List_Product } from 'src/app/contracts/list_product';
import { BasketService } from 'src/app/services/common/models/basket.service';
import { FileService } from 'src/app/services/common/models/file.service';
import { ProductService } from 'src/app/services/common/models/product.service';
import { CustomToastrService, ToastrMessageType, ToastrPosition } from 'src/app/services/ui/custom-toastr.service';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent extends BaseComponent implements OnInit {
  constructor(
    private productService: ProductService, 
    private activatedRoute: ActivatedRoute, 
    private fileService: FileService,
    spinner:NgxSpinnerService,
    private basketService:BasketService,
    private toastr:CustomToastrService
    ) 
  {
    super(spinner)
   }

  products: List_Product[];

  currentPageNo: number;
  totalProductCount: number;
  totalPageCount: number;
  pageSize: number = 12;
  baseUrl: BaseUrl;
  pageList: number[] = [];

  async ngOnInit() {
    this.baseUrl = await this.fileService.getBaseStorageUrl()

    this.activatedRoute.params.subscribe(async params => {
      this.showSpinner(SpinnerType.Classic)
      const deneme = params["pageNo"]

      if (parseInt(params["pageNo"]) <= 0 || params["pageNo"] == undefined) {
        this.currentPageNo = 1

      }
      else {
        this.currentPageNo = parseInt(params["pageNo"])
      }

      const data: { totalProductCount: number, products: List_Product[] } = await this.productService.read(this.currentPageNo - 1, this.pageSize, () => {

      }, errorMessage => {

      })



      this.products = data.products;
      this.products = this.products.map<List_Product>(p => {


        const listProduct: List_Product = {

          id: p.id,
          createDate: p.createDate,
          name: p.name,
          price: p.price,
          stock: p.stock,
          updatedDate: p.updatedDate,
          productImageFiles: p.productImageFiles,
          imagePath: p.productImageFiles.length ? p.productImageFiles.find(p => p.showcase).path : '',
        }



        return listProduct

      })




      this.totalProductCount = data.totalProductCount;
      this.totalPageCount = Math.ceil(this.totalProductCount / this.pageSize);

      this.pageList = [];

      if (this.currentPageNo - 2 <= 0) {
        for (let i = 0; i <= 7; i++) {
          this.pageList.push(i);
        }
      }
      else if (this.currentPageNo + 2 >= this.totalPageCount) {
        for (let i = this.totalPageCount - 6; i <= this.totalPageCount; i++) {
          this.pageList.push(i);
        }
      }
      else {
        for (let i = this.currentPageNo - 2; i <= this.currentPageNo + 2; i++) {
          this.pageList.push(i);
        }
      }
      this.hideSpinner(SpinnerType.Classic)
    });

  }

  async addToBasket(product: List_Product) {
    this.showSpinner(SpinnerType.Clock)
    let _basketItem:Create_Basket_Item = new Create_Basket_Item();
    _basketItem.productId=product.id;
    _basketItem.quantity=1;
    await this.basketService.add(_basketItem);
    this.hideSpinner(SpinnerType.Clock);
    this.toastr.message('BAŞARILI','ÜRÜN SEPETE EKLENDİ',ToastrMessageType.Success,ToastrPosition.TopRight);
  }

}