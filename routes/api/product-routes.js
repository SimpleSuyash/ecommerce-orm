const router = require('express').Router();
const { Product, Category, Tag, ProductTag } = require('../../models');

// The `/api/products` endpoint

// get all products
router.get('/', async (req, res) => {
  // finds all products
  // includes its associated Category and Tag data
  try {
    const productData = await Product.findAll({
      include: [Category, Tag]
    });
    res.status(200).json(productData);
  } catch (error) {
    res.status(500).json(error);
  }
});

// get one product
router.get('/:id', async (req, res) => {
  // find a single product by its `id`
  // be sure to include its associated Category and Tag data
  const id = req.params.id;
  try {
    const productData = await Product.findByPk(id,{
      include: [Category, Tag]
    });
    if(productData){
      res.status(200).json(productData);
    }else{
      res.status(404).json({ message: `No products found for given id ${id}!` });
    }
  } catch (error) {
    res.status(500).json(error);
  }
});

// create new product
router.post('/', async (req, res) => {
 if(req.body.product_name.trim().length === 0){
  res.status(400).json({message: "Product Name cannot be empty!"});
 }else{
  try {
    const product = await Product.create(req.body);
    if (req.body.tag_ids.length) {
      const productTagIdArr = req.body.tag_ids.map(tag_id => {
        return {
          product_id: product.id,
          tag_id,
        };
      });
      const productTagIds = await ProductTag.bulkCreate(productTagIdArr);
      res.status(200).json(productTagIds);
    }else{
      // if no product tags, just respond
      res.status(200).json(product);
    }
  } catch (error) {
    console.log(error);
    res.status(400).json(error);
  }
 }
});

// updates product
router.put('/:id', async (req, res) => {
  // update product data
  const productId =req.params.id;
  if (req.body.product_name.trim().length === 0) {
    res.status(400).json({ message: "Product Name cannot be empty!" });
  } else {//----------------------------when product name not empty
    try {
      const productData = await Product.update(req.body, {
        where: {
          id: productId
        }
      });
      if (req.body.tag_ids && req.body.tag_ids.length) {//-when tag_ids exist
        //getting existing/current tags
        const productTags = await ProductTag.findAll({
          where: {
            product_id: req.params.id
          }
        });
        // create filtered list of new tag_ids
        //getting current tag ids
        const productTagIds = productTags.map(({ tag_id }) => tag_id);
        //returns {product_id: ---, tag_id: ---}
        //returns only that doesn't exist in current tag_ids
        const newProductTags = req.body.tag_ids
          .filter((tag_id) => !productTagIds.includes(tag_id))
          .map((tag_id) => {
            return {
              product_id: req.params.id,
              tag_id,
            };
          });
        // figure out which ones to remove
        const productTagsToRemove = productTags
          .filter(({ tag_id }) => !req.body.tag_ids.includes(tag_id))
          .map(({ id }) => id);
        // run both actions
        const updatedProductTags = await Promise.all([
          ProductTag.destroy({
            where: {
              id: productTagsToRemove
            }
          }),
          ProductTag.bulkCreate(newProductTags),
        ]);
        if(productTagsToRemove.length !== 0){
          //only return response when tags were changed
          return res.status(200).json(updatedProductTags);
        }
      }//-----------------------------------end of if when tag_ids exist

      if (!productData[0]) {
        res.status(404).json({ message: `No products were updated with given id ${productId}!` });
      }else{
        res.status(200).json(productData);
      }
    } catch (error) {
      console.log(error);
      res.status(400).json(error);
    }
  }
});

router.delete('/:id', async (req, res) => {
  // delete one product by its `id` value
  const productId = req.params.id;
  try {
    const productData = await Product.destroy({
      where:{
        id : productId
      } 
    });
    if (!productData) {
      res.status(404).json({ message: `No products were deleted for given id ${productId}!` });
    }else{
      res.status(200).json(productData);
    }
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
});

module.exports = router;
