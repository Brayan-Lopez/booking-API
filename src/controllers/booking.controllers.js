const catchError = require('../utils/catchError');
const Booking = require('../models/Booking');
const Hotel = require('../models/Hotel');
const Image = require('../models/Image');

const getAll = catchError(async(req, res) => {
  const loggedUser = req.user
    const bookings = await Booking.findAll({
      where:{userId: loggedUser.id},
      include:{
        model:Hotel, include:{model:Image}
      }
    });
    return res.json(bookings);
});

const create = catchError(async(req, res) => {
  const loggedUser = req.user
  const {checkIn, checkOut, hotelId} = req.body
    const booking = await Booking.create({
      checkIn, checkOut, hotelId, userId: loggedUser.id
    });
    return res.status(201).json(booking);
});

const getOne = catchError(async(req, res) => {
    const { id } = req.params;
    const booking = await Booking.findByPk(id, {include:[Hotel]});
    if(!booking) return res.sendStatus(404);
    return res.json(booking);
});

const remove = catchError(async(req, res) => {
    const { id } = req.params;
    await Booking.destroy({ where: {id} });
    return res.sendStatus(204);
});

const update = catchError(async(req, res) => {
    const {checkIn, checkOut} = req.body
    const { id } = req.params;
    const booking = await Booking.update(
        {checkIn, checkOut},
        { where: {id}, returning: true }
    );
    if(booking[0] === 0) return res.sendStatus(404);
    return res.json(booking[1][0]);
});

module.exports = {
    getAll,
    create,
    getOne,
    remove,
    update
}