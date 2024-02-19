const router = require('express').Router();
const { Category, Product } = require('../../models');

// The `/api/categories` endpoint

router.get('/', async(req, res) => {
  // finds all categories
  // includes its associated Products
  try {
    const categoryData = await Category.findAll({
      include: [Product]
    });
    res.status(200).json(categoryData);
  } catch (error) {
    res.status(500).json(error);
  }

});

router.get('/:id', async (req, res) => {
  // finds one category by its `id` value
  //  includes its associated Products
  const id = req.params.id;
  try {
    const categoryData = await Category.findByPk(id,{
      include: [Product]
    });
    if(categoryData){
      res.status(200).json(categoryData);
    }else{
      res.status(404).json({ message: `No catagories found for given id ${id}!` });
    }
  } catch (error) {
    res.status(500).json(error);
  }
});

router.post('/', async (req, res) => {
  // creates a new category
  if(req.body.category_name.trim().length === 0){
  // if(!req.body.category_name){
    res.status(400).json({message: "Category Name cannot be empty!"});
  }else{
    const newCategory = {
      category_name: req.body.category_name
    };
    try {
      const categoryData = await Category.create(newCategory);
      res.status(200).json(categoryData);
    } catch (error) {
      res.status(500).json(error);
    }
  }
});

router.put('/:id', async (req, res) => {
  // updates a category by its `id` value
  const categoryId = req.params.id;
  if(req.body.category_name.trim().length === 0){
    res.status(400).json({message: "Category Name cannot be empty!"});
  }else{
    const newCategory = {
      category_name: req.body.category_name
    };
    try {
      const categoryData = await Category.update(newCategory,{
        where:{
          id : categoryId
        } 
      });
      if (!categoryData[0]) {
        res.status(404).json({ message: `No categories were updated with given id ${categoryId}!` });
      }else{
        res.status(200).json(categoryData);
      }
    } catch (error) {
      res.status(500).json(error);
    }
  }
});

router.delete('/:id', async (req, res) => {
  // deletes a category by its `id` value
  const categoryId = req.params.id;
  try {
    const categoryData = await Category.destroy({
      where:{
        id : categoryId
      } 
    });
    if (!categoryData) {
      res.status(404).json({ message: `No categories were deleted for given id ${categoryId}!` });
    }else{
      res.status(200).json(categoryData);
    }
  } catch (error) {
    res.status(500).json(error);
  }
  
});

module.exports = router;
