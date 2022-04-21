const router = require('express').Router()
const { Category, Product } = require('../../models')

router.get('/', async (req, res) => {
  const categories = await Category.findAll({
    include: Product
  })
  res.status(200).json({
    data: categories
  })
})

router.get('/:id', async (req, res) => {
  const category = await Category.findByPk(req.params.id, {
    include: Product
  })
  res.status(200).json({
    data: category
  })
})

router.post('/', async (req, res) => {
  const category = await Category.create({
    category_name: req.body.category_name
  })

  res.status(201).json({
    data: category
  })
})

router.put('/:id', async (req, res) => {
  const category = await Category.update({
    category_name: req.body.category_name
  }, { 
    where: { 
      id: req.params.id 
    }
  })
  res.status(200).json({
    data: category
  })
})

router.delete('/:id', async (req, res) => {
  await Category.destroy({ where: { id: req.params.id } })

  res.status(204).end()
})

module.exports = router
