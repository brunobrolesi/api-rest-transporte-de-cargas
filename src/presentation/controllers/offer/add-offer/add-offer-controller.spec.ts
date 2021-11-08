import { AddOffer, AddOfferModel } from '../../../../domain/usecases/add-offer'
import { BodyValidator } from '../../../protocols/body-validator'
import { ValidatorResult } from '../../../protocols/validator-result'
import { AddOfferController } from './add-offer-controller'

const makeAddOfferBodyValidatorStub = (): BodyValidator => {
  class SignUpBodyValidatorStub implements BodyValidator {
    isValid (body: object): ValidatorResult {
      return {}
    }
  }

  return new SignUpBodyValidatorStub()
}

const makeAddOfferStub = (): AddOffer => {
  class AddOfferStub implements AddOffer {
    async add (data: AddOfferModel): Promise<void> {
      return await new Promise(resolve => resolve())
    }
  }

  return new AddOfferStub()
}

const makeFakeHttpRequest = (): any => ({
  body: {
    id_customer: 1,
    from: 'any_location',
    to: 'any_location',
    initial_value: 'any_value',
    amount: 'any_amount',
    amount_type: 'any_type'
  }
})

interface SutTypes {
  sut: AddOfferController
  addOfferBodyValidatorStub: BodyValidator
  addOfferStub: AddOffer
}

const makeSut = (): SutTypes => {
  const addOfferBodyValidatorStub = makeAddOfferBodyValidatorStub()
  const addOfferStub = makeAddOfferStub()
  const sut = new AddOfferController(addOfferBodyValidatorStub, addOfferStub)

  return {
    sut,
    addOfferBodyValidatorStub,
    addOfferStub
  }
}

describe('AddOffer Controller', () => {
  it('Should call body validator with correct values', async () => {
    const { sut, addOfferBodyValidatorStub } = makeSut()
    const validatorSpy = jest.spyOn(addOfferBodyValidatorStub, 'isValid')
    await sut.handle(makeFakeHttpRequest())
    expect(validatorSpy).toHaveBeenCalledWith({
      id_customer: 1,
      from: 'any_location',
      to: 'any_location',
      initial_value: 'any_value',
      amount: 'any_amount',
      amount_type: 'any_type'
    })
  })

  it('Should return 400 if validator returns an error', async () => {
    const { sut, addOfferBodyValidatorStub } = makeSut()
    jest.spyOn(addOfferBodyValidatorStub, 'isValid').mockReturnValueOnce({ error: new Error('any_message') })
    const response = await sut.handle(makeFakeHttpRequest())
    expect(response.statusCode).toBe(400)
  })

  it('Should return error message in body if validator returns an error', async () => {
    const { sut, addOfferBodyValidatorStub } = makeSut()
    jest.spyOn(addOfferBodyValidatorStub, 'isValid').mockReturnValueOnce({ error: new Error('any_message') })
    const response = await sut.handle(makeFakeHttpRequest())
    expect(response.body.message).toBe('any_message')
  })

  it('Should call add offer with correct values', async () => {
    const { sut, addOfferStub } = makeSut()
    const addSpy = jest.spyOn(addOfferStub, 'add')
    await sut.handle(makeFakeHttpRequest())
    expect(addSpy).toHaveBeenCalledWith({
      id_customer: 1,
      from: 'any_location',
      to: 'any_location',
      initial_value: 'any_value',
      amount: 'any_amount',
      amount_type: 'any_type'
    })
  })
})
