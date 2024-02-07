const redis = require('redis');
const express = require('express');
const { promisify } = require('util');
const kue = require('kue');

//redis
const Newclient = redis.createClient();
const getAsync = promisify(Newclient.get).bind(Newclient);

//kue
const queue = kue.createQueue();

//express
const app = express();
const port = 1245;

// reservationEnabled a boolean variable
let reservationEnabled;

const reserveSeat = (number) => {
  Newclient.set('available_seats', number);
};

const getCurrentAvailableSeats = () => {
  return getAsync('available_seats');
};

app.get('/available_seats', (req, res) => {
  getCurrentAvailableSeats()
    .then((seat) => {
      res.json({'available_seats': seat});
    });
});

app.get('/reserve_seat', (req, res) => {
  if (reservationEnabled === false) {
    res.json({ status: 'Reservation confirmed' });
  }
  const job = queue.create('reserve_seat', { x: 'reserve_seat' })
    .save((err) => {
      if (!err) return res.json({ "status": "Reservation in process" });
      return res.json({ "status": "Reservation failed" });
    });

  job.on('complete', () => {
    console.log(`Seat reservation job ${job.id} completed`);
  });

  job.on('failed', (err) => {
    console.log(`Seat reservation job ${job.id} failed: ${err}`);
  });
});

app.get('/process', (req, res) => {
  res.json({"status": "Queue processing"});
  queue.process('reserve_seat', async(job, done) => {
    let avaSeats = await getCurrentAvailableSeats();
    avaSeats -= 1;
    //console.log(222);
    reserveSeat(avaSeats);
    if (avaSeats === 0) {
      reservationEnabled = false;
    }
    if (avaSeats >= 0) {
      done();
    }
    done(new Error('Not enough seats available'));
  });
});

app.listen(port, () => {
  reserveSeat(50);
  reservationEnabled = true;
  console.log(`app listening at http://localhost:${port}`);
});