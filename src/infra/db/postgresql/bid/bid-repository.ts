import { PrismaClient, Prisma } from '.prisma/client'
import { AddBidRepository } from '../../../../data/protocols/db/add-bid-repository'
import { BidModel } from '../../../../domain/models/bid'
import { AddBidModel } from '../../../../domain/usecases/add-bid'

export class BidPostgresRepository implements AddBidRepository {
  constructor (private readonly prisma: PrismaClient) {}

  async add (bidData: AddBidModel): Promise<BidModel> {
    const { value, amount } = bidData
    const decimal_value = new Prisma.Decimal(value)
    const decimal_amount = new Prisma.Decimal(amount)
    const bidWithDecimalValues = Object.assign({}, bidData, { value: decimal_value, amount: decimal_amount })
    await this.prisma.bid.create({ data: bidWithDecimalValues })
    return bidData
  }
}