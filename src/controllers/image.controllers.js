const catchError = require('../utils/catchError');
const {uploadToCloudinary, deleteFromCloudinary} = require('../utils/cloudinary')
const Image = require('../models/Image');

const getAll = catchError(async(req, res) => {
    const images = await Image.findAll();
    return res.json(images);
});

const create = catchError(async(req, res) => {
  if(!req.file) return res.status(400).json({message:'not image file'})
  const {url} = await uploadToCloudinary(req.file)
  const {hotelId} = req.body
    const image = await Image.create({
      url, hotelId
    })
    return res.status(201).json(image);
});

const getOne = catchError(async(req, res) => {
    const { id } = req.params;
    const image = await Image.findByPk(id);
    if(!image) return res.sendStatus(404);
    return res.json(image);
});

const remove = catchError(async(req, res) => {
    const { id } = req.params;
    const image = await Image.findByPk(id);
    if(!image) return res.status(404).json({message: 'image not found'})
    await deleteFromCloudinary(image.url)
    await image.destroy()
    return res.sendStatus(204);
});

const update = catchError(async(req, res) => {
    const { id } = req.params;
    const image = await Image.update(
        req.body,
        { where: {id}, returning: true }
    );
    if(image[0] === 0) return res.sendStatus(404);
    return res.json(image[1][0]);
});

module.exports = {
    getAll,
    create,
    getOne,
    remove,
    update
}