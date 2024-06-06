const catchError = require('../utils/catchError');
const Hotel = require('../models/Hotel');
const {Op} = require('sequelize');
const Review = require('../models/Review');
const City = require('../models/City');
const Image = require('../models/Image');

const getAll = catchError(async(req, res) => {
    const { name, cityId } = req.query;
    const where = {}
    if (name) where.name = { [Op.iLike]: `%${name}%`}
    if (cityId) where.cityId = cityId
    const results = await Hotel.findAll({
       where: where,
       include: [Image, City]
    });
    const hotelsWithAvgPromises = results.map(async hotel => {
        const hotelJSON = hotel.toJSON();
        const reviews = await Review.findAll({where: {hotelId: hotel.id}, raw: true});
        let average = 0;
        reviews.forEach(review => {
            average += +review.rating;
        })
        return {
            ...hotelJSON,
            average: +(average / reviews.length).toFixed(2), 
            // reviews
        }
    })
    const hotelsWithAvg = await Promise.all(hotelsWithAvgPromises)
    return res.json(hotelsWithAvg);
});

const create = catchError(async(req, res) => {
    const hotel = await Hotel.create(req.body);
    return res.status(201).json(hotel);
});

const getOne = catchError(async(req, res) => {
    const { id } = req.params;
    const hotel = await Hotel.findByPk(id, {include:[Image, City]});
    if(!hotel) return res.sendStatus(404);
    return res.json(hotel);
});

const remove = catchError(async(req, res) => {
    const { id } = req.params;
    await Hotel.destroy({ where: {id} });
    return res.sendStatus(204);
});

const update = catchError(async(req, res) => {
    const { id } = req.params;
    const hotel = await Hotel.update(
        req.body,
        { where: {id}, returning: true }
    );
    if(hotel[0] === 0) return res.sendStatus(404);
    return res.json(hotel[1][0]);
});

module.exports = {
    getAll,
    create,
    getOne,
    remove,
    update
}