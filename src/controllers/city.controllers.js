const catchError = require('../utils/catchError');
const City = require('../models/City');

const getAll = catchError(async(req, res) => {
    const cities = await City.findAll();
    return res.json(cities);
});

const create = catchError(async(req, res) => {
  const {name, country, countryId} = req.body
  // const acronym = await countryId.toUpperCase()
    const city = await City.create({
      name, country, countryId
    });
    return res.status(201).json(city);
});

const getOne = catchError(async(req, res) => {
    const { id } = req.params;
    const city = await City.findByPk(id);
    if(!city) return res.sendStatus(404);
    return res.json(city);
});

const remove = catchError(async(req, res) => {
    const { id } = req.params;
    await City.destroy({ where: {id} });
    return res.sendStatus(204);
});

const update = catchError(async(req, res) => {
    const { id } = req.params;
    const city = await City.update(
        req.body,
        { where: {id}, returning: true }
    );
    if(city[0] === 0) return res.sendStatus(404);
    return res.json(city[1][0]);
});

module.exports = {
    getAll,
    create,
    getOne,
    remove,
    update
}