import { describe, expect, it } from 'vitest'
import { createProductFormData, productDetailsToFormData } from './productFormData'

describe('createProductFormData', () => {
  it('forces legacy products without a purchase price to be completed on edit', () => {
    const formValues = productDetailsToFormData({
      id: 1,
      name: 'Legado',
      purchasePrice: null,
      salePrice: 19.9,
      active: true,
    })

    expect(formValues.purchasePrice).toBe('')
    expect(formValues.salePrice).toBe('R$ 19,90')
  })

  it('adds the numeric product contract as application/json', async () => {
    const product = { name: 'Produto', purchasePrice: 10.25, salePrice: 19.9 }

    const formData = createProductFormData(product)
    const productPart = formData.get('product')

    expect(productPart).toBeInstanceOf(Blob)
    expect((productPart as Blob).type).toBe('application/json')
    expect(JSON.parse(await (productPart as Blob).text())).toEqual(product)
    expect(formData.get('file')).toBeNull()
  })

  it('keeps the image in a separate multipart part', () => {
    const product = { name: 'Produto', purchasePrice: 0, salePrice: 1 }
    const file = new File(['image'], 'product.png', { type: 'image/png' })

    const formData = createProductFormData(product, file)

    expect(formData.get('file')).toBe(file)
  })
})
