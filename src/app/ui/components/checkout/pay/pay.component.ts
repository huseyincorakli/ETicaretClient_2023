import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Stripe, StripeElements, StripeError } from '@stripe/stripe-js';
import { NgxSpinnerService } from 'ngx-spinner';
import { BaseComponent, SpinnerType } from 'src/app/base/base.component';
import { BaseUrl } from 'src/app/contracts/base_url';
import { List_Basket_Item } from 'src/app/contracts/basket/list_basket_item';
import { Create_Order } from 'src/app/contracts/order/create_order';
import { BasketService } from 'src/app/services/common/models/basket.service';
import { FileService } from 'src/app/services/common/models/file.service';
import { OrderService } from 'src/app/services/common/models/order.service';
import { UserService } from 'src/app/services/common/models/user.service';
import { CustomToastrService, ToastrMessageType, ToastrPosition } from 'src/app/services/ui/custom-toastr.service';

@Component({
  selector: 'app-pay',
  templateUrl: './pay.component.html',
  styleUrls: ['./pay.component.scss']
})
export class PayComponent  extends BaseComponent implements OnDestroy, OnInit {
  @Input() clientSecret: string = '';
  @Input() stripePromise: Promise<Stripe> | undefined;
  @Input() order: Create_Order;
  stripe: Stripe | undefined;
  elements: StripeElements | undefined;
  basketItems: List_Basket_Item[];
  totalAmount:number;
  campaignId:string;

  constructor(
    spinner:NgxSpinnerService,
    private orderService: OrderService,
    private userService: UserService,
    private toastr: CustomToastrService,
    private basketService:BasketService,
    private fileService: FileService,
    private router: Router,
    private route: ActivatedRoute) {

      super(spinner)
  }
  ngOnDestroy(): void {
    this.order = null;
  }
  message: string | null = null;
  isLoading: boolean = false;
  userId: string;
  user: any;
  baseUrl: BaseUrl;
  campaignCode?:string;
  async ngOnInit() {
    this.showSpinner(SpinnerType.Clock)
    this.route.queryParams.subscribe(params => {
      if (params['data']) {
        // Parse the JSON data
        const jsonData = JSON.parse(params['data']);
        this.campaignCode=jsonData.campaingCode;
        this.totalAmount= (jsonData.totalAmount);
        debugger
      }
    });

if (this.campaignCode) {
  this.campaignId=  await this.orderService.getCampaignIdByCode(this.campaignCode);
}
    this.baseUrl = await this.fileService.getBaseStorageUrl()
  this.basketItems= await this.basketService.get()
  if (this.basketItems.length==0) {
    this.toastr.message('Sepet Boş','Sepette ürün olmadan ödeme yapılamaz.',ToastrMessageType.Error,ToastrPosition.TopRight)
    this.router.navigate(['/products'])
  }
    if (this.order == null) {
      this.router.navigate(['/']);
    }
    this.userId = localStorage.getItem('userId')
    this.user = await this.userService.getUserById(this.userId);
    if (this.stripePromise) {
      this.stripePromise.then(stripe => {
        this.stripe = stripe;
        this.elements = stripe.elements();
        const paymentElement = this.elements.create('card');
        paymentElement.mount('#payment-element');
      });
      console.log("PAY", this.order);

    }
    this.hideSpinner(SpinnerType.Clock)
  }


  handleSubmit(event: Event) {
    
    event.preventDefault();

    if (!this.stripe || !this.elements) {
      return;
    }

    // Get a reference to the mounted Payment Element
    const cardElement = this.elements.getElement('card');

    if (!cardElement) {
      console.error('Card Element is not mounted.');
      return;
    }
    this.showSpinner(SpinnerType.Clock)

    this.isLoading = true;

    this.stripe.confirmCardPayment(this.clientSecret, {
      payment_method: {
        card: cardElement,
        // You can add additional details as needed
        billing_details: {
          name: this.user.updateProfile.nameSurname,
          email: this.user.updateProfile.email
        },
      },
    }).then(async result => {
      if (result.error) {
        const stripeError: StripeError = result.error;
        if (stripeError.payment_intent) {
          // Handle payment_intent information
          switch (stripeError.payment_intent.status) {
            case 'succeeded':
              this.message = 'Ödeme Başarılı';
              await this.orderService.create(this.order);
              this.order = null;
              await this.orderService.createCampaignUsage(this.userId,this.campaignId)

              debugger;
              break;
            case 'processing':
              this.message = 'Ödemeniz işleniyor...';
              break;
            case 'requires_payment_method':
              this.message = 'Ödemeniz geçerli değildir.Lütfen tekrar deneyiniz.';
              break;
            default:
              this.message = 'Something went wrong.';
              break;
          }
        } else {
          // Handle other errors
          this.message = stripeError.message || 'An unexpected error occurred.';
        }
      } else {
        // Handle success
        this.message = 'Ödeme Başarılı';
        await this.orderService.create(this.order);
        if (this.campaignCode) {
          await this.orderService.createCampaignUsage(this.userId,this.campaignId)
        }
        this.order = null;

        setTimeout(() => {
          this.toastr.message(this.message, "Bizi tercih ettiğiniz için teşekkürler...", ToastrMessageType.Success, ToastrPosition.BottomFull)
          this.router.navigate(['/'])
          this.isLoading = false;
        }, 2000);
      }

    });

    this.hideSpinner(SpinnerType.Clock)

  }
}
