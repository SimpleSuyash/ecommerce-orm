const router = require('express').Router();
const { Tag, Product, ProductTag } = require('../../models');

// The `/api/tags` endpoint

router.get('/', async (req, res) => {
  // finds all tags
  // includes its associated Product data
  try {
    const tags = await Tag.findAll({
      include: [Product]
    });
    res.status(200).json(tags);
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
});

router.get('/:id', async (req, res) => {
  // finds a single tag by its `id`
  // includes its associated Product data
  const id = req.params.id;
  try {
    const tag = await Tag.findByPk(id, {
      include: [Product]
    });
    if (tag) {
      res.status(200).json(tag);
    } else {
      res.status(404).json({ message: `No tags found for given id ${id}!` });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
});

router.post('/', async (req, res) => {
  // create a new tag
  if (!req.body.tag_name){
    res.status(400).json({message: "Tag Name is required!"});
  }else if (req.body.tag_name.trim().length === 0) {
    // if(!req.body.tag_name){
    res.status(400).json({ message: "Tag Name cannot be empty!" });
  } else {
    try {
      const newTag = {"tag_name": req.body.tag_name.trim()};
      const tag = await Tag.create(newTag);
      res.status(200).json(tag);
    } catch (error) {
      console.log(error);
      res.status(500).json(error);
    }
  }
});

router.put('/:id', async (req, res) => {
  // updates a tag's name by its `id` value
  const tagId = req.params.id;
  let tag= await Tag.findByPk(tagId);

  if(!tag){
    res.status(404).json({ message: `No tags were found with given id ${tagId}!` });

  }else if(!req.body.tag_name){
    res.status(400).json({message: "Tag Name is required!"});

  }else if (req.body.tag_name.trim().length === 0) {
    res.status(400).json({ message: "Tag Name cannot be empty!" });

  } else {
    try {
      const newTag = {"tag_name": req.body.tag_name.trim()};
      const updatedTagData = await Tag.update(newTag, {
        where: {
          id: tagId
        }
      });
      
      // when updated data was same as previous data
      if (!updatedTagData[0]) {
        res.status(400).json({ message: `No tags were updated with given id ${tagId}!` });

      } else {
        //getting the updated tag data
        tag = await Tag.findByPk(tagId);
        res.status(200).json(tag);
      }
    } catch (error) {
      console.log(error);
      res.status(500).json(error);
    }
  }
});

router.delete('/:id', async (req, res) => {
  // delete on tag by its `id` value
  const tagId = req.params.id;
  try {
    const tagData = await Tag.destroy({
      where: {
        id: tagId
      }
    });
    if (!tagData) {
      res.status(404).json({ message: `No tags were deleted for given id ${tagId}!` });
    } else {
      res.status(200).json(tagData);
    }
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
});

module.exports = router;
