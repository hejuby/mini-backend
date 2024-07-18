const express = require("express");
const cors = require("cors");
const path = require("path");
const app = express();

const rooms = require("./room_data.json");

app.listen(8080, function () {
  console.log("listening on 8080");
});

app.use(cors());

app.get("/api/rooms/randoms", function (req, res) {
  const { map_x, map_y, radius } = req.query;

  if (!map_x || !map_y || !radius) {
    return res.status(400).send({
      result: {
        result_code: 400,
        result_message: "실패",
      },
      body: null,
    });
  }

  const randomRooms = rooms.filter(
    (room) =>
      Math.abs(room.map_x - map_x) * 50 < radius &&
      Math.abs(room.map_y - map_y) * 50 < radius
  );

  return res.status(200).send({
    result: {
      result_code: 200,
      result_message: "성공",
    },
    body: {
      room_response_list: randomRooms,
    },
  });
});

app.get("/api/rooms/city", function (req, res) {
  const { city, cursor_id } = req.query;

  if (!city) {
    return res.status(400).send({
      result: {
        result_code: 400,
        result_message: "실패",
      },
      body: null,
    });
  }

  const cityRooms = rooms
    .filter((room) => room.city === city)
    .sort((a, b) => a.id - b.id);

  if (cursor_id) {
    const cursorIndex = cityRooms.findIndex((room) => room.id === cursor_id);

    return res.status(200).send({
      result: {
        result_code: 200,
        result_message: "성공",
      },
      body: {
        room_response_list: cityRooms.slice(
          cursorIndex,
          cursorIndex + 15 < cityRooms.length - 1
            ? cursorIndex + 15
            : cityRooms.length - 1
        ),
      },
    });
  }

  return res.status(200).send({
    result: {
      result_code: 200,
      result_message: "성공",
    },
    body: {
      room_response_list: cityRooms.slice(0, 15),
    },
  });
});
