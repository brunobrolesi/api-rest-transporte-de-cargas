export interface AddBidModel {
  id_provider: number
  id_offer: number
  value: number
  amount: number
}

export interface AddBid {
  add: (data: AddBidModel) => Promise<void>
}
