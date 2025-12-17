import { BaseService } from '../base.service'
import { PageRequest } from '../../models/page.request'

export class ExpenseHeadService extends BaseService {
  private readonly BASE_URL = '/expense-heads'

  getExpenseHeads(pageRequest: PageRequest) {
    return this.get(this.BASE_URL, { params: pageRequest })
  }

  getExpenseHeadDetails(id: string) {
    return this.get(`${this.BASE_URL}/${id}`)
  }

  createExpenseHead(data: any) {
    return this.post(this.BASE_URL, data)
  }

  updateExpenseHead(id: string, data: any) {
    return this.put(`${this.BASE_URL}/${id}`, data)
  }

  deleteExpenseHead(id: string) {
    return this.delete(`${this.BASE_URL}/${id}`)
  }
} 