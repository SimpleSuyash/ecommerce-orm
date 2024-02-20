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
  const {product_name, price, stock, category_id, tag_ids} =req.body;

  if (!(product_name && price && stock)) {
    res.status(400).json({ message: "Product Name, Price and Stock are required!" });

  } else if (product_name.trim().length === 0) {
    res.status(400).json({ message: "Product Name cannot be empty!" });

  } else if (Number.isNaN(price) || !Number.isInteger(stock)) {
    res.status(400).json({ message: "Price and Stock must be numbers!" });

  } else if (price < 0 || stock < 0) {
    res.status(400).json({ message: "Price and Stock cannot be less than 0!" });

  }else {
    try {
      const newProduct = {
        product_name:product_name.trim(),
        price,
        stock,
        category_id,
        tag_ids
      }
      const productData = await Product.create(newProduct);
      // const product = await Product.create(req.body);
      // if there's product tags, we need to create pairings to bulk create in the ProductTag model
      if (req.body.tag_ids && req.body.tag_ids.length) {
        const productTagIdArr = req.body.tag_ids.map(tag_id => {
          return {
            product_id: product.id,
            tag_id,
          };
        });
        const productTagIds = await ProductTag.bulkCreate(productTagIdArr);
        res.status(200).json(productTagIds);
      } else {
        // if no product tags, just respond
        res.status(200).json(productData);
      }
    } catch (error) {
      console.log(error);
      res.status(500).json(error);
    }
  }
});

// updates product
router.put('/:id', async (req, res) => {
  // update product data
  const productId = req.params.id;
  const {product_name, price, stock, category_id, tag_ids} =req.body;

  if (!(product_name && price && stock)) {
    res.status(400).json({ message: "Product Name, Price and Stock are required!" });

  } else if (product_name.trim().length === 0) {
    res.status(400).json({ message: "Product Name cannot be empty!" });

  } else if (Number.isNaN(price) || !Number.isInteger(stock)) {
    res.status(400).json({ message: "Price and Stock must be numbers!" });

  } else if (price < 0 || stock < 0) {
    res.status(400).json({ message: "Price and Stock cannot be less than 0!" });

  }else {//----------------------------when product name not empty
    try {
      const productTagsBeforeUpdate = await ProductTag.findAll({
        where: {
          product_id: req.params.id
        }
      });
      const newProduct = {
        product_name:product_name.trim(),
        price,
        stock,
        category_id,
        tag_ids
      }
      const productData = await Product.update(newProduct, {
        where: {
          id: productId
        }
      });
      if (tag_ids && tag_ids.length) {//-when tag_ids exist
        //getting  tags after update
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
        const newProductTags = tag_ids
          .filter((tag_id) => !productTagIds.includes(tag_id))
          .map((tag_id) => {
            return {
              product_id: req.params.id,
              tag_id,
            };
          });
        // figure out which ones to remove
        const productTagsToRemove = productTags
          .filter(({ tag_id }) => !tag_ids.includes(tag_id))
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
        // console.log("updated product tags")
        // console.log(updatedProductTags[0]);
        // if(updatedProductTags[0]!==0){
        //   return res.status(200).json(updatedProductTags);
        // }
        // ``````workking when tags are deleted display 200 instead of 400``````
        // }
      }//-----------------------------------end of if when tag_ids exist
      // console.log(productTagsBeforeUpdate && !productData.tag_ids);
      if(productTagsBeforeUpdate && !productData.tag_ids){
        return res.status(200).json(productData);
      }
      if (!productData[0]) {
        res.status(404).json({ message: `No products were updated with given id ${productId}!` });
      }else{
        res.status(200).json(productData);
      }
    } catch (error) {
      console.log(error);
      res.status(500).json(error);
    }
  }//end of outer if
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
