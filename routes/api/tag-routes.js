const router = require('express').Router();
const { Tag, Product, ProductTag } = require('../../models');

// The `/api/tags` endpoint

router.get('/', async (req, res) => {
  // finds all tags
  // includes its associated Product data
  try {
    const tagData = await Tag.findAll({
      include: [Product]
    });
    res.status(200).json(tagData);
  } catch (error) {
    res.status(500).json(error);
  }
});

router.get('/:id', async (req, res) => {
  // finds a single tag by its `id`
  // includes its associated Product data
  const id = req.params.id;
  try {
    const tagData = await Tag.findByPk(id,{
      include: [Product]
    });
    if(tagData){
      res.status(200).json(tagData);
    }else{
      res.status(404).json({ message: `No tags found for given id ${id}!` });
    }
  } catch (error) {
    res.status(500).json(error);
  }
});

router.post('/', async(req, res) => {
  // create a new tag
  if(req.body.tag_name.trim().length === 0){
  // if(!req.body.tag_name){
    res.status(400).json({message: "tag Name cannot be empty!"});
  }else{
    const newTag = {
      tag_name: req.body.tag_name
    };
    try {
      const tagData = await Tag.create(newTag);
      res.status(200).json(tagData);
    } catch (error) {
      res.status(500).json(error);
    }
  }
});

router.put('/:id', async(req, res) => {
  // updates a tag's name by its `id` value
  const tagId = req.params.id;
  if(req.body.tag_name.trim().length === 0){
    res.status(400).json({message: "Tag Name cannot be empty!"});
  }else{
    const newTag = {
      tag_name: req.body.tag_name
    };
    try {
      const tagData = await Tag.update(newTag,{
        where:{
          id : tagId
        } 
      });
      if (!tagData[0]) {
        res.status(404).json({ message: `No tags were updated with given id ${tagId}!` });
      }else{
        res.status(200).json(tagData);
      }
    } catch (error) {
      res.status(500).json(error);
    }
  }
});

router.delete('/:id', async(req, res) => {
  // delete on tag by its `id` value
  const tagId = req.params.id;
  try {
    const tagData = await Tag.destroy({
      where:{
        id : tagId
      } 
    });
    if (!tagData) {
      res.status(404).json({ message: `No tags were deleted for given id ${tagId}!` });
    }else{
      res.status(200).json(tagData);
    }
  } catch (error) {
    res.status(500).json(error);
  }
});

module.exports = router;
