const router = require('express').Router();
const { Product, Category, Tag, ProductTag } = require('../../models');

// The `/api/products` endpoint

// get all products
router.get('/', async (req, res) => {
  // finds all products
  // includes its associated Category and Tag data
  try {
    const product = await Product.findAll({
      include: [Category, Tag]
    });
    res.status(200).json(product);
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
    const product = await Product.findByPk(id,{
      include: [Category, Tag]
    });
    if(product){
      res.status(200).json(product);
    }else{
      res.status(404).json({ message: `No products found for given id ${id}!` });
    }
  } catch (error) {
    res.status(500).json(error);
  }
});

// create new product
router.post('/', async (req, res) => {
  let product;
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
      product= await Product.create(newProduct);
      const productId= product.id;
      // if there's product tags, we need to create pairings to bulk create in the ProductTag model
      if (tag_ids && tag_ids.length) {

        const productTagIdArr = tag_ids.map(tag_id => {
          return {
            product_id: productId,
            tag_id,
          };
        });

        const productTagIds = await ProductTag.bulkCreate(productTagIdArr);
        product = await Product.findByPk(productId,{include:[Tag]});
        res.status(200).json(product);
      } else {
        // if no product tags, just respond
        res.status(200).json(product);
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
  let product = await Product.findByPk(productId);
  const  productTags = await ProductTag.findAll({
    where: {
      product_id: productId
    }
  });
  const {product_name, price, stock, category_id, tag_ids} =req.body;

  if (!product){
    res.status(404).json({ message: `No products were found with given id ${productId}!` });

  }else if(!(product_name && price && stock)) {
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
      const updateProductData = await Product.update(newProduct, {
        where: {
          id: productId
        }
      });

      
      if(productTags && productTags.length){//----------------When ProductTags exist for given product

        //getting current ProductTag ids
        const productTagIds = productTags.map(({ tag_id }) => tag_id);

        
        if (req.body.tag_ids && req.body.tag_ids.length) {//-----------------------When req has tag/s
          
          //creating new ProductTag objects
          const newProductTags = tag_ids
          //chosing only those req tag_ids that don't already exist in current ProductTag ids
            .filter((tag_id) => !productTagIds.includes(tag_id))
            .map((tag_id) => {
              return {
                product_id: req.params.id,
                tag_id,
              };
            });

          // figure out which ones to remove
          const productTagsToRemove = productTags
          //chosing only those ProductTag ids which don't match those in req tag ids
            .filter(({ tag_id }) => !tag_ids.includes(tag_id))
            .map(({ id }) => id);

          // run both actions
          const updatedProductTags = await Promise.all([
            //removing ProductTags which don't match req tags
            ProductTag.destroy({
              where: {
                id: productTagsToRemove
              }
            }),
            //creating new ProductTags if not already exist which match req tags
            ProductTag.bulkCreate(newProductTags),
          ]);
          //after updating both Product and ProductTag,
          //if updates were none
          //req data must be same as existing data
          if(!updateProductData[0] && !updatedProductTags[0]){
            return res.status(400).json({ message: `No products were updated with given id ${productId}!` });
          }
          //when update was succesful
          //when either Product or ProductTag or both were updated
          product = await Product.findByPk(productId, {include: [Tag]});
          res.status(200).json(product);

        }else{//---------------------------------------------- when req doesn't have any tags
          
          // getting ProductTagIds to remove
          const productTagsToRemove = productTags
            .map(({ id }) => id);

          //updating ProductTags
          const updatedProductTags = await Promise.all([
            //since req doesn't have new tags
            //just remove the existing ProductTags
            ProductTag.destroy({
              where: {
                id: productTagsToRemove
              }
            })
          ]);
          
          product = await Product.findByPk(productId, {include: [Tag]});
          res.status(200).json(product);
        }
      }else{//--------------------------------------------- When ProductTag doesn't exist for given product

        if (req.body.tag_ids && req.body.tag_ids.length) {//-----------------------When req has tag/s

          //creating ProductTags for all the req tags
          //The given product had no previous ProductTags
          //so no need to filter or delete
          const newProductTags = tag_ids
            .map((tag_id) => {
              return {
                product_id: req.params.id,
                tag_id,
              };
            });

          await ProductTag.bulkCreate(newProductTags);
          
          product = await Product.findByPk(productId, {include: [Tag]});
          res.status(200).json(product); 

        }else{//--------------------------------------------------------------- when req doesn't have any tags
          //since the product doesn't have any associated ProductTags
          //check only if the product  itself was updated
          if(!updateProductData[0] ){
            return res.status(400).json({ message: `No products were updated with given id ${productId}!` });
          }
          //when product was updated
          product = await Product.findByPk(productId, {include: [Tag]});
          res.status(200).json(product);
        }
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
