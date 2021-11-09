export const BidsPath = {
  post: {
    security: [{
      apiKeyAuth: []
    }],
    tags: ['Bids'],
    summary: 'Rota para Transportadores realizarem o cadastro de lances',
    requestBody: {
      content: {
        'application/json': {
          schema: {
            $ref: '#/schemas/bidsPostRequestBody'
          },
          example: {
            id_offer: 1,
            value: 1000,
            amount: 500
          }
        }
      }
    },
    responses: {
      201: {
        description: 'Sucesso',
        content: {
          'application/json': {
            schema: {
              $ref: '#/schemas/bidsPostResponseBody'
            }
          }
        }
      },
      400: {
        $ref: '#/components/badRequest'
      },
      401: {
        $ref: '#/components/unauthorized'
      },
      403: {
        $ref: '#/components/forbidden'
      },
      500: {
        $ref: '#/components/serverError'
      }
    }
  },
  get: {
    tags: ['Bids'],
    summary: 'Rota para obtenção dos lances cadastrados em uma determinada oferta',
    parameters: [
      {
        in: 'path',
        name: 'offerId',
        schema: {
          type: 'integer'
        },
        required: 'true',
        description: 'Id da oferta que deseja obter o lances cadastrados'
      }
    ],
    responses: {
      200: {
        description: 'Sucesso',
        content: {
          'application/json': {
            schema: {
              $ref: '#/schemas/bidsGetResponseBody'
            }
          }
        }
      },
      500: {
        $ref: '#/components/serverError'
      }
    }
  }
}
