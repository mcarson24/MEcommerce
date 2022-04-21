const router = require('express').Router()
const { Tag, Product, ProductTag } = require('../../models')

router.get('/', async (req, res) => {
  // find all tags
  const tags = await Tag.findAll({
    include: Product
  })

  res.status(200).json({
    data: tags
  })
})

router.get('/:id', async (req, res) => {
  const tag = await Tag.findByPk(req.params.id, {
    include: Product
  })

  res.status(200).json({
    data: tag
  })
})

router.post('/', async (req, res) => {
  const tag = await Tag.create({
    tag_name: req.body.tag_name
  })

  res.status(201).json({
    data: tag
  })
})

router.put('/:id', async (req, res) => {
  const tag = await Tag.update({
    tag_name: req.body.tag_name
  }, {
    where: {
      id: req.params.id
    }
  })

  res.status(200).json({
    data: tag
  })
})

router.delete('/:id', async (req, res) => {
  await Tag.destroy({ where: { id: req.params.id } })

  res.status(204).end()
})

module.exports = router
