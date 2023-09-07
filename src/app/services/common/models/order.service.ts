import { Injectable } from '@angular/core';
import { HttpClientService } from '../http-client.service';
import { Create_Order } from 'src/app/contracts/order/create_order';
import { Observable, firstValueFrom } from 'rxjs'
import { List_Order } from 'src/app/contracts/order/list_order';

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  constructor(private httpClientService: HttpClientService) { }

  async create(order: Create_Order): Promise<void> {
    const observable: Observable<Create_Order> = this.httpClientService.post({
      controller: 'orders'
    }, order)
    await firstValueFrom(observable);
  }

  async getAllOrders(page: number = 0, size: number = 5, succesCallBack?: () => void, errorCallBack?: (errorMessage: string) => void): 
  Promise<{ totalOrderCount: number, orders: List_Order[] }> {
    const observable: Observable<{ totalOrderCount: number, orders: List_Order[] }> = this.httpClientService.get({
      controller: 'orders',
      queryString: `page=${page}&size=${size}`
    })
    const promiseData = firstValueFrom(observable)
    promiseData.then(value => {
      succesCallBack()
    })
      .catch(error => errorCallBack(error))
    return await promiseData;
  }


}
