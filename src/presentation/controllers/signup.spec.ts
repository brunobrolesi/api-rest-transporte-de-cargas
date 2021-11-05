import { SignUpBodyValidator } from '../protocols/signup-body-validator'
import { ValidatorResult } from '../protocols/validator-result'
import { SignUpController } from './signup'

const makeSignUpBodyValidatorStub = (): SignUpBodyValidator => {
  class SignUpBodyValidatorStub implements SignUpBodyValidator {
    isValid (body: object): ValidatorResult {
      return {}
    }
  }

  return new SignUpBodyValidatorStub()
}

interface SutTypes {
  sut: SignUpController
  signUpBodyValidatorStub: SignUpBodyValidator
}

const makeSut = (): SutTypes => {
  const signUpBodyValidatorStub = makeSignUpBodyValidatorStub()
  const sut = new SignUpController(signUpBodyValidatorStub)
  return {
    sut,
    signUpBodyValidatorStub
  }
}

describe('Signup Controller', () => {
  it('Should call body validator with correct values', () => {
    const { sut, signUpBodyValidatorStub } = makeSut()
    const validatorSpy = jest.spyOn(signUpBodyValidatorStub, 'isValid')
    const httpRequest = {
      body: {
        doc: 'any_doc',
        about: 'any_about',
        active: true,
        site: 'any_site'
      }
    }
    sut.handle(httpRequest)
    expect(validatorSpy).toHaveBeenCalledWith({
      doc: 'any_doc',
      about: 'any_about',
      active: true,
      site: 'any_site'
    })
  })

  it('Should return 400 if validator returns an error', () => {
    const { sut, signUpBodyValidatorStub } = makeSut()
    jest.spyOn(signUpBodyValidatorStub, 'isValid').mockReturnValueOnce({ error: new Error('any_message') })
    const httpRequest = {
      body: {
        doc: 'any_doc',
        about: 'any_about',
        active: true,
        site: 'any_site'
      }
    }
    const response = sut.handle(httpRequest)
    expect(response.statusCode).toBe(400)
  })

  it('Should return error message in body if validator returns an error', () => {
    const { sut, signUpBodyValidatorStub } = makeSut()
    jest.spyOn(signUpBodyValidatorStub, 'isValid').mockReturnValueOnce({ error: new Error('any_message') })
    const httpRequest = {
      body: {
        doc: 'any_doc',
        about: 'any_about',
        active: true,
        site: 'any_site'
      }
    }
    const response = sut.handle(httpRequest)
    expect(response.body.message).toBe('any_message')
  })
})