const mongoose = require('mongoose');
const Trip = require('../models/travlr');
//const Trip = mongoose.model('trips');
const User = mongoose.model('User');

//const getUser = (req, res, callback) => {
  //  if (req.payload && req.payload.email) {
    //  User.findOne({ email: req.payload.email }).exec((err, user) => {
      //  if (!user) {
        //  return res.status(404).json({ message: 'User not found' });
        //} else if (err) {
          //console.log(err);
         // return res.status(404).json(err);
        //}
        //callback(req, res, user.name);
      //});
   // } else {
     // return res.status(404).json({ message: 'User not found' });
 //   }
  //};

  const getUser = async (req, res, callback) => {
    if (req.payload && req.payload.email) {
        try {
            const user = await User.findOne({ email: req.payload.email }).exec();
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }
            callback(req, res, user.name);
        } catch (err) {
            console.log(err);
            return res.status(404).json(err);
        }
    } else {
        return res.status(404).json({ message: 'User not found' });
    }
};

const tripsAddTrip = async (req, res) => {
    getUser(req, res, async (req, res)=> {
            Trip
    try {
        const newTrip = new Trip({
            code: req.body.code,
            name: req.body.name,
            length: req.body.length,
            start: req.body.start,
            resort: req.body.resort,
            perPerson: req.body.perPerson,
            image: req.body.image,
            description: req.body.description
        });

        const q = await newTrip.save();

        return res.status(201).json(q);
    } catch (err) {
        return res.status(400).json({ "message": "Error adding trip", "error": err });
    }
}
    );
};

const tripsList = async (req, res) => {
    try {
        const q = await Trip.find({}).exec();
        console.log(q);

        if (!q.length) {
            return res.status(404).json({ "message": "No trips found" });
        } else {
            return res.status(200).json(q);
        }
    } catch (err) {
        return res.status(400).json({ "message": "Error fetching trips", "error": err });
    }
};

const tripsFindByCode = async (req, res) => {
    try {
        const q = await Trip.find({ 'code': req.params.tripCode }).exec();

        if (!q.length) {
            return res.status(404).json({ "message": "Trip not found" });
        } else {
            return res.status(200).json(q);
        }
    } catch (err) {
        return res.status(400).json({ "message": "Error fetching trip", "error": err });
    }
};

const tripsUpdateTrip = async (req, res) => {
    getUser(req, res, async (req,res) => {
    try {
        console.log(req.params);
        console.log(req.body);

        const q = await Trip.findOneAndUpdate(
            { 'code': req.params.tripCode },
            {
                code: req.body.code,
                name: req.body.name,
                length: req.body.length,
                start: req.body.start,
                resort: req.body.resort,
                perPerson: req.body.perPerson,
                image: req.body.image,
                description: req.body.description
            },
            { new: true }
        )

        if (!q) {
            return res.status(404).json({ "message": "Trip not found" });
        } else {
            return res.status(200).json(q);
        }
    } catch (err) {
        return res.status(400).json({ "message": "Error updating trip", "error": err });
    }
}
    );
};



module.exports = {
    tripsList,
    tripsFindByCode,
    tripsAddTrip,
    tripsUpdateTrip
};
