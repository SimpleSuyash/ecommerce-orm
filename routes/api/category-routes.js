const router = require('express').Router();
const { Category, Product } = require('../../models');

// The `/api/categories` endpoint

router.get('/', async(req, res) => {
  // finds all categories
  // includes its associated Products
  try {
    const categories = await Category.findAll({
      include: [Product]
    });
    res.status(200).json(categories);
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }

});

router.get('/:id', async (req, res) => {
  // finds one category by its `id` value
  //  includes its associated Products
  const id = req.params.id;
  try {
    const category = await Category.findByPk(id,{
      include: [Product]
    });
    if(category){
      res.status(200).json(category);
    }else{
      res.status(404).json({ message: `No catagories found for given id ${id}!` });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
});

router.post('/', async (req, res) => {
  // creates a new category
  if(!req.body.category_name){
    res.status(400).json({message: "Category Name is required!"});
  }else if(req.body.category_name.trim().length === 0){
    res.status(400).json({message: "Category Name cannot be empty!"});
  }else{
    try {
      const newCategory = {"category_name": req.body.category_name.trim()};
      const category = await Category.create(newCategory);
      res.status(200).json(category);
    } catch (error) {
      console.log(error);
      res.status(500).json(error);
    }
  }
});

router.put('/:id', async (req, res) => {
  // updates a category by its `id` value
  const categoryId = req.params.id;
  let category = await Category.findByPk(categoryId);

  if(!category){
    res.status(404).json({ message: `No categories were found with given id ${categoryId}!` });

  }else if(!req.body.category_name){
    res.status(400).json({message: "Category Name is required!"});

  }else if(req.body.category_name.trim().length === 0){
    res.status(400).json({message: "Category Name cannot be empty!"});

  }else{
    try {
      const newCategory = {"category_name": req.body.category_name.trim()};
      const updatedCategoryData = await Category.update(newCategory,{
        where:{
          id : categoryId
        } 
      });
      console.log(updatedCategoryData);
       // when updated data was same as previous data
       if(!updatedCategoryData[0]) {
        res.status(400).json({ message: `No categories were updated with given id ${categoryId}!` });
       }else {
        //getting updated category data
        category = await Category.findByPk(categoryId);
        res.status(200).json(category);
      }
    } catch (error) {
      console.log(error);
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
    console.log(error);
    res.status(500).json(error);
  }
});

module.exports = router;
