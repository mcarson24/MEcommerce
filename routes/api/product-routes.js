const router = require('express').Router()
const { Product, Category, Tag, ProductTag } = require('../../models')

router.get('/', async (req, res) => {
  const products = await Product.findAll({
    include: [
      { model: Category },
      { model: Tag }
    ]
  })

  if (!products) return res.status(400).json({
    error: {
      code: 400,
      message: 'Something went wrong!'
    }
  })

  res.status(200).json({
    data: products
  })
})

router.get('/:id', async (req, res) => {
  const product = await Product.findByPk(req.params.id, {
    include: [
      { model: Category },
      { model: Tag }
    ]
  })

  if (!product) return res.status(404).json({
    error: {
      code: 404,
      message: `Could not find a product with an id of ${req.params.id}.`
    }
  })

  return res.status(200).json({
    data: product
  })
})

router.post('/', async (req, res) => {
  const product = await Product.create(req.body)
  // if there's product tags, we need to create pairings to bulk create in the ProductTag model
  if (req.body.tagIds.length) {
    const productTags = req.body.tagIds.map(tag_id => {
      return {
        product_id: product.id,
        tag_id,
      }
    })
    const productTagIds = await ProductTag.bulkCreate(productTags)
    res.status(200).json(productTagIds)
  } else {
    // if no product tags, just respond
    res.status(200).json(product)
  }
})

router.put('/:id', async (req, res) => {
  try {
    await Product.update(req.body, {
      where: {
        id: req.params.id,
      },
    })
    // find all associated tags from ProductTag
    const productTags = await ProductTag.findAll({ where: { product_id: req.params.id } })
    // get list of current tag_ids
    const productTagIds = productTags.map(({ tag_id }) => tag_id)
    // create filtered list of new tag_ids
    const newProductTags = req.body.tagIds
      .filter(tag_id => !productTagIds.includes(tag_id))
      .map(tag_id => {
        return {
          product_id: req.params.id,
          tag_id,
        }
      })
    // figure out which ones to remove
    const productTagsToRemove = productTags
      .filter(({ tag_id }) => !req.body.tagIds.includes(tag_id))
      .map(({ id }) => id)

    // run both actions
    const updatedProductTags = await Promise.all([
      ProductTag.destroy({ where: { id: productTagsToRemove } }),
      ProductTag.bulkCreate(newProductTags),
    ])
    res.json(updatedProductTags)
  } catch (err) {
    return res.status(400).json(err)
  }
})

router.delete('/:id', async (req, res) => {
  await Product.destroy({ where: { id: req.params.id } })

  res.status(204).end()
})

module.exports = router
