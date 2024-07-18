const express = require('express');
const cors = require('cors');
const path = require('path');
const app = express();

const rooms = require('./room_data.json');

app.listen(8080, function () {
  console.log('listening on 8080');
});

// app.use(express.static(path.join(__dirname, '../front/dist')));
app.use(cors());

app.get('/api/rooms/randoms', function (req, res) {
  const { map_x, map_y, radius } = req.query;

  if (!map_x || !map_y || !radius) {
    return res.status(400).send({
      result: {
        result_code: 400,
        result_message: '실패',
      },
      body: null,
    });
  }

  const randomRooms = rooms.filter(
    (room) =>
      Math.abs(room.map_x - map_x) * 50 < radius &&
      Math.abs(room.map_y - map_y) * 50 < radius,
  );

  return res.status(200).send({
    result: {
      result_code: 200,
      result_message: '성공',
    },
    body: {
      room_response_list: randomRooms,
    },
  });
});

// app.get('*', function (req, res) {
//   res.sendFile(path.join(__dirname, '../front/dist/index.html'));
// });
